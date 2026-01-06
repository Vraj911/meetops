const express = require("express");
const aiController = require("../controllers/ai.controller");

const router = express.Router();

router.post("/process/:meetingId", aiController.process);
router.get("/output/:meetingId", aiController.getOutput);

module.exports = router;
