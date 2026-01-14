const jiraService = require("../services/jira.service");
const calendarService = require("../services/calendar.service");
const Meeting = require("../models/Meeting");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const mongoose = require("mongoose");

exports.syncJira = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const payload = req.body || {};

    // If review payload provided, sync directly from payload; else fallback to DB-driven sync
    const hasPayload =
      Array.isArray(payload.actionItems) ||
      Array.isArray(payload.finalActionItems) ||
      payload.summary !== undefined ||
      payload.finalSummary !== undefined ||
      payload.projectKey !== undefined;

    const force = payload.force === true;

    // Only verify meeting exists if NOT using force mode and NOT using payload
    if (!force && !hasPayload && mongoose.Types.ObjectId.isValid(meetingId)) {
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
        return res.status(404).json({ success: false, error: 'Meeting not found' });
      }
    }

    const result = hasPayload
      ? await jiraService.syncReviewDataToJira(meetingId, payload)
      : await jiraService.syncMeetingToJira(meetingId);

    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

exports.syncCalendar = async (req, res, next) => {
  try {
    let { meetingId } = req.params;
    const payload = req.body || {};
    const force = payload.force === true;

    let meeting = null;

    // Ensure we have a user/workspace when force is enabled
    const ensureWorkspaceAndUser = async () => {
      const autoSyncEmail = payload.createdByEmail || 'auto-sync@example.com';
      
      // Try to find existing user, or create if not found
      let user = await User.findOne({ email: autoSyncEmail });
      if (!user) {
        try {
          user = await User.create({
            email: autoSyncEmail,
            name: payload.createdByName || 'Auto Sync User',
            role: 'OWNER',
          });
        } catch (err) {
          // If duplicate key error, fetch the user (race condition)
          if (err.code === 11000) {
            user = await User.findOne({ email: autoSyncEmail });
          } else {
            throw err;
          }
        }
      }

      let workspace = await Workspace.findOne();
      if (!workspace) {
        workspace = await Workspace.create({
          name: payload.workspaceName || 'Auto Sync Workspace',
          ownerId: user._id,
          members: [{ userId: user._id, role: 'OWNER' }],
        });
      }

      return { user, workspace };
    };

    // If force is enabled, auto-create a minimal meeting when ID is invalid or missing
    if (force && !mongoose.Types.ObjectId.isValid(meetingId)) {
      const { user, workspace } = await ensureWorkspaceAndUser();
      const stub = await Meeting.create({
        title: payload.meetingTitle || 'Ad-hoc Meeting',
        status: 'APPROVED',
        duration: payload.duration || 45,
        participants: payload.participants || [],
        sourceType: 'TRANSCRIPT',
        workspaceId: workspace._id,
        createdBy: user._id,
        sourceUrl: payload.sourceUrl || undefined,
      });
      meetingId = stub._id.toString();
      meeting = stub;
    }

    // Validate meeting ID when not already created
    if (!meeting && !mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid meeting ID format' 
      });
    }

    // Check if meeting exists (or create when forced)
    if (!meeting) {
      meeting = await Meeting.findById(meetingId);
      if (!meeting && force) {
        const { user, workspace } = await ensureWorkspaceAndUser();
        const stub = await Meeting.create({
          title: payload.meetingTitle || 'Ad-hoc Meeting',
          status: 'APPROVED',
          duration: payload.duration || 45,
          participants: payload.participants || [],
          sourceType: 'TRANSCRIPT',
          workspaceId: workspace._id,
          createdBy: user._id,
          sourceUrl: payload.sourceUrl || undefined,
        });
        meeting = stub;
        meetingId = stub._id.toString();
      }
      if (!meeting) {
        return res.status(404).json({ 
          success: false, 
          error: 'Meeting not found' 
        });
      }
    }

    // Check meeting status (allow APPROVED or SYNCED, or bypass with force)
    if (!force && meeting.status !== 'APPROVED' && meeting.status !== 'SYNCED') {
      return res.status(400).json({ 
        success: false, 
        error: 'Meeting must be approved before syncing to calendar',
        currentStatus: meeting.status 
      });
    }

    // Sync options
    const options = {
      calendarId: payload.calendarId || 'primary',
      actionItems: payload.actionItems || payload.finalActionItems,
    };

    // Execute sync
    const result = await calendarService.syncCalendar(meetingId, options);

    return res.json({ 
      success: true, 
      message: 'Calendar sync completed',
      data: result 
    });
  } catch (error) {
    console.error('Calendar sync error:', error);
    
    // Handle specific calendar errors
    if (error.message.includes('not configured')) {
      return res.status(503).json({
        success: false,
        error: 'Calendar service not configured',
        details: error.message,
      });
    }

    if (error.message.includes('No action items')) {
      return res.status(400).json({
        success: false,
        error: 'No action items found to sync',
      });
    }

    return next(error);
  }
};
