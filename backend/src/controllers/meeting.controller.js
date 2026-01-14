const meetingService = require("../services/meeting.service");
const Meeting = require("../models/Meeting");

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
    // Transform _id to id for frontend compatibility
    const data = result.toObject ? result.toObject() : result;
    data.id = data._id;
    return res.json({ success: true, data });
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
    // Transform _id to id for frontend compatibility
    if (result.meeting) {
      const data = result.meeting.toObject ? result.meeting.toObject() : result.meeting;
      data.id = data._id;
      result.meeting = data;
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};
