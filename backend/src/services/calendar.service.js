const { getCalendarClient, isConfigured } = require('../config/calendar');
const { Meeting, Review, AiOutput } = require('../config/mongoose');
const { env } = require('../config/env');

/**
 * Sync meeting action items to Google Calendar
 * Creates calendar events for each approved action item
 * 
 * @param {string} meetingId - Meeting ID to sync
 * @param {Object} options - Sync options
 * @param {Array} options.actionItems - Override action items (optional)
 * @param {string} options.calendarId - Target calendar ID (default: 'primary')
 * @returns {Promise<Object>} Sync results
 */
exports.syncCalendar = async (meetingId, options = {}) => {
  if (!isConfigured()) {
    throw new Error('Google Calendar is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
  }

  // Fetch meeting details
  const meeting = await Meeting.findById(meetingId);
  if (!meeting) {
    throw new Error('Meeting not found');
  }

  if (meeting.status !== 'APPROVED' && meeting.status !== 'SYNCED') {
    throw new Error('Meeting must be approved before syncing to calendar');
  }

  // Get action items - either from options or from database
  let actionItems = options.actionItems;
  
  if (!actionItems) {
    const review = await Review.findOne({ meetingId });
    if (review && review.finalActionItems) {
      actionItems = Array.isArray(review.finalActionItems)
        ? review.finalActionItems
        : review.finalActionItems.items || [];
    }
  }

  if (!actionItems || actionItems.length === 0) {
    throw new Error('No action items to sync');
  }

  console.log(`📅 Calendar sync starting for meeting ${meetingId}`);
  console.log(`📋 Action items to sync: ${actionItems.length}`);
  console.log('Action items:', JSON.stringify(actionItems, null, 2));

  const calendarId = options.calendarId || 'primary';
  const calendar = getCalendarClient();
  const results = [];
  const errors = [];

  // Create calendar event for each action item
  for (const item of actionItems) {
    try {
      console.log(`📝 Creating event for: ${item.title || item.action}`);
      const event = await createEventFromActionItem(calendar, calendarId, item, meeting);
      console.log(`✅ Event created: ${event.id} - ${event.htmlLink}`);
      results.push({
        success: true,
        actionItem: item.title || item.action,
        eventId: event.id,
        eventLink: event.htmlLink,
        eventStart: event.start?.dateTime || event.start?.date,
      });
    } catch (error) {
      console.error(`❌ Failed to create event for ${item.title}:`, error.message);
      errors.push({
        success: false,
        actionItem: item.title || item.action,
        error: error.message,
      });
    }
  }

  console.log(`✓ Calendar sync complete: ${results.length} succeeded, ${errors.length} failed`);

  // Update meeting status if all events created successfully
  if (errors.length === 0) {
    meeting.status = 'SYNCED';
    await meeting.save();
  }

  return {
    meetingId,
    totalItems: actionItems.length,
    succeeded: results.length,
    failed: errors.length,
    results,
    errors: errors.length > 0 ? errors : undefined,
  };
};

/**
 * Create a single calendar event from an action item
 * 
 * @param {Object} calendar - Google Calendar client
 * @param {string} calendarId - Calendar ID
 * @param {Object} actionItem - Action item details
 * @param {Object} meeting - Meeting details
 * @returns {Promise<Object>} Created event
 */
async function createEventFromActionItem(calendar, calendarId, actionItem, meeting) {
  const title = actionItem.title || actionItem.action || 'Action Item';
  const owner = actionItem.ownerHint || actionItem.assignee || 'Unassigned';
  const dueDate = actionItem.dueDate || getDefaultDueDate();
  
  // Build event description
  let description = `Action Item from Meeting: ${meeting.title || 'Untitled Meeting'}\n\n`;
  description += `📋 Task: ${title}\n`;
  description += `👤 Owner: ${owner}\n`;
  
  if (actionItem.description) {
    description += `\n📝 Details:\n${actionItem.description}\n`;
  }
  
  if (meeting._id) {
    description += `\n🔗 Meeting ID: ${meeting._id}\n`;
  }

  // Parse or create due date
  const startDateTime = parseDateOrDefault(dueDate);
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + 1); // 1-hour duration

  const event = {
    summary: `[Action] ${title}`,
    description,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'UTC',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 }, // 1 hour before
      ],
    },
    colorId: '9', // Blue color for action items
  };

  // Add attendees if specified
  if (actionItem.ownerHint && actionItem.ownerHint.includes('@')) {
    event.attendees = [{ email: actionItem.ownerHint }];
  }

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });

  return response.data;
}

/**
 * Create a calendar event for the meeting itself
 * 
 * @param {string} meetingId - Meeting ID
 * @param {Object} options - Event options
 * @returns {Promise<Object>} Created event
 */
exports.createMeetingEvent = async (meetingId, options = {}) => {
  if (!isConfigured()) {
    throw new Error('Google Calendar is not configured');
  }

  const meeting = await Meeting.findById(meetingId).populate('createdBy');
  if (!meeting) {
    throw new Error('Meeting not found');
  }

  // Get summary
  let summary = 'Meeting Summary';
  const aiOutput = await AiOutput.findOne({ meetingId });
  if (aiOutput && aiOutput.summary) {
    summary = typeof aiOutput.summary === 'string' 
      ? aiOutput.summary 
      : aiOutput.summary.text || aiOutput.summary.summary || summary;
  }

  const calendarId = options.calendarId || 'primary';
  const calendar = getCalendarClient();

  const startTime = options.startTime || meeting.createdAt || new Date();
  const duration = meeting.duration || 60; // minutes
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration);

  const event = {
    summary: meeting.title || 'MeetOps Meeting',
    description: `Meeting Summary:\n\n${summary}\n\n📎 Participants: ${meeting.participants?.join(', ') || 'N/A'}`,
    start: {
      dateTime: new Date(startTime).toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'UTC',
    },
    colorId: '10', // Green for meetings
  };

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });

  return {
    success: true,
    eventId: response.data.id,
    eventLink: response.data.htmlLink,
  };
};

/**
 * List upcoming events from calendar
 * 
 * @param {Object} options - Query options
 * @returns {Promise<Array>} List of events
 */
exports.listEvents = async (options = {}) => {
  if (!isConfigured()) {
    throw new Error('Google Calendar is not configured');
  }

  const calendar = getCalendarClient();
  const calendarId = options.calendarId || 'primary';
  const maxResults = options.maxResults || 10;
  const timeMin = options.timeMin || new Date().toISOString();

  const response = await calendar.events.list({
    calendarId,
    timeMin,
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
};

/**
 * Delete a calendar event
 * 
 * @param {string} eventId - Event ID to delete
 * @param {string} calendarId - Calendar ID
 * @returns {Promise<Object>} Deletion result
 */
exports.deleteEvent = async (eventId, calendarId = 'primary') => {
  if (!isConfigured()) {
    throw new Error('Google Calendar is not configured');
  }

  const calendar = getCalendarClient();
  
  await calendar.events.delete({
    calendarId,
    eventId,
  });

  return { success: true, eventId };
};

// Helper functions

/**
 * Get default due date (7 days from now)
 * @returns {Date} Default due date
 */
function getDefaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(10, 0, 0, 0); // 10 AM
  return date;
}

/**
 * Parse date string or return default
 * @param {string|Date} dateInput - Date input
 * @returns {Date} Parsed date
 */
function parseDateOrDefault(dateInput) {
  if (!dateInput) return getDefaultDueDate();
  
  // Handle "Today"
  if (typeof dateInput === 'string' && dateInput.toLowerCase() === 'today') {
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    return today;
  }
  
  // Handle "Mar 22", "Mar 29", etc. format
  if (typeof dateInput === 'string' && /^[A-Za-z]{3}\s+\d{1,2}$/.test(dateInput.trim())) {
    const [month, day] = dateInput.trim().split(/\s+/);
    const currentYear = new Date().getFullYear();
    const monthMap = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    const monthIndex = monthMap[month.toLowerCase()];
    if (monthIndex !== undefined) {
      const date = new Date(currentYear, monthIndex, parseInt(day), 10, 0, 0, 0);
      return date;
    }
  }
  
  const parsed = new Date(dateInput);
  if (isNaN(parsed.getTime())) {
    return getDefaultDueDate();
  }
  
  return parsed;
}
