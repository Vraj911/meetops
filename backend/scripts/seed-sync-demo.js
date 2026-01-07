#!/usr/bin/env node

/**
 * Seed and run a real Jira sync demo
 * - Creates minimal User, Workspace, Meeting (APPROVED), Review with finalActionItems, AiOutput summary
 * - Calls jiraService.syncMeetingToJira(meetingId)
 */

require('dotenv').config();

const { connectDatabase, disconnectDatabase, User, Workspace, Meeting, Review, AiOutput } = require('../src/config/mongoose');
const jiraService = require('../src/services/jira.service');

async function ensureUser(email) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name: 'MeetOps Demo User', role: 'OWNER' });
  }
  return user;
}

async function ensureWorkspace(name, ownerId) {
  let ws = await Workspace.findOne({ name });
  if (!ws) {
    ws = await Workspace.create({ name, ownerId, members: [{ userId: ownerId, role: 'OWNER' }] });
  }
  return ws;
}

async function createApprovedMeeting(workspaceId, userId) {
  const meeting = await Meeting.create({
    workspaceId,
    createdBy: userId,
    title: 'MeetOps Sync Demo Meeting',
    duration: 45,
    participants: ['alice@example.com', 'bob@example.com'],
    sourceType: 'TRANSCRIPT',
    sourceUrl: 'https://example.com/transcript.txt',
    status: 'APPROVED',
  });
  return meeting;
}

async function createReview(meetingId, userId) {
  const review = await Review.create({
    meetingId,
    approvedBy: userId,
    finalSummary: {
      text: 'Project plan discussed and next steps defined.',
    },
    finalActionItems: [
      { title: 'Create project timeline', ownerHint: 'Alice', confidence: 0.9 },
      { title: 'Set up CI pipeline', ownerHint: 'Bob', confidence: 0.85 },
    ],
    approvedAt: new Date(),
  });
  return review;
}

async function createAiOutput(meetingId) {
  const ai = await AiOutput.create({
    meetingId,
    version: 1,
    summary: ['Team agreed to proceed with MVP scope and timelines.'],
    decisions: ['Use GitHub Actions for CI', 'Target alpha release in 4 weeks'],
    actionItems: [
      { title: 'Draft MVP specs', ownerHint: 'PM', confidence: 0.8 },
    ],
    confidenceScores: { summary: 0.92 },
    rawOutput: { model: 'demo', tokens: 1234 },
  });
  return ai;
}

async function main() {
  console.log('\n🧪 MeetOps — Real Jira Sync Demo');
  await connectDatabase();

  try {
    const demoEmail = process.env.DEMO_USER_EMAIL || 'demo.meetops@example.com';
    const user = await ensureUser(demoEmail);
    const workspace = await ensureWorkspace('MeetOps Demo Workspace', user._id);

    const meeting = await createApprovedMeeting(workspace._id, user._id);
    await createReview(meeting._id, user._id);
    await createAiOutput(meeting._id);

    console.log(`\n➡️  Seeding done. Meeting ID: ${meeting._id}`);
    console.log('➡️  Triggering Jira sync...');

    const result = await jiraService.syncMeetingToJira(meeting._id.toString());
    console.log('\n✅ Jira sync result:');
    console.log(JSON.stringify(result, null, 2));

    console.log('\nNext: Check your Jira project for created issues.');
  } catch (err) {
    console.error('\n✗ Demo failed:', err.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

main();
