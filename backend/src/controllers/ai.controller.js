const aiService = require("../services/ai.service");

exports.process = async (req, res, next) => {
  try {
    const result = await aiService.process(req.params.meetingId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.getOutput = async (req, res, next) => {
  try {
    const result = await aiService.getOutput(req.params.meetingId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
