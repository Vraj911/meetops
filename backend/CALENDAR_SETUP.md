# Google Calendar Integration Setup Guide

## 📋 Overview
This guide will help you set up Google Calendar integration for MeetOps. The integration allows you to:
- Sync approved action items to Google Calendar
- Create calendar events for meetings
- Automatically set reminders for action items

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `MeetOps` (or any name you prefer)
4. Click **"Create"**

### Step 2: Enable Calendar API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

#### 3.1 Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (for testing) or **"Internal"** (for organization only)
3. Click **"Create"**
4. Fill in required fields:
   - **App name**: `MeetOps`
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **"Save and Continue"**

#### 3.2 Add Scopes
1. Click **"Add or Remove Scopes"**
2. Add these scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
3. Click **"Update"** → **"Save and Continue"**

#### 3.3 Add Test Users (if External)
1. Click **"Add Users"**
2. Add your Google account email
3. Click **"Save and Continue"**

#### 3.4 Create OAuth Client
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Name it: `MeetOps Backend`
5. Add **Authorized redirect URIs**:
   ```
   http://localhost:8080/api/oauth/google/callback
   ```
6. Click **"Create"**
7. **Copy the Client ID and Client Secret** (you'll need these!)

## 🔐 Environment Variables

Add these to your `.env` file:

```env
# Google Calendar Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/oauth/google/callback
GOOGLE_REFRESH_TOKEN=
```

**Note**: `GOOGLE_REFRESH_TOKEN` will be obtained after authorization (Step 4).

## 🔑 Step 4: Get Refresh Token

You need to authorize the app once to get a refresh token:

### Option A: Using the Test Script

1. **Run the test script**:
   ```bash
   node test-calendar.js
   ```

2. **Copy the authorization URL** from the output

3. **Visit the URL** in your browser:
   - Sign in with your Google account
   - Grant permissions to the app
   - You'll be redirected to your callback URL with a `code` parameter

4. **Exchange the code for tokens**:
   
   Create a temporary script `get-token.js`:
   ```javascript
   require('dotenv').config();
   const { getTokenFromCode } = require('./src/config/calendar');
   
   const code = 'PASTE_YOUR_CODE_HERE'; // From URL parameter
   
   getTokenFromCode(code)
     .then(tokens => {
       console.log('\n✅ Tokens received!');
       console.log('\nAdd this to your .env file:');
       console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
     })
     .catch(err => console.error('Error:', err.message));
   ```

5. **Run it**:
   ```bash
   node get-token.js
   ```

6. **Copy the refresh token** to your `.env` file

### Option B: Manual Authorization Flow

1. Visit the auth URL manually (from test-calendar.js output)
2. Use Postman or curl to exchange the code:
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -d "code=YOUR_AUTH_CODE" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=http://localhost:8080/api/oauth/google/callback" \
     -d "grant_type=authorization_code"
   ```

## ✅ Verify Setup

Run the test script again:
```bash
node test-calendar.js
```

Expected output:
```
🗓️  Google Calendar Integration Test

Step 1: Checking configuration...
  ✓ Configured: true

Step 2: Getting OAuth2 client...
  ✓ OAuth2 client created

Step 4: Testing Calendar API access...
  ✓ Successfully connected to Google Calendar
  ✓ Found 5 upcoming events

✅ Calendar integration is working!
```

## 📡 API Endpoints

### Sync Meeting to Calendar
```http
POST /api/sync/:meetingId/calendar
Content-Type: application/json

{
  "calendarId": "primary",
  "actionItems": [
    {
      "title": "Complete project proposal",
      "ownerHint": "john@example.com",
      "dueDate": "2026-01-15T10:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar sync completed",
  "data": {
    "meetingId": "...",
    "totalItems": 3,
    "succeeded": 3,
    "failed": 0,
    "results": [
      {
        "success": true,
        "actionItem": "Complete project proposal",
        "eventId": "abc123",
        "eventLink": "https://calendar.google.com/..."
      }
    ]
  }
}
```

## 🔍 Testing the Integration

### Test 1: Basic Connection
```bash
node test-calendar.js
```

### Test 2: Create Test Event
Create `test-calendar-event.js`:
```javascript
require('dotenv').config();
require('./src/config/mongoose');
const calendarService = require('./src/services/calendar.service');

const testMeetingId = 'YOUR_MEETING_ID'; // Replace with real meeting ID

calendarService.syncCalendar(testMeetingId, {
  actionItems: [
    {
      title: 'Test Action Item',
      ownerHint: 'you@example.com',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }
  ]
})
  .then(result => {
    console.log('✅ Success:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
```

Run:
```bash
node test-calendar-event.js
```

### Test 3: Full Workflow
1. Upload a meeting → `POST /api/meetings/upload`
2. Start processing → `POST /api/meetings/:id/start`
3. Approve the meeting → `POST /api/review/:meetingId/approve`
4. Sync to Calendar → `POST /api/sync/:meetingId/calendar`
5. Check your Google Calendar!

## 🛠️ Troubleshooting

### Error: "Calendar service not configured"
- ✓ Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- ✓ Restart your server after adding env variables

### Error: "invalid_grant"
- ✓ Refresh token may be expired
- ✓ Re-authorize the app (run Step 4 again)
- ✓ Check that OAuth consent screen is configured

### Error: "insufficient permissions"
- ✓ Make sure you added the calendar scopes in OAuth consent screen
- ✓ Re-authorize to grant new permissions

### Error: "redirect_uri_mismatch"
- ✓ The redirect URI in .env must **exactly match** the one in Google Cloud Console
- ✓ Include http:// or https://
- ✓ No trailing slashes

### Events not appearing in calendar
- ✓ Check that the `calendarId` is correct (default is 'primary')
- ✓ Verify the meeting is in `APPROVED` status
- ✓ Check for errors in the API response

## 🎯 Features

### Automatic Event Creation
- ✅ Creates calendar events for each action item
- ✅ Sets due dates (default: 7 days from now)
- ✅ Adds meeting summary to event description
- ✅ Configures reminders (1 day + 1 hour before)

### Smart Formatting
- 📋 Event title: `[Action] Your Action Item Title`
- 👤 Assigns to owner if email provided
- 🎨 Color-coded events (blue for action items)
- 📝 Rich descriptions with meeting context

### Batch Sync
- Syncs all action items in one API call
- Returns detailed results for each item
- Partial failure handling (continues on errors)

## 🔒 Security Notes

1. **Never commit credentials**:
   - Add `.env` to `.gitignore`
   - Don't share Client Secret publicly

2. **Refresh Token Storage**:
   - Store securely (encrypted in production)
   - Rotate regularly
   - Use per-user tokens in multi-tenant apps

3. **Scopes**:
   - Only request necessary calendar scopes
   - Review OAuth consent screen periodically

## 📚 Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 for Web Server Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)

## 🎉 Success Checklist

- ✅ Google Cloud project created
- ✅ Calendar API enabled
- ✅ OAuth 2.0 credentials created
- ✅ Environment variables configured
- ✅ Refresh token obtained
- ✅ Test script passes
- ✅ Calendar events created successfully

---

**Next Steps**: Once calendar integration is working, you can:
1. Implement Redis + BullMQ for async processing
2. Add audit logging
3. Create frontend UI for calendar sync
4. Add webhook support for calendar updates
