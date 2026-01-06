const mongoose = require("mongoose");

const AiOutputSchema = new mongoose.Schema(
  {
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    version: { type: Number, required: true },
    summary: [{ type: String }],
    decisions: [{ type: String }],
    actionItems: [
      {
        title: { type: String },
        ownerHint: { type: String },
        confidence: { type: Number },
      },
    ],
    confidenceScores: { type: mongoose.Schema.Types.Mixed },
    rawOutput: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiOutput", AiOutputSchema);
