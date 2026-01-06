const express = require("express");
const meetingController = require("../controllers/meeting.controller");

const router = express.Router();

router.post("/upload", meetingController.upload);
router.post("/:id/start", meetingController.start);
router.get("/:id", meetingController.getById);

module.exports = router;
