const docsService = require("../services/docs.service");

exports.ask = async (req, res, next) => {
  try {
    const result = await docsService.ask(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
