const mongoose = require("mongoose");

const IntegrationSchema = new mongoose.Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    provider: { type: String },
    type: { type: String },
    status: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Integration ||
  mongoose.model("Integration", IntegrationSchema);
