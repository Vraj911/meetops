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

exports.upload = async (req, res) => {
  try {
    const result = await meetingService.upload(req.body);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

exports.start = async (req, res) => {
  try {
    const result = await meetingService.start(req.params.id);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await meetingService.getById(req.params.id);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};
