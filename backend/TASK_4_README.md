# Task 4 — Sync + Queues + Audit Logs (Dev 4 Implementation Guide)

## Overview
As Dev 4, you're responsible for:
1. **Sync Services** (Jira + Calendar) — Execute approved actions
2. **Queues** (BullMQ + Redis) — Async job processing (optional but recommended)
3. **Audit Logging** — Track all actions

## Table of Contents
1. [Jira Integration Setup](#jira-integration-setup)
2. [Calendar Integration Setup](#calendar-integration-setup)
3. [Redis + BullMQ Setup](#redis--bullmq-setup)
4. [Implementation Checklist](#implementation-checklist)
5. [Testing](#testing)

---

## Jira Integration Setup

### Step 1: Create Jira Cloud Account
1. Go to [atlassian.com](https://www.atlassian.com)
2. Create/login to Jira Cloud account
3. Create a new project or use existing one
4. Get your **Jira Site URL**: `https://your-domain.atlassian.net`

### Step 2: Generate API Token
1. Go to [account.atlassian.com/manage-account/security/api-tokens](https://account.atlassian.com/manage-account/security/api-tokens)
2. Click **Create API token**
3. Name it: `MeetOps Backend`
4. Copy and save the token (you won't see it again)

### Step 3: Add to .env
```env
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@gmail.com
JIRA_API_TOKEN=your-api-token-here
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
```

Get `PROJECT_KEY`:
- In Jira, go to project settings
- Look for "Project key" (e.g., `PROJ`, `MOP`)

### Step 4: Install Dependencies
```bash
npm install jira-client axios
```

### Step 5: Test Connection
Create a test file to verify:
```javascript
const JiraApi = require('jira-client');

// Normalize host domain (remove protocol)
const hostNormalized = (process.env.JIRA_HOST || '')
   .replace(/^https?:\/\//, '')
   .replace(/\/$/, '');

const client = new JiraApi({
   protocol: 'https',
   host: hostNormalized,
   username: process.env.JIRA_EMAIL,
   password: process.env.JIRA_API_TOKEN,
   apiVersion: '2',
   strictSSL: true,
});

// Test
client.getServerInfo()
   .then(info => console.log('✓ Connected!', info?.serverTitle || 'Jira'))
   .catch(err => console.error('✗ Error:', err.message));
```

---

## Calendar Integration Setup

### Option A: Google Calendar API (Recommended)

#### Step 1: Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: `MeetOps`
3. Enable **Google Calendar API**
4. Create **OAuth 2.0 Client ID** (Desktop application)
5. Download credentials JSON

#### Step 2: Add to .env
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth/callback
GOOGLE_CALENDAR_ID=primary
```

### Send Review Payload to Sync Jira

Endpoint:

```http
POST /api/sync/:meetingId/jira
Content-Type: application/json

{
   "projectKey": "PROJ",
   "summary": "Approved summary of meeting",
   "actionItems": [
      { "title": "Create project timeline", "ownerHint": "Alice", "confidence": 0.9 },
      { "title": "Set up CI pipeline", "ownerHint": "Bob", "confidence": 0.85, "issueType": "Task" }
   ]
}
```

Notes:
- If body includes `actionItems`/`finalActionItems` or `summary`/`finalSummary`, the backend syncs from this payload.
- Otherwise, it loads `Review.finalActionItems` and `AiOutput.summary` from the database.
- Meeting must be in `APPROVED` status before sync.

#### Step 3: Install Dependencies
```bash
npm install google-auth-library googleapis
```

### Option B: Microsoft Graph API (Alternative)
Similar process with Azure AD. Skip for now if using Google.

---

## Redis + BullMQ Setup

### Option A: Local Redis (Development)
```bash
# Windows - Install from here
# https://github.com/microsoftarchive/redis/releases
# Or use WSL: wsl sudo apt-get install redis-server

# Start Redis
redis-server
```

### Option B: Redis Cloud (Production)
1. Go to [redis.com](https://redis.com)
2. Create free Redis Cloud account
3. Create database
4. Copy connection URL

### Add to .env
```env
# Local
REDIS_URL=redis://localhost:6379

# Or Cloud
REDIS_URL=redis://username:password@host:port
```

### Install Dependencies
```bash
npm install bullmq ioredis
```

---

## Implementation Checklist

### Phase 1: Jira Service (Real Integration)

#### Files to Create:
- `src/config/jira.js` — Jira client configuration
- `src/services/jira.service.js` — Jira API operations
- `src/routes/sync.routes.js` — Sync endpoints (update if exists)

#### Steps:

1. **Create Jira Config** (`src/config/jira.js`):
```javascript
const { Client } = require('jira.js');

const jiiraClient = new Client({
  host: process.env.JIRA_HOST,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
});

module.exports = jiraClient;
```

2. **Implement Jira Service** (`src/services/jira.service.js`):
   - `createIssue(data)` — Create issue from action items
   - `linkIssue(meetingId, issueKey)` — Track linkage
   - `addComment(issueKey, comment)` — Add meeting summary as comment

3. **Create Sync Endpoint** (`routes/sync.routes.js`):
   - `POST /sync/:meetingId/jira`

#### Expected Code Size:
- `jira.js`: ~50-100 LOC
- `jira.service.js`: ~200-350 LOC

---

### Phase 2: Calendar Service (Google Calendar)

#### Files to Create:
- `src/config/calendar.js` — Calendar client
- `src/services/calendar.service.js` — Calendar operations
- `src/routes/sync.routes.js` — Calendar endpoints

#### Steps:

1. **Create Calendar Config** (`src/config/calendar.js`)
2. **Implement Calendar Service**:
   - `createEvent(data)` — Create calendar events from action items
   - `syncMeeting(meetingData)` — Full sync logic

#### Expected Code Size:
- `calendar.js`: ~80-150 LOC
- `calendar.service.js`: ~200-350 LOC

---

### Phase 3: Queues (BullMQ)

#### Files to Create:
- `src/config/redis.js` — Redis connection
- `src/queues/ai.queue.js` — AI processing queue
- `src/queues/sync.queue.js` — Sync operations queue
- `src/queues/email.queue.js` — Email notifications queue

#### Steps:

1. **Redis Config** (`src/config/redis.js`):
   - Connect to Redis
   - Export connection instance

2. **AI Queue** (`src/queues/ai.queue.js`):
   - Job: Process meeting
   - Handler: Call `aiService.process(meetingId)`

3. **Sync Queue** (`src/queues/sync.queue.js`):
   - Job: Sync to Jira
   - Job: Sync to Calendar
   - Handlers: Call respective sync services

4. **Email Queue** (`src/queues/email.queue.js`):
   - Job: Send invite email
   - Handler: Call `emailService.send()`

5. **Update Controllers**:
   - `meeting.controller.js` — Enqueue AI job on start
   - `sync.controller.js` — Enqueue sync jobs

#### Expected Code Size:
- `redis.js`: ~30-80 LOC
- Each queue file: ~80-200 LOC
- Total: ~300-800 LOC

---

### Phase 4: Audit Logging

#### Files to Create:
- `src/services/audit.service.js` — Audit operations
- (Update other services to log)

#### Steps:

1. **Create Audit Service** (`src/services/audit.service.js`):
```javascript
exports.log = async (data) => {
  // data: { actorId, action, entityType, entityId, metadata }
  // Save to AuditLog model
};
```

2. **Add Audit Calls** in:
   - `auth.service.js` — user signup/login
   - `invite.service.js` — invite send/accept
   - `meeting.service.js` — upload/start
   - `ai.service.js` — process success/failure
   - `review.service.js` — approve
   - `jira.service.js` — sync
   - `calendar.service.js` — sync

#### Expected Code Size:
- `audit.service.js`: ~40-80 LOC
- Audit calls sprinkled: ~60-150 LOC

---

## Testing

### Test 1: Verify Jira Connection
```bash
node -e "
require('dotenv').config();
const jiraClient = require('./src/config/jira');
jiraClient.projects.getAllProjects()
  .then(p => console.log('✓ Jira OK:', p.length, 'projects'))
  .catch(e => console.log('✗ Jira Error:', e.message));
"
```

### Test 2: Create a Test Issue
```javascript
// In a test file
const jiraService = require('./src/services/jira.service');

jiraService.createIssue({
  summary: 'Test Issue from MeetOps',
  description: 'This is a test',
  issueType: 'Task',
}).then(issue => console.log('✓ Created:', issue.key));
```

### Test 3: End-to-End Flow
1. Upload meeting → `POST /meetings/upload`
2. Start processing → `POST /meetings/:id/start`
3. Check AI output → `GET /ai/output/:meetingId`
4. Approve → `POST /review/:meetingId/approve`
5. Sync to Jira → `POST /sync/:meetingId/jira`
6. Verify in Jira dashboard

---

## Environment Variables (.env)

```env
# MongoDB
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/meetops

# Server
PORT=5000
NODE_ENV=development

# Jira
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@gmail.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY

# Google Calendar (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/oauth/callback

# Redis (optional, for queues)
REDIS_URL=redis://localhost:6379

# Email (for invites)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## Order of Implementation

1. **Start with Jira** (most critical for MeetOps)
   - Verify integration works
   - Create issues from action items
   - Link to meetings

2. **Then Calendar** (nice to have)
   - Create events
   - Sync approved action items

3. **Then Queues** (optimization)
   - Move sync to async
   - Move email to async
   - Better UX

4. **Finally Audit Logs** (everywhere)
   - Add to all services
   - Useful for debugging

---

## Common Issues

### Jira Auth Fails
- ✓ API token is correct
- ✓ Email is exactly as in Jira account
- ✓ Project key exists
- ✓ Your IP isn't blocked by Jira security

### Calendar Auth Fails
- ✓ OAuth consent screen set up
- ✓ Redirect URI matches exactly
- ✓ Scopes include `calendar`

### Redis Connection Fails
- ✓ Redis server is running (`redis-server`)
- ✓ Port is 6379 (default)
- ✓ For cloud Redis, URL format is correct

---

## Success Criteria

✓ Task 4.1 (Jira Service):
- Real Jira connection works
- Issues can be created
- Meeting → Action Items → Jira Issues

✓ Task 4.2 (Queues):
- Jobs enqueue and process
- AI processing is async
- Sync is async

✓ Task 4.3 (Audit):
- All key actions logged
- Audit log queryable from DB

---

## Next Steps

After Task 4:
- Integrate with team's frontend
- Test full workflow end-to-end
- Deploy to staging environment
- Gather user feedback
