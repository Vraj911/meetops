const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Workspace ||
  mongoose.model("Workspace", WorkspaceSchema);