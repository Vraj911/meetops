MeetOps Backend — Express.js (AI-Centric Workflow Engine)

MeetOps is not a chatbot.
It is a workflow engine where AI drafts, humans approve, and the backend executes.

1. Core Philosophy (Read This First)
AI never executes actions.
AI produces structured JSON drafts only.
Humans review and approve.
Backend executes only after approval.
If you break this rule, the project is invalid.

2. Tech Stack (Locked)
Language
JavaScript (NO TypeScript)
Backend
Node.js 18+
Express.js
Database
MongoDB
Mongoose
AI
HuggingFace Inference API
One model per step (no giant prompts)
Infra (optional but recommended)
Redis
BullMQ
External Integrations (mock allowed)
Jira API
Google Calendar API
Email (SMTP)

3. Backend Responsibility (What It Actually Does)
The backend must:
Accept meeting input (transcript or audio)
Run a deterministic AI pipeline
Store AI output as versioned JSON
Expose a review/approval gate
Execute approved actions (sync)
It does NOT:
Chat freely
Auto-execute
Make decisions

4. Folder Structure (Single Source of Truth)
backend/
└── src/
    ├── app.js
    ├── server.js

    ├── config/
    │   ├── env.js
    │   ├── db.js
    │   ├── redis.js
    │   └── ai.js

    ├── routes/
    ├── controllers/
    ├── services/
    ├── models/
    ├── queues/
    ├── middlewares/
    ├── utils/
    └── seed/


Rule:
Routes → Controllers (thin) → Services (all logic)

5. Meeting Lifecycle (ENFORCE THIS)
Allowed transitions only:
UPLOADED → PROCESSING → REVIEW → APPROVED → SYNCED
                    ↘ FAILED
No skipping. No shortcuts.

6. Database Models (Minimal)
User
{ email, name, role, workspaces, createdAt }
Workspace
{ name, ownerId, members, createdAt }
Invite
{ workspaceId, email, role, token, expiresAt, acceptedAt }
Meeting
{
  workspaceId,
  title,
  sourceType,
  sourceUrl,
  status,
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
Audit Log (Mandatory)
{ actorId, action, entityType, entityId, metadata, timestamp }

7. API Routes (Complete)
Auth
POST /auth/signup
POST /auth/login

Workspace & Invites
GET  /workspace
POST /invites/send
GET  /invites/validate
POST /invites/accept

Meetings
POST /meetings/upload
POST /meetings/:id/start
GET  /meetings/:id

AI
POST /ai/process/:meetingId
GET  /ai/output/:meetingId

Review
GET  /review/:meetingId
POST /review/:meetingId/refine
POST /review/:meetingId/approve

Sync
POST /sync/:meetingId/jira
POST /sync/:meetingId/calendar

Docs Bot
POST /docs/ask

8. AI Pipeline (Deterministic)
Order
Transcription (if audio)
Summarization
Decision extraction
Action items extraction
Confidence scoring
Hard Rules
JSON only
No markdown
No prose
Fail pipeline if JSON.parse fails
Final Output Contract
{
  "summary": [],
  "decisions": [],
  "actionItems": [
    { "title": "", "ownerHint": "", "confidence": 0.8 }
  ],
  "confidenceScores": {
    "summary": 0.9,
    "decisions": 0.8,
    "actionItems": 0.75
  }
}

9. Review Bot (Diff-Only)
Used only on review page
Accepts current JSON + instruction
Returns diff + explanation
Never auto-applies

{
  "diff": { "added": [], "removed": [], "changed": [] },
  "explanation": "Merged duplicates"
}

10. Docs Bot (DOT)
Reads static markdown only
Explains workflow
Never touches meetings or AI output

11. Queues (Optional but Recommended)
AI Queue → run pipeline
Sync Queue → Jira / Calendar
Email Queue → invites & notifications
Redis is not a database.

12. What NOT to Build
No dashboards
No analytics
No auto-execution
No Kafka
No “smart suggestions” outside review

-------------------------------------------------------------------------------

# Team Execution Plan (4 Devs) — Exact Tasks, Files, Steps, and Code Size

You said you split the backend + AI into tasks for a team of 4.
This section is the exact implementation checklist.

Important notes before you start:
- The repo already has scaffolding for `src/models/`, `src/routes/`, `src/controllers/`.
- Your job now is to implement runtime wiring + the `src/services/` logic.
- Keep controllers THIN: services do the work.
- Keep AI JSON-only.
- Any “external integrations” (Jira/Calendar/Email) can be mocked for hackathon.

How to use this plan:
- Each dev owns a set of files.
- Each dev can implement in parallel.
- Each task contains: what to do, where to do it, and approx LOC.

-------------------------------------------------------------------------------

## Dev 1 — Auth + Invites + Workspace (Foundation)

Goal: Make auth and onboarding flow work end-to-end with MongoDB.

### Task 1.1 — Add server bootstrap + route mounting
Files:
- `backend/src/app.js` (create)
- `backend/src/server.js` (create)
- `backend/src/config/env.js` (create)
- `backend/src/config/db.js` (create)

Steps:
1) Create Express app in `src/app.js`.
2) Add JSON body parsing.
3) Mount routers:
  - `/auth` → `routes/auth.routes.js`
  - `/invites` → `routes/invite.routes.js`
  - `/workspace` → `routes/workspace.routes.js`
  - `/meetings` → `routes/meeting.routes.js`
  - `/ai` → `routes/ai.routes.js`
  - `/review` → `routes/review.routes.js`
  - `/sync` → `routes/sync.routes.js`
  - `/docs` → `routes/docs.routes.js`
4) Create `src/config/db.js` that connects mongoose using `MONGO_URI`.
5) Create `src/server.js` that calls `connectDb()` and starts listening.

Approx code size:
- `app.js`: ~40–80 LOC
- `server.js`: ~25–60 LOC
- `config/env.js`: ~15–40 LOC
- `config/db.js`: ~25–60 LOC

### Task 1.2 — Implement Auth service (minimal hackathon auth)
Files:
- `backend/src/services/auth.service.js` (create)
- (optional) `backend/src/middlewares/auth.middleware.js` (create later; keep minimal)

Steps:
1) Implement `exports.signup(body)`:
  - Create a User (`models/User.js`).
  - Return `{ user }`.
2) Implement `exports.login(body)`:
  - Find user by email.
  - If not found, throw 401.
  - Return `{ user }`.

Approx code size:
- `auth.service.js`: ~60–120 LOC

### Task 1.3 — Implement Workspace + Invite services
Files:
- `backend/src/services/workspace.service.js` (create)
- `backend/src/services/invite.service.js` (create)
- `backend/src/services/email.service.js` (create, mocked)

Steps (workspace):
1) Implement `getWorkspace(req)`:
  - Decide how you get userId (temporary header or `req.user`).
  - Return workspaces the user belongs to.
2) Implement `invite(body)`:
  - Delegate to `inviteService.send(body)`.

Steps (invite):
1) Implement `send(body)`:
  - Generate token.
  - Create Invite doc.
  - Call `emailService.sendInvite(...)` (mock ok).
2) Implement `validate(query)`:
  - Validate token exists, not expired, not accepted.
3) Implement `accept(body)`:
  - Mark accepted.
  - Add member to workspace.
  - Create user if needed (hackathon friendly).

Approx code size:
- `workspace.service.js`: ~60–140 LOC
- `invite.service.js`: ~140–260 LOC
- `email.service.js`: ~30–80 LOC

Done criteria:
- You can signup/login.
- You can create and accept invites.
- `/workspace` returns something real from Mongo.

-------------------------------------------------------------------------------

## Dev 2 — Meetings + Upload + State Machine

Goal: Meeting upload + meeting retrieval + correct state transitions.

### Task 2.1 — Meeting service implementation
Files:
- `backend/src/services/meeting.service.js` (create)

Steps:
1) Implement `upload(body)`:
  - Create Meeting with status `UPLOADED`.
  - Save basic metadata (title, participants, sourceType, sourceUrl).
2) Implement `start(meetingId)`:
  - Load meeting.
  - Enforce meeting.status == `UPLOADED`.
  - Set status → `PROCESSING`.
  - Trigger pipeline (call `aiService.process(meetingId)` OR enqueue job).
  - Return `{ ok: true, meetingId }`.
3) Implement `getById(meetingId)`:
  - Return Meeting.
  - (Optional) also return latest AiOutput and/or Review.

Approx code size:
- `meeting.service.js`: ~120–220 LOC

### Task 2.2 — Status transition guard (shared)
Files (choose one approach):
- Option A: `backend/src/utils/constants.js` (add allowed transitions)
- Option B: `backend/src/services/_helpers/status.js` (create helper)

Steps:
1) Implement a reusable `canTransition(from, to)`.
2) Use it in meeting start + AI process + review approve + sync.

Approx code size:
- ~30–80 LOC

Done criteria:
- Meetings cannot skip states.
- “Start processing” fails if not `UPLOADED`.

-------------------------------------------------------------------------------

## Dev 3 — AI Pipeline + Review Bot + Docs Bot

Goal: Make the deterministic AI pipeline run and produce versioned JSON outputs.

### Task 3.1 — Implement AI Orchestrator service
Files:
- `backend/src/services/ai.service.js` (create)

Steps:
1) Load meeting.
2) Get transcriptText:
  - If AUDIO: call transcription service.
  - If TRANSCRIPT: use sourceUrl as transcript text (hackathon shortcut).
3) Call each step service (summarization → decisions → action items → confidence).
4) Validate the JSON contract shape (arrays exist).
5) Save `AiOutput` with incremented version.
6) Update meeting status to `REVIEW`.

Approx code size:
- `ai.service.js`: ~180–320 LOC

### Task 3.2 — Implement per-step AI services (HF Inference API)
Files:
- `backend/src/config/ai.js` (create)
- `backend/src/services/ai/transcription.service.js` (create)
- `backend/src/services/ai/summarization.service.js` (create)
- `backend/src/services/ai/decision.service.js` (create)
- `backend/src/services/ai/actionItem.service.js` (create)
- `backend/src/services/ai/confidence.service.js` (create)

Steps:
1) In `config/ai.js`, store:
  - token env var `HF_API_TOKEN`
  - model IDs per step
2) For each step service:
  - implement exactly ONE exported method:
    - transcription: `transcribe({ sourceUrl })`
    - summarization: `summarize({ transcriptText })`
    - decision: `extract({ transcriptText })`
    - actionItem: `extract({ transcriptText })`
    - confidence: `score({ transcriptText, summary, decisions, actionItems })`
3) Enforce JSON-only parsing:
  - if parse fails → throw error
4) Return objects that match the contracts in section 6.

Approx code size:
- `config/ai.js`: ~40–90 LOC
- each AI step service: ~80–180 LOC
- total for step services: ~400–900 LOC

### Task 3.3 — Review refine bot (diff-only)
Files:
- `backend/src/services/review.service.js` (create)
- (optional) `backend/src/utils/jsonDiff.js` (create helper)

Steps:
1) Implement `get(meetingId)`:
  - return meeting + latest AiOutput + existing Review.
2) Implement `approve(meetingId, body)`:
  - require meeting.status == `REVIEW`
  - save Review
  - set meeting.status → `APPROVED`
3) Implement `refine(meetingId, body)`:
  - call HF “refine” prompt
  - return `{ diff, explanation }`
  - NEVER auto-apply

Approx code size:
- `review.service.js`: ~180–340 LOC
- `jsonDiff.js` helper: ~80–200 LOC

### Task 3.4 — Docs Bot (DOT)
Files:
- `backend/src/services/docs.service.js` (create)
- `backend/src/utils/promptBuilder.js` (optional)
- `backend/src/docs/` (create markdown files; optional)

Steps:
1) Load static markdown files.
2) Build a prompt “answer from docs only”.
3) Call HF model.
4) Return an answer.

Hard constraints:
- Must NOT read meetings.
- Must NOT read AI outputs.
- Must NOT modify data.

Approx code size:
- `docs.service.js`: ~150–300 LOC

Done criteria:
- `POST /ai/process/:meetingId` creates `AiOutput`.
- `GET /ai/output/:meetingId` returns latest version.
- `POST /review/:meetingId/refine` returns diff-only.
- `POST /docs/ask` answers from static docs.

-------------------------------------------------------------------------------

## Dev 4 — Sync + Queues + Audit Logs

Goal: After approval, create external outputs (mock ok) and track everything.

### Task 4.1 — Implement Sync services
Files:
- `backend/src/services/jira.service.js` (create)
- `backend/src/services/calendar.service.js` (create)

Steps:
1) For each sync method:
  - Verify meeting.status == `APPROVED`.
  - Load Review (approved data).
  - Create mock objects (or real API calls if available).
  - Return `{ ok: true, created: [...] }`.
2) Decide how meeting.status becomes `SYNCED`:
  - either after each sync, or after both complete.

Approx code size:
- `jira.service.js`: ~120–260 LOC
- `calendar.service.js`: ~120–260 LOC

### Task 4.2 — Queues (BullMQ) integration (recommended)
Files:
- `backend/src/config/redis.js` (create)
- `backend/src/queues/ai.queue.js` (create)
- `backend/src/queues/sync.queue.js` (create)
- `backend/src/queues/email.queue.js` (create)

Steps:
1) Configure Redis connection.
2) For AI:
  - `meeting.start` enqueues a job.
  - worker runs `aiService.process(meetingId)`.
3) For Sync:
  - `sync.controller` enqueues job.
  - worker calls jira/calendar services.
4) For Email:
  - invite service enqueues email job.

Approx code size:
- `redis.js`: ~40–90 LOC
- each queue file: ~120–260 LOC
- total: ~400–900 LOC

### Task 4.3 — Audit logging everywhere
Files:
- `backend/src/services/audit.service.js` (create)
- (touch other services to call audit log)

Steps:
1) Implement `auditService.log({ actorId, action, entityType, entityId, metadata })`.
2) Add calls in:
  - invite.send / accept
  - meeting.upload / start
  - ai.process success/fail
  - review.approve
  - sync.jira / sync.calendar

Approx code size:
- `audit.service.js`: ~40–90 LOC
- audit calls sprinkled across services: ~40–120 LOC

Done criteria:
- You can trigger sync after approval.
- Jobs can run async (optional but recommended).
- AuditLog records are created for key actions.

-------------------------------------------------------------------------------

## Final Integration Checklist (Everyone)

1) Add `.env` keys:
  - `PORT`
  - `MONGO_URI`
  - `HF_API_TOKEN`
  - (optional) `REDIS_URL`
2) Update `backend/package.json` dependencies (Express, Mongoose, BullMQ, Redis, etc.).
3) Ensure route prefixes match the README:
  - `/auth/*`, `/invites/*`, `/workspace/*`, `/meetings/*`, `/ai/*`, `/review/*`, `/sync/*`, `/docs/*`
4) Manual happy-path test sequence:
  - signup → create workspace → send invite → accept invite
  - upload meeting (TRANSCRIPT) → start → ai output created → review approve → sync

-------------------------------------------------------------------------------