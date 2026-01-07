const mongoose = require('mongoose');

// ==================== USER SCHEMA ====================

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ["OWNER", "MEMBER"], default: "MEMBER" },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// ==================== WORKSPACE SCHEMA ====================

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

const Workspace = mongoose.model("Workspace", WorkspaceSchema);

// ==================== MEETING SCHEMA ====================

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

const Meeting = mongoose.model("Meeting", MeetingSchema);

// ==================== REVIEW SCHEMA ====================

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

const Review = mongoose.model("Review", ReviewSchema);

// ==================== AI OUTPUT SCHEMA ====================

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

const AiOutput = mongoose.model("AiOutput", AiOutputSchema);

// ==================== AUDIT LOG SCHEMA ====================

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);

// ==================== INTEGRATION SCHEMA ====================

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

const Integration = mongoose.model("Integration", IntegrationSchema);

// ==================== INVITE SCHEMA ====================

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

const Invite = mongoose.model("Invite", InviteSchema);

// ==================== DATABASE CONNECTION ====================

const connectDatabase = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✓ MongoDB connected successfully with Mongoose');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ Disconnection error:', error.message);
    process.exit(1);
  }
};

// ==================== EXPORTS ====================

module.exports = {
  // Models
  User,
  Workspace,
  Meeting,
  Review,
  AiOutput,
  AuditLog,
  Integration,
  Invite,
  
  // Database functions
  connectDatabase,
  disconnectDatabase,
};
