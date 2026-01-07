const jiraService = require("../services/jira.service");
const { Meeting } = require("../config/mongoose");
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
    const { meetingId } = req.params;
    
    // TODO: Implement calendar sync
    return res.json({ success: true, message: 'Calendar sync not yet implemented' });
  } catch (error) {
    return next(error);
  }
};
