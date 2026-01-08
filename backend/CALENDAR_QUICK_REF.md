# Google Calendar Integration - Quick Reference

## 🚀 Setup Checklist

1. ✅ Install dependencies: `npm install googleapis google-auth-library`
2. ✅ Configure `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8080/api/oauth/google/callback
   GOOGLE_REFRESH_TOKEN=your-refresh-token
   ```
3. ✅ Get refresh token (see below)
4. ✅ Test connection: `node test-calendar.js`

## 🔑 Getting Your Refresh Token (3 Ways)

### Method 1: Browser Flow (Easiest)
1. Start your server: `npm run dev`
2. Visit: http://localhost:8080/api/oauth/google/authorize
3. Copy the `authUrl` from the response
4. Open the URL in your browser
5. Sign in and authorize
6. Copy the refresh token from the success page
7. Add to `.env` file

### Method 2: Using Helper Script
```bash
# Step 1: Get authorization URL
node test-calendar.js
# Copy the URL and open in browser

# Step 2: After authorizing, copy the 'code' parameter from the callback URL

# Step 3: Exchange code for token
node get-calendar-token.js
# Paste the code when prompted
# Copy the refresh token to .env
```

### Method 3: Direct API Call
```bash
# Step 1: Get auth URL
curl http://localhost:8080/api/oauth/google/authorize

# Step 2: Visit the authUrl in browser and authorize

# Step 3: The callback page will show your refresh token
```

## 📡 API Endpoints

### 1. Get Authorization URL
```http
GET /api/oauth/google/authorize
```

**Response:**
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Visit the authUrl to authorize the application"
}
```

### 2. OAuth Callback (Automatic)
```http
GET /api/oauth/google/callback?code=...
```
Returns an HTML page with your refresh token.

### 3. Sync Meeting to Calendar
```http
POST /api/sync/:meetingId/calendar
Content-Type: application/json

{
  "calendarId": "primary",
  "actionItems": [
    {
      "title": "Complete feature implementation",
      "ownerHint": "developer@example.com",
      "dueDate": "2026-01-20T10:00:00Z",
      "description": "Implement the calendar sync feature"
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
    "meetingId": "67890abc",
    "totalItems": 1,
    "succeeded": 1,
    "failed": 0,
    "results": [
      {
        "success": true,
        "actionItem": "Complete feature implementation",
        "eventId": "abc123xyz",
        "eventLink": "https://calendar.google.com/event?eid=..."
      }
    ]
  }
}
```

## 🧪 Testing Commands

### Test 1: Verify Configuration
```bash
node test-calendar.js
```

### Test 2: List Calendar Events
```javascript
const { getCalendarClient } = require('./src/config/calendar');

const calendar = getCalendarClient();
calendar.events.list({
  calendarId: 'primary',
  maxResults: 10,
})
  .then(res => console.log('Events:', res.data.items))
  .catch(err => console.error('Error:', err.message));
```

### Test 3: Sync a Meeting
```bash
# Replace MEETING_ID with actual ID
curl -X POST http://localhost:8080/api/sync/MEETING_ID/calendar \
  -H "Content-Type: application/json" \
  -d '{
    "actionItems": [
      {
        "title": "Test Action Item",
        "ownerHint": "you@gmail.com",
        "dueDate": "2026-01-15T10:00:00Z"
      }
    ]
  }'
```

## 📋 Example Workflows

### Workflow 1: Manual Action Items
```javascript
// Sync custom action items to calendar
fetch('http://localhost:8080/api/sync/ABC123/calendar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    actionItems: [
      { 
        title: 'Review pull request', 
        ownerHint: 'reviewer@team.com',
        dueDate: '2026-01-10T15:00:00Z'
      },
      { 
        title: 'Update documentation', 
        ownerHint: 'writer@team.com',
        dueDate: '2026-01-12T10:00:00Z'
      }
    ]
  })
});
```

### Workflow 2: Auto-sync After Approval
```javascript
// After approving a meeting review
const reviewApproval = await fetch('/api/reviews/ABC123/approve', {
  method: 'POST',
  body: JSON.stringify({ /* review data */ })
});

if (reviewApproval.ok) {
  // Automatically sync to calendar
  const syncResult = await fetch('/api/sync/ABC123/calendar', {
    method: 'POST'
  });
  
  console.log('Synced to calendar:', await syncResult.json());
}
```

## 🎯 Features Reference

| Feature | Description | Status |
|---------|-------------|--------|
| **Action Item Sync** | Creates calendar events for each action item | ✅ Working |
| **Auto Due Dates** | Sets default due date (7 days) if not provided | ✅ Working |
| **Email Invites** | Invites owner if email provided | ✅ Working |
| **Reminders** | Sets 1-day and 1-hour reminders | ✅ Working |
| **Color Coding** | Blue color for action items | ✅ Working |
| **Rich Descriptions** | Includes meeting context | ✅ Working |
| **Batch Processing** | Syncs all items in one call | ✅ Working |
| **Error Handling** | Continues on partial failures | ✅ Working |

## 🛠️ Common Issues & Solutions

### Issue: "Calendar service not configured"
**Solution:**
```bash
# Check your .env file has these variables
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Restart server after adding them
```

### Issue: "Meeting must be approved"
**Solution:**
```bash
# Approve the meeting first
curl -X POST http://localhost:8080/api/reviews/MEETING_ID/approve

# Then sync to calendar
curl -X POST http://localhost:8080/api/sync/MEETING_ID/calendar
```

### Issue: "invalid_grant" error
**Solution:**
```bash
# Refresh token expired. Get a new one:
# 1. Visit: http://localhost:8080/api/oauth/google/authorize
# 2. Follow the authUrl
# 3. Update GOOGLE_REFRESH_TOKEN in .env
# 4. Restart server
```

### Issue: "No action items to sync"
**Solution:**
```bash
# Provide action items in the request body
curl -X POST http://localhost:8080/api/sync/MEETING_ID/calendar \
  -H "Content-Type: application/json" \
  -d '{"actionItems": [{"title": "Task 1"}]}'
```

## 📊 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | ✅ Yes | OAuth Client ID | `123...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | ✅ Yes | OAuth Client Secret | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | ⚠️ Optional | OAuth callback URL | `http://localhost:8080/api/oauth/google/callback` |
| `GOOGLE_REFRESH_TOKEN` | ⚠️ Optional* | Long-lived auth token | `1//0g...` |

*Optional but required for actual calendar operations

## 🔒 Security Best Practices

1. **Never commit credentials**
   ```bash
   # Ensure .env is in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use environment-specific configs**
   ```env
   # Development
   GOOGLE_REDIRECT_URI=http://localhost:8080/api/oauth/google/callback
   
   # Production
   GOOGLE_REDIRECT_URI=https://api.meetops.com/api/oauth/google/callback
   ```

3. **Rotate tokens regularly**
   - Generate new refresh tokens every 6 months
   - Revoke old tokens from Google Account settings

## 📚 Additional Resources

- **Setup Guide**: See [CALENDAR_SETUP.md](./CALENDAR_SETUP.md)
- **Test Scripts**: 
  - `test-calendar.js` - Connection test
  - `get-calendar-token.js` - Token exchange helper
- **Service Code**: `src/services/calendar.service.js`
- **Config Code**: `src/config/calendar.js`

## 🎉 Success Indicators

When everything is working correctly:

```bash
$ node test-calendar.js

🗓️  Google Calendar Integration Test

Step 1: Checking configuration...
  ✓ Configured: true

Step 2: Getting OAuth2 client...
  ✓ OAuth2 client created

Step 4: Testing Calendar API access...
  ✓ Successfully connected to Google Calendar
  ✓ Found 3 upcoming events

✅ Calendar integration is working!
```

---

**Need Help?**
- Check logs in the terminal for detailed error messages
- Review [CALENDAR_SETUP.md](./CALENDAR_SETUP.md) for step-by-step setup
- Verify environment variables are loaded: `console.log(process.env.GOOGLE_CLIENT_ID)`
