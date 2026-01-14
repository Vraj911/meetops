const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Meeting = require('../models/Meeting');
const Review = require('../models/Review');
const AiOutput = require('../models/AiOutput');
const { jiraClient } = require('../config/jira');
const calendarService = require('../services/calendar.service');
const axios = require('axios');

/**
 * DEV ONLY: Reset all demo/seeded data
 * Clears meetings, reviews, AI outputs, and optionally users/workspaces
 */
exports.resetData = async (req, res, next) => {
  try {
    const { includeUsers = false } = req.query;

    const results = {
      deleted: {},
      message: '',
    };

    // Delete AI Outputs
    const aiDeleted = await AiOutput.deleteMany({});
    results.deleted.aiOutputs = aiDeleted.deletedCount;

    // Delete Reviews
    const reviewsDeleted = await Review.deleteMany({});
    results.deleted.reviews = reviewsDeleted.deletedCount;

    // Delete Meetings
    const meetingsDeleted = await Meeting.deleteMany({});
    results.deleted.meetings = meetingsDeleted.deletedCount;

    // Optionally delete Workspaces and Users
    if (includeUsers === 'true') {
      const workspacesDeleted = await Workspace.deleteMany({});
      results.deleted.workspaces = workspacesDeleted.deletedCount;

      const usersDeleted = await User.deleteMany({});
      results.deleted.users = usersDeleted.deletedCount;
    }

    results.message = `Reset complete. Deleted ${results.deleted.meetings} meetings, ${results.deleted.reviews} reviews, ${results.deleted.aiOutputs} AI outputs`;
    
    if (includeUsers === 'true') {
      results.message += `, ${results.deleted.workspaces} workspaces, ${results.deleted.users} users`;
    }

    results.warning = 'Note: Jira issues and Calendar events are NOT automatically deleted. Clean them up manually if needed.';

    return res.json({ success: true, data: results });
  } catch (error) {
    return next(error);
  }
};

/**
 * DEV ONLY: Get summary of current data
 */
exports.getDataSummary = async (req, res, next) => {
  try {
    const [
      usersCount,
      workspacesCount,
      meetingsCount,
      reviewsCount,
      aiOutputsCount,
    ] = await Promise.all([
      User.countDocuments(),
      Workspace.countDocuments(),
      Meeting.countDocuments(),
      Review.countDocuments(),
      AiOutput.countDocuments(),
    ]);

    const meetings = await Meeting.find()
      .select('_id title status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      success: true,
      data: {
        counts: {
          users: usersCount,
          workspaces: workspacesCount,
          meetings: meetingsCount,
          reviews: reviewsCount,
          aiOutputs: aiOutputsCount,
        },
        recentMeetings: meetings,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * DEV ONLY: List Jira issues in project
 */
exports.listJiraIssues = async (req, res, next) => {
  try {
    const { projectKey, maxResults = 50 } = req.query;
    const project = projectKey || process.env.JIRA_PROJECT_KEY;

    if (!project) {
      return res.status(400).json({
        success: false,
        error: "Project key required"
      });
    }

    const jql = `project = ${project} ORDER BY created DESC`;

    const auth = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
    ).toString("base64");

    const response = await axios.post(
      `${process.env.JIRA_HOST}/rest/api/3/search/jql`,
      {
        jql,
        maxResults: Number(maxResults),
        fields: [
          "summary",
          "status",
          "issuetype",
          "created",
          "description"
        ]
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const issues = response.data.issues.map((issue) => {
  const description =
    issue.fields.description?.content?.[0]?.content?.[0]?.text || "";

  return {
    key: issue.key,
    id: issue.id,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    type: issue.fields.issuetype.name,
    created: issue.fields.created,
    description,
    url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
  };
});

    return res.json({
      success: true,
      data: {
        total: response.data.total,
        issues
      }
    });
  } catch (error) {
    console.error("❌ Jira list failed:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error:
        error.response?.data?.errorMessages?.[0] ||
        error.message ||
        "Failed to list Jira issues"
    });
  }
};


/**
 * DEV ONLY: Delete Jira issue by key
 */
exports.deleteJiraIssue = async (req, res, next) => {
  try {
    const { issueKey } = req.params;

    if (!issueKey) {
      return res.status(400).json({
        success: false,
        error: 'Issue key required',
      });
    }

    await jiraClient.deleteIssue(issueKey);

    return res.json({
      success: true,
      message: `Jira issue ${issueKey} deleted`,
    });
  } catch (error) {
    console.error(`Failed to delete Jira issue ${req.params.issueKey}:`, error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * DEV ONLY: Delete Calendar event by ID
 */
exports.deleteCalendarEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { calendarId = 'primary' } = req.query;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        error: 'Event ID required',
      });
    }

    await calendarService.deleteEvent(eventId, calendarId);

    return res.json({
      success: true,
      message: `Calendar event ${eventId} deleted from ${calendarId}`,
    });
  } catch (error) {
    console.error(`Failed to delete calendar event ${req.params.eventId}:`, error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * DEV ONLY: Bulk delete Jira issues by keys
 */
exports.bulkDeleteJiraIssues = async (req, res, next) => {
  try {
    const { issueKeys } = req.body;

    if (!Array.isArray(issueKeys) || issueKeys.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'issueKeys array required in body',
      });
    }

    const results = {
      deleted: [],
      failed: [],
    };

    for (const key of issueKeys) {
      try {
        await jiraClient.deleteIssue(key);
        results.deleted.push(key);
        console.log(`✓ Deleted ${key}`);
      } catch (error) {
        results.failed.push({ key, error: error.message });
        console.error(`✗ Failed to delete ${key}:`, error.message);
      }
    }

    return res.json({
      success: true,
      data: {
        totalDeleted: results.deleted.length,
        totalFailed: results.failed.length,
        deleted: results.deleted,
        failed: results.failed,
      },
    });
  } catch (error) {
    return next(error);
  }
};
