require('dotenv').config();
const { getOAuth2Client, getCalendarClient, getAuthUrl, isConfigured } = require('./src/config/calendar');

console.log('\n🗓️  Google Calendar Integration Test\n');

// Step 1: Check if configured
console.log('Step 1: Checking configuration...');
const configured = isConfigured();
console.log(`  ✓ Configured: ${configured}`);

if (!configured) {
  console.log('\n❌ Google Calendar is not configured.');
  console.log('Please set the following environment variables:');
  console.log('  - GOOGLE_CLIENT_ID');
  console.log('  - GOOGLE_CLIENT_SECRET');
  console.log('  - GOOGLE_REDIRECT_URI (optional)');
  process.exit(1);
}

// Step 2: Get OAuth2 client
console.log('\nStep 2: Getting OAuth2 client...');
try {
  const oauth2Client = getOAuth2Client();
  console.log('  ✓ OAuth2 client created');
} catch (error) {
  console.log('  ✗ Error:', error.message);
  process.exit(1);
}

// Step 3: Generate auth URL (if no refresh token)
if (!process.env.GOOGLE_REFRESH_TOKEN) {
  console.log('\nStep 3: No refresh token found. Generate authorization URL:');
  try {
    const authUrl = getAuthUrl();
    console.log('\n🔗 Visit this URL to authorize the app:');
    console.log(`\n${authUrl}\n`);
    console.log('After authorization, you will receive a code.');
    console.log('Exchange it for tokens using the /api/oauth/google/callback endpoint.\n');
  } catch (error) {
    console.log('  ✗ Error:', error.message);
  }
  process.exit(0);
}

// Step 4: Test calendar API access
console.log('\nStep 4: Testing Calendar API access...');
(async () => {
  try {
    const calendar = getCalendarClient();
    
    // List calendar events
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`  ✓ Successfully connected to Google Calendar`);
    console.log(`  ✓ Found ${events.length} upcoming events\n`);

    if (events.length > 0) {
      console.log('Upcoming events:');
      events.forEach((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`  ${i + 1}. ${event.summary} (${start})`);
      });
    }

    console.log('\n✅ Calendar integration is working!\n');
  } catch (error) {
    console.log('  ✗ Error accessing Calendar API:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('\n⚠️  Refresh token may be expired. Please re-authorize the app.\n');
    }
    
    process.exit(1);
  }
})();
