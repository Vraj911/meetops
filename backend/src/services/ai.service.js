const Meeting = require("../models/Meeting");
const AiOutput = require("../models/AiOutput");
const transcriptionService = require("./ai/transcription.service");
const summarizationService = require("./ai/summarization.service");
const decisionService = require("./ai/decision.service");
const actionItemService = require("./ai/actionItem.service");
const confidenceService = require("./ai/confidence.service");

exports.generateAiOutput = async (meetingId) => {
  if (!meetingId) throw new Error("meetingId is required");

  const meeting = await Meeting.findById(meetingId);
  if (!meeting) throw new Error(`Meeting ${meetingId} not found`);

  if (meeting.status !== "PROCESSING") {
    throw new Error(
      `Meeting ${meetingId} status must be "PROCESSING" to run AI pipeline; current status: "${meeting.status}"`
    );
  }

  let transcriptText;
  if (meeting.sourceType === "AUDIO") {
    if (!meeting.sourceUrl) throw new Error("meeting.sourceUrl required for AUDIO sourceType");
    transcriptText = await transcriptionService.transcribe({ sourceUrl: meeting.sourceUrl });
  } else {
    // Treat non-AUDIO as pre-provided transcript text
    if (!meeting.sourceUrl) throw new Error("meeting.sourceUrl required for TRANSCRIPT sourceType (transcript text)");
    transcriptText = meeting.sourceUrl;
  }

  const summary = await summarizationService.summarize({ transcriptText });
  const decisions = await decisionService.extract({ transcriptText });
  const actionItems = await actionItemService.extract({ transcriptText });
  const confidenceScores = await confidenceService.score({ transcriptText, summary, decisions, actionItems });

  // Validation
  if (!Array.isArray(summary)) throw new Error("summarizationService.summarize must return an array");
  if (!Array.isArray(decisions)) throw new Error("decisionService.extract must return an array");
  if (!Array.isArray(actionItems)) throw new Error("actionItemService.extract must return an array");
  if (typeof confidenceScores !== "object" || confidenceScores === null || Array.isArray(confidenceScores)) {
    throw new Error("confidenceService.score must return an object");
  }

  // Determine version
  const previous = await AiOutput.findOne({ meetingId }).sort({ version: -1 }).exec();
  const version = previous && previous.version ? previous.version + 1 : 1;

  const rawOutput = { transcriptText, summary, decisions, actionItems, confidenceScores };

  const aiOutput = new AiOutput({ meetingId, version, summary, decisions, actionItems, confidenceScores, rawOutput });
  const saved = await aiOutput.save();

  meeting.status = "REVIEW";
  await meeting.save();

  return saved;
};

exports.getAiOutput = async (meetingId) => {
  if (!meetingId) throw new Error("meetingId is required");

  const latest = await AiOutput.findOne({ meetingId }).sort({ version: -1 }).exec();
  if (!latest) throw new Error(`No AiOutput found for meeting ${meetingId}`);

  return latest;
};
