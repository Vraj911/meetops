const express = require('express');
const devController = require('../controllers/dev.controller');

const router = express.Router();

// Get data summary
router.get('/summary', devController.getDataSummary);

// Reset/clear all data
router.delete('/reset', devController.resetData);

// Jira management
router.get('/jira/issues', devController.listJiraIssues);
router.delete('/jira/issues/:issueKey', devController.deleteJiraIssue);
router.post('/jira/issues/bulk-delete', devController.bulkDeleteJiraIssues);

// Calendar management
router.delete('/calendar/events/:eventId', devController.deleteCalendarEvent);

module.exports = router;
