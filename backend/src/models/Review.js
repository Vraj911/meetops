const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    finalSummary: { type: mongoose.Schema.Types.Mixed },
    finalActionItems: { type: mongoose.Schema.Types.Mixed },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);