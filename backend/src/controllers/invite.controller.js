const inviteService = require("../services/invite.service");

exports.send = async (req, res, next) => {
  try {
    const result = await inviteService.send(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.validate = async (req, res, next) => {
  try {
    const result = await inviteService.validate(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.accept = async (req, res, next) => {
  try {
    const result = await inviteService.accept(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
