const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    role: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invite", InviteSchema);
