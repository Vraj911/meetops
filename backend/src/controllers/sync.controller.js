const jiraService = require("../services/jira.service");
const calendarService = require("../services/calendar.service");

exports.syncJira = async (req, res, next) => {
  try {
    const result = await jiraService.sync(req.params.meetingId, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.syncCalendar = async (req, res, next) => {
  try {
    const result = await calendarService.sync(req.params.meetingId, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
