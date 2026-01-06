const reviewService = require("../services/review.service");

exports.get = async (req, res, next) => {
  try {
    const result = await reviewService.get(req.params.meetingId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const result = await reviewService.approve(req.params.meetingId, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.refine = async (req, res, next) => {
  try {
    const result = await reviewService.refine(req.params.meetingId, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
