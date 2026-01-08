const Meeting = require("../models/Meeting");
const AiOutput = require("../models/AiOutput");
const Review = require("../models/Review");
const aiService = require("./ai.service");
const { canTransition } = require("../utils/constants");

exports.upload = async (data) => {
  if (!data || typeof data !== "object") throw new Error("data is required");

  const { workspaceId, title, sourceType, sourceUrl, createdBy } = data;

  if (!workspaceId) throw new Error("workspaceId is required");
  if (!title) throw new Error("title is required");
  if (!sourceType || (sourceType !== "TRANSCRIPT" && sourceType !== "AUDIO"))
    throw new Error('sourceType is required and must be "TRANSCRIPT" or "AUDIO"');
  if (!sourceUrl) throw new Error("sourceUrl is required");
  if (!createdBy) throw new Error("createdBy is required");

  const meeting = new Meeting({
    workspaceId,
    createdBy,
    title,
    sourceType,
    sourceUrl,
    status: "UPLOADED",
  });

  const saved = await meeting.save();
  return saved;
};

exports.start = async (meetingId) => {
  if (!meetingId) throw new Error("meetingId is required");

  const meeting = await Meeting.findById(meetingId);
  if (!meeting) throw new Error(`Meeting ${meetingId} not found`);

  if (!canTransition(meeting.status, "PROCESSING")) {
    throw new Error("Invalid meeting state transition");
  }

  meeting.status = "PROCESSING";
  await meeting.save();

  try {
    await aiService.generateAiOutput(meetingId);
  } catch (err) {
    // Update meeting to FAILED if pipeline errors
    try {
      const failedMeeting = await Meeting.findById(meetingId);
      if (failedMeeting) {
        failedMeeting.status = "FAILED";
        await failedMeeting.save();
      }
    } catch (saveErr) {
      console.error("Failed to mark meeting as FAILED:", saveErr.message);
    }

    throw err;
  }

  return { ok: true, meetingId };
};

exports.getById = async (meetingId) => {
  if (!meetingId) throw new Error("meetingId is required");

  const meeting = await Meeting.findById(meetingId);
  if (!meeting) throw new Error(`Meeting ${meetingId} not found`);

  const aiOutput = await AiOutput.findOne({ meetingId }).sort({ version: -1 }).exec();
  const review = await Review.findOne({ meetingId }).exec();

  return { meeting, aiOutput, review };
};
