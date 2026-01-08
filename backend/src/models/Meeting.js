const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    title: String,
    sourceType: String,
    sourceUrl: String,
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "REVIEW", "APPROVED", "SYNCED", "FAILED"],
      default: "UPLOADED"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);
