const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true },
    duration: { type: Number },
    participants: [{ type: String, trim: true }],
    sourceType: { type: String, enum: ["TRANSCRIPT", "AUDIO"], required: true },
    sourceUrl: { type: String },
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "REVIEW", "APPROVED", "SYNCED", "FAILED"],
      default: "UPLOADED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
