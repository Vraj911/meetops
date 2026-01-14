const workspaceService = require("../services/workspace.service");
const Workspace = require("../models/Workspace");

exports.getAllWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find().populate("ownerId");
    return res.json({ success: true, data: workspaces });
  } catch (error) {
    return next(error);
  }
};

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
