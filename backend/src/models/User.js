const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ["OWNER", "MEMBER"], default: "MEMBER" },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
