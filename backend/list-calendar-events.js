require('dotenv').config();
const { getCalendarClient } = require('./src/config/calendar');

(async () => {
  try {
    const calendar = getCalendarClient();
    
    // List events from today onwards
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date('2026-01-08T00:00:00Z').toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`\n📅 Found ${events.length} upcoming events:\n`);

    events.forEach((event, i) => {
      const start = event.start.dateTime || event.start.date;
      const date = new Date(start);
      console.log(`${i + 1}. ${event.summary}`);
      console.log(`   Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
      console.log(`   Link: ${event.htmlLink}`);
      console.log('');
    });

    if (events.length === 0) {
      console.log('No events found. The calendar sync may have failed or events are scheduled outside this range.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
