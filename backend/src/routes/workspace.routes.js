const express = require("express");
const workspaceController = require("../controllers/workspace.controller");

const router = express.Router();

router.get("/", workspaceController.getAllWorkspaces);
router.get("/workspace", workspaceController.getWorkspace);
router.post("/invite", workspaceController.invite);

module.exports = router;
