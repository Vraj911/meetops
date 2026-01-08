const { google } = require('googleapis');
const { env } = require('./env');

/**
 * Google Calendar API Configuration
 * Supports OAuth2 authentication for calendar operations
 */

let oauth2Client = null;

/**
 * Initialize OAuth2 client with credentials
 * @returns {OAuth2Client} Configured OAuth2 client
 */
function getOAuth2Client() {
  if (oauth2Client) {
    return oauth2Client;
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  Google Calendar credentials not configured');
    return null;
  }

  oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI || 'http://localhost:8080/api/oauth/google/callback'
  );

  // Set refresh token if available
  if (env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
}

/**
 * Get Calendar API instance
 * @returns {calendar_v3.Calendar} Google Calendar API instance
 */
function getCalendarClient() {
  const auth = getOAuth2Client();
  
  if (!auth) {
    throw new Error('Google Calendar client not configured');
  }

  return google.calendar({ version: 'v3', auth });
}

/**
 * Generate OAuth2 authorization URL
 * @returns {string} Authorization URL
 */
function getAuthUrl() {
  const auth = getOAuth2Client();
  
  if (!auth) {
    throw new Error('OAuth2 client not configured');
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  return auth.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

/**
 * Exchange authorization code for tokens
 * @param {string} code - Authorization code from OAuth callback
 * @returns {Promise<Object>} Token credentials
 */
async function getTokenFromCode(code) {
  const auth = getOAuth2Client();
  
  if (!auth) {
    throw new Error('OAuth2 client not configured');
  }

  const { tokens } = await auth.getToken(code);
  auth.setCredentials(tokens);
  
  return tokens;
}

/**
 * Check if calendar is properly configured
 * @returns {boolean} Configuration status
 */
function isConfigured() {
  return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

module.exports = {
  getOAuth2Client,
  getCalendarClient,
  getAuthUrl,
  getTokenFromCode,
  isConfigured,
};
