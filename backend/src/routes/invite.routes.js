const express = require("express");
const inviteController = require("../controllers/invite.controller");

const router = express.Router();

router.post("/send", inviteController.send);
router.get("/validate", inviteController.validate);
router.post("/accept", inviteController.accept);

module.exports = router;
