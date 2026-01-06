const workspaceService = require("../services/workspace.service");

exports.getWorkspace = async (req, res, next) => {
  try {
    const result = await workspaceService.getWorkspace(req);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.invite = async (req, res, next) => {
  try {
    const result = await workspaceService.invite(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
