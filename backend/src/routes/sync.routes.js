const express = require("express");
const syncController = require("../controllers/sync.controller");

const router = express.Router();

router.post("/:meetingId/jira", syncController.syncJira);
router.post("/:meetingId/calendar", syncController.syncCalendar);

module.exports = router;
