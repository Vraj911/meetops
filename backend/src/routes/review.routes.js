const express = require("express");
const reviewController = require("../controllers/review.controller");

const router = express.Router();

router.get("/:meetingId", reviewController.get);
router.post("/:meetingId/approve", reviewController.approve);
router.post("/:meetingId/refine", reviewController.refine);

module.exports = router;
