const JiraApi = require('jira-client');

/**
 * Jira Client Configuration (jira-client)
 * Initializes connection to Jira Cloud with API Token authentication
 */

if (!process.env.JIRA_HOST || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
  console.warn('⚠ Jira environment variables not fully configured.');
  console.warn('   Set JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN in .env');
}

// Normalize host to domain without protocol
const hostNormalized = (process.env.JIRA_HOST || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

const jiraClient = new JiraApi({
  protocol: 'https',
  host: hostNormalized,
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '2',
  strictSSL: true,
});

/**
 * Test Jira connection
 */
const testJiraConnection = async () => {
  try {
    const info = await jiraClient.getServerInfo();
    console.log(`✓ Jira connected: ${info.serverTitle || 'Jira'}`);
    return true;
  } catch (error) {
    console.error('✗ Jira connection failed:', error.message);
    return false;
  }
};

module.exports = {
  jiraClient,
  testJiraConnection,
};
