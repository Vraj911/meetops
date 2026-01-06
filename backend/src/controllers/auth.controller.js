const authService = require("../services/auth.service");

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
