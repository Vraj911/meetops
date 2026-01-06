🧠 MeetOps Backend — Express.js Architecture (Frontend-First, AI-Centric)

Language: JavaScript (NO TypeScript)
Framework: Express.js
Database: MongoDB (Mongoose)
AI: HuggingFace Inference API
Scope: Backend that powers the MeetOps workflow
Philosophy: AI understands → Humans approve → Backend executes

1. Backend Role in MeetOps (Very Important)

The backend is not a chatbot server.
It is a workflow engine.
The backend must:
Accept meeting inputs
Run a deterministic AI pipeline
Store AI output as structured JSON
Allow humans to review & modify
Execute approved results to external tools
AI NEVER executes. Humans approve. Backend executes.

2. Tech Stack (Locked)
Core
Node.js (18+)
Express.js
MongoDB
Mongoose
Infra
Redis (optional but recommended)
BullMQ (background jobs)
AI
HuggingFace Inference API
One model per step (not one giant prompt)
External (mocked for hackathon)
JIRA REST API
Google Calendar API
SMTP / Email service

3. Backend Folder Structure
backend/
├── src/
│   ├── app.js                 # Express bootstrap
│   ├── server.js              # HTTP server
│
│   ├── config/
│   │   ├── env.js
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── ai.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── invite.routes.js
│   │   ├── workspace.routes.js
│   │   ├── meeting.routes.js
│   │   ├── ai.routes.js
│   │   ├── review.routes.js
│   │   ├── sync.routes.js
│   │   └── docs.routes.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── invite.controller.js
│   │   ├── workspace.controller.js
│   │   ├── meeting.controller.js
│   │   ├── ai.controller.js
│   │   ├── review.controller.js
│   │   ├── sync.controller.js
│   │   └── docs.controller.js
│
│   ├── services/
│   │   ├── ai/
│   │   │   ├── transcription.service.js
│   │   │   ├── summarization.service.js
│   │   │   ├── decision.service.js
│   │   │   ├── actionItem.service.js
│   │   │   └── confidence.service.js
│   │   │
│   │   ├── invite.service.js
│   │   ├── meeting.service.js
│   │   ├── review.service.js
│   │   ├── jira.service.js
│   │   ├── calendar.service.js
│   │   └── email.service.js
│
│   ├── models/
│   │   ├── User.js
│   │   ├── Workspace.js
│   │   ├── Invite.js
│   │   ├── Meeting.js
│   │   ├── AiOutput.js
│   │   ├── Review.js
│   │   ├── Integration.js
│   │   └── AuditLog.js
│
│   ├── queues/
│   │   ├── ai.queue.js
│   │   ├── sync.queue.js
│   │   └── email.queue.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│
│   ├── utils/
│   │   ├── logger.js
│   │   ├── promptBuilder.js
│   │   ├── jsonDiff.js
│   │   └── constants.js
│
│   └── seed/
│       └── seed.js
│
├── .env
├── package.json
└── README.md

4. Database Models (MongoDB)
User
{
  email,
  name,
  role: "OWNER" | "MEMBER",
  workspaces: [workspaceId],
  createdAt
}

Workspace
{
  name,
  ownerId,
  members: [{ userId, role }],
  createdAt
}

Invite
{
  workspaceId,
  email,
  role,
  token,
  expiresAt,
  acceptedAt
}

Meeting
{
  workspaceId,
  createdBy,
  title,
  duration,
  participants,
  sourceType: "TRANSCRIPT" | "AUDIO",
  sourceUrl,
  status: "UPLOADED" | "PROCESSING" | "REVIEW" | "APPROVED" | "SYNCED" | "FAILED",
  createdAt
}

AI Output (Versioned)
{
  meetingId,
  version,
  summary,
  decisions,
  actionItems,
  confidenceScores,
  rawOutput,
  createdAt
}

Review
{
  meetingId,
  approvedBy,
  finalSummary,
  finalActionItems,
  approvedAt
}

Audit Log (DO NOT SKIP)
{
  actorId,
  action,
  entityType,
  entityId,
  metadata,
  timestamp
}

5. API Routes (Complete)
Auth
POST /auth/login
POST /auth/signup

Invites
POST /invites/send
GET  /invites/validate
POST /invites/accept

Workspace
GET  /workspace
POST /workspace/invite

Meetings
POST /meetings/upload
POST /meetings/:id/start
GET  /meetings/:id

AI Pipeline
POST /ai/process/:meetingId
GET  /ai/output/:meetingId

Review
GET  /review/:meetingId
POST /review/:meetingId/approve
POST /review/:meetingId/refine   // AI chatbot

Sync
POST /sync/:meetingId/jira
POST /sync/:meetingId/calendar

Docs Bot
POST /docs/ask

6. AI Pipeline (Critical)
Each step is separate, pure, and JSON-only.
Pipeline Order
Transcription (if audio)
Summarization
Decision extraction
Action item extraction
Confidence scoring
Output Contract
{
  "summary": [],
  "decisions": [],
  "actionItems": [
    {
      "title": "",
      "ownerHint": "",
      "confidence": 0.81
    }
  ]
}
No markdown. No prose. No emojis.

7. Review AI Chatbot
Used ONLY on /review page
Purpose:
Refine extracted JSON
Merge, reprioritize, clarify
Input:

{
  "currentState": {...},
  "instruction": "merge duplicates"
}
Output:
{
  "diff": {...},
  "explanation": "Merged 2 overlapping tasks"
}
Backend must:
Show diff
Never auto-apply

8. Docs Bot (DOT)
This bot:
Reads static markdown
Explains workflow
Answers “why” questions
It must:
Never touch meetings
Never touch AI outputs
Never modify data

9. Queues & Background Jobs
AI Queue
Runs pipeline
Saves output
Updates meeting status
Sync Queue
Creates JIRA tickets
Creates Calendar events
Email Queue
Sends invites
Sends notifications

10. Redis Usage (Minimal & Smart)
Use Redis for:
Invite token validation
Job progress
Streaming cursors
❌ Do NOT store meetings or AI data in Redis

11. Team Work Division
Dev 1: Auth + Invites + Workspace
Dev 2: Meetings + Upload + State machine
Dev 3: AI pipeline + Review bot + Docs bot
Dev 4: Sync + Queues + Audit logs

12. What NOT to Build (Seriously)
No dashboards
No analytics
No Kafka
No auto-execution
No “smart suggestions” outside review