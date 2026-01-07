const meetingService = require("../services/meeting.service");
const { Meeting } = require("../config/mongoose");

exports.getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find().populate(["workspaceId", "createdBy"]);
    return res.json({ success: true, data: meetings });
  } catch (error) {
    return next(error);
  }
};

exports.upload = async (req, res, next) => {
  try {
    const result = await meetingService.upload(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.start = async (req, res, next) => {
  try {
    const result = await meetingService.start(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const result = await meetingService.getById(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
