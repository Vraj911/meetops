/**
 * Central API module for backend communication
 * All requests use fetch with base URL from environment
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch wrapper that throws on non-200 responses
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
async function fetchAPI(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`API Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Upload a meeting
 * @param {object} data - Meeting data to upload
 * @returns {Promise<any>} Response from POST /meetings/upload
 */
export async function uploadMeeting(data) {
  return fetchAPI('/api/meetings/upload', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Start a meeting
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<any>} Response from POST /meetings/:id/start
 */
export async function startMeeting(meetingId) {
  return fetchAPI(`/api/meetings/${meetingId}/start`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

/**
 * Process a meeting with AI
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<any>} Response from POST /ai/process/:meetingId
 */
export async function processMeeting(meetingId) {
  return fetchAPI(`/ai/process/${meetingId}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

/**
 * Get AI output for a meeting
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<any>} Response from GET /ai/output/:meetingId
 */
export async function getAiOutput(meetingId) {
  return fetchAPI(`/ai/output/${meetingId}`, {
    method: 'GET',
  });
}

/**
 * Refine AI output with instruction
 * @param {string} meetingId - Meeting ID
 * @param {string} instruction - Refinement instruction
 * @returns {Promise<any>} Response from POST /review/:meetingId/refine
 */
export async function refineAiOutput(meetingId, instruction) {
  return fetchAPI(`/review/${meetingId}/refine`, {
    method: 'POST',
    body: JSON.stringify({ instruction }),
  });
}

/**
 * Approve a review
 * @param {string} meetingId - Meeting ID
 * @param {object} payload - Approval payload
 * @returns {Promise<any>} Response from POST /review/:meetingId/approve
 */
export async function approveReview(meetingId, payload) {
  return fetchAPI(`/review/${meetingId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Create a new meeting
 * @param {object} data - Meeting data to create
 * @returns {Promise<any>} Response from POST /meetings/upload
 */
export async function createMeeting(data) {
  return fetchAPI('/api/meetings/upload', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Start a meeting (transition to PROCESSING status)
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<any>} Response from POST /meetings/:id/start
 */
export async function startMeetingAPI(meetingId) {
  return fetchAPI(`/api/meetings/${meetingId}/start`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

/**
 * Get meeting details
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<any>} Response from GET /meetings/:id
 */
export async function getMeeting(meetingId) {
  return fetchAPI(`/api/meetings/${meetingId}`, {
    method: 'GET',
  });
}
