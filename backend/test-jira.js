#!/usr/bin/env node

/**
 * Test Jira Integration
 * 
 * Usage:
 * node test-jira.js
 * 
 * This verifies your Jira credentials and connectivity
 */

require('dotenv').config();

const { testJiraConnection } = require('./src/config/jira');
const jiraService = require('./src/services/jira.service');

async function runTests() {
  console.log('\n🧪 MeetOps Task 4 — Jira Integration Test\n');

  // Test 1: Connection
  console.log('1️⃣ Testing Jira Connection...');
  const connected = await testJiraConnection();
  
  if (!connected) {
    console.log('\n✗ Jira connection failed. Check your .env variables.');
    console.log('   Required:');
    console.log('   - JIRA_HOST');
    console.log('   - JIRA_EMAIL');
    console.log('   - JIRA_API_TOKEN');
    console.log('   - JIRA_PROJECT_KEY\n');
    process.exit(1);
  }

  console.log('\n✓ Jira connection successful!\n');

  // Test 2: Create test issue
  console.log('2️⃣ Creating test issue...');
  try {
    const issue = await jiraService.createIssue({
      summary: '[TEST] MeetOps Integration Test',
      description: 'This is an automated test from MeetOps backend.',
      issueType: 'Task',
    });

    console.log(`✓ Issue created: ${issue.key}`);
    console.log(`  URL: ${issue.url}\n`);

    // Test 3: Add comment
    console.log('3️⃣ Adding comment to issue...');
    await jiraService.addComment(
      issue.key,
      'This is a test comment from MeetOps. You can safely delete this issue.'
    );
    console.log(`✓ Comment added\n`);

    // Test 4: Get issue details
    console.log('4️⃣ Fetching issue details...');
    const details = await jiraService.getIssue(issue.key);
    console.log(`✓ Issue Details:`);
    console.log(`  Key: ${details.key}`);
    console.log(`  Summary: ${details.summary}`);
    console.log(`  Status: ${details.status}\n`);

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }

  console.log('✅ All tests passed! Jira integration is working correctly.\n');
  console.log('Next steps:');
  console.log('1. Check your Jira project for the test issue');
  console.log('2. Update your .env with real Jira credentials');
  console.log('3. Follow TASK_4_README.md for full implementation\n');
}

runTests().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
