const { jiraClient } = require('../config/jira');
const { Meeting, AiOutput, Review } = require('../config/mongoose');

/**
 * Jira Service - Sync approved action items to Jira
 */

/**
 * Create Jira issue from action item
 * @param {Object} data - { summary, description, issueType, projectKey }
 * @returns {Promise<Object>} - { key, id, url }
 */
exports.createIssue = async (data) => {
  try {
    const { summary, description, issueType = 'Task', projectKey } = data;

    const issue = await jiraClient.addNewIssue({
      fields: {
        project: {
          key: projectKey || process.env.JIRA_PROJECT_KEY,
        },
        summary,
        description: description || '',
        issuetype: {
          name: issueType,
        },
      },
    });

    console.log(`✓ Jira issue created: ${issue.key}`);
    return {
      key: issue.key,
      id: issue.id,
      url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
    };
  } catch (error) {
    console.error('✗ Failed to create Jira issue:', error.message);
    throw error;
  }
};

/**
 * Create multiple issues from action items
 * @param {Array} actionItems - [{ title, ownerHint, confidence }]
 * @param {String} meetingId - Meeting ID for linking
 * @returns {Promise<Array>} - Created issue keys
 */
exports.createIssuesFromActionItems = async (actionItems, meetingId) => {
  try {
    const createdIssues = [];

    for (const item of actionItems) {
      const issue = await exports.createIssue({
        summary: item.title,
        description:
          item.description || `Owner: ${item.ownerHint || 'Unassigned'}\nConfidence: ${item.confidence ?? 'n/a'}`,
        issueType: item.issueType || 'Task',
        projectKey: item.projectKey || process.env.JIRA_PROJECT_KEY,
      });

      // Store linkage in metadata (optional)
      createdIssues.push({
        meetingId,
        issueKey: issue.key,
        actionItemTitle: item.title,
        createdAt: new Date(),
      });
    }

    return createdIssues;
  } catch (error) {
    console.error('✗ Failed to create issues:', error.message);
    throw error;
  }
};

/**
 * Add comment to Jira issue
 * @param {String} issueKey - Jira issue key (e.g., "PROJ-123")
 * @param {String} comment - Comment text
 */
exports.addComment = async (issueKey, comment) => {
  try {
    await jiraClient.addComment(issueKey, comment);

    console.log(`✓ Comment added to ${issueKey}`);
  } catch (error) {
    console.error(`✗ Failed to add comment to ${issueKey}:`, error.message);
    throw error;
  }
};

/**
 * Sync meeting to Jira (Full workflow)
 * 1. Load meeting + AI output + review
 * 2. Create issues from approved action items
 * 3. Add summary as comment
 * 4. Update meeting status
 *
 * @param {String} meetingId
 * @returns {Promise<Object>} - { ok, createdIssues, message }
 */
exports.syncMeetingToJira = async (meetingId) => {
  try {
    // 1. Load meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    // Verify status is APPROVED
    if (meeting.status !== 'APPROVED') {
      throw new Error(`Cannot sync: meeting status is ${meeting.status}, expected APPROVED`);
    }

    // 2. Load approved review
    const review = await Review.findOne({ meetingId }).sort({ createdAt: -1 });
    if (!review || !review.finalActionItems) {
      throw new Error('No approved review found for this meeting');
    }

    // 3. Load AI output for summary
    const aiOutput = await AiOutput.findOne({ meetingId }).sort({ version: -1 });
    const summary = aiOutput?.summary?.[0] || 'No summary available';

    // 4. Create Jira issues
    const createdIssues = await exports.createIssuesFromActionItems(
      review.finalActionItems,
      meetingId
    );

    // 5. Add meeting summary as comment on first issue (if exists)
    if (createdIssues.length > 0) {
      const firstIssue = createdIssues[0];
      await exports.addComment(
        firstIssue.issueKey,
        `📋 Summary from Meeting:\n\n${summary}\n\nSync Date: ${new Date().toISOString()}`
      );
    }

    // 6. Update meeting status to SYNCED
    meeting.status = 'SYNCED';
    await meeting.save();

    console.log(`✓ Meeting ${meetingId} synced to Jira`);

    return {
      ok: true,
      createdIssues,
      message: `Created ${createdIssues.length} issue(s) in Jira`,
    };
  } catch (error) {
    console.error('✗ Jira sync failed:', error.message);
    throw error;
  }
};

/**
 * Sync review payload directly to Jira
 * Accepts JSON from the review page (AI-generated + human-confirmed)
 * Shape: { actionItems[] | finalActionItems[], summary | finalSummary, projectKey? }
 */
exports.syncReviewDataToJira = async (meetingId, reviewData) => {
  try {
    let meeting = null;
    const force = reviewData?.force === true;
    const mongoose = require('mongoose');

    // Optionally enforce meeting existence and APPROVED status when not forced
    if (!force && mongoose.Types.ObjectId.isValid(meetingId)) {
      meeting = await Meeting.findById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.status !== 'APPROVED') {
        throw new Error(`Cannot sync: meeting status is ${meeting.status}, expected APPROVED`);
      }
    }

    const items = reviewData.finalActionItems || reviewData.actionItems || [];
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('No action items provided');
    }

    const summaryText =
      (typeof reviewData.finalSummary === 'string' && reviewData.finalSummary) ||
      (typeof reviewData.summary === 'string' && reviewData.summary) ||
      reviewData.finalSummary?.text ||
      reviewData.summary?.text ||
      'No summary provided';

    const createdIssues = await exports.createIssuesFromActionItems(
      items.map((it) => ({ ...it, projectKey: reviewData.projectKey || it.projectKey })),
      meetingId
    );

    if (createdIssues.length > 0) {
      const firstIssue = createdIssues[0];
      await exports.addComment(
        firstIssue.issueKey,
        `📋 Summary from Meeting:\n\n${summaryText}\n\nSync Date: ${new Date().toISOString()}`
      );
    }

    if (meeting) {
      meeting.status = 'SYNCED';
      await meeting.save();
    }

    return {
      ok: true,
      createdIssues,
      message: `Created ${createdIssues.length} issue(s) in Jira from review payload`,
    };
  } catch (error) {
    console.error('✗ Jira sync (payload) failed:', error.message);
    throw error;
  }
};

/**
 * Get Jira issue details
 * @param {String} issueKey - Jira issue key
 */
exports.getIssue = async (issueKey) => {
  try {
    const issue = await jiraClient.findIssue(issueKey);

    return {
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name,
      assignee: issue.fields.assignee?.displayName,
      url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
    };
  } catch (error) {
    console.error('✗ Failed to get issue:', error.message);
    throw error;
  }
};
