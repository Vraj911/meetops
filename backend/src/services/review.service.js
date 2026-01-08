const Meeting = require("../models/Meeting");
const AiOutput = require("../models/AiOutput");
const Review = require("../models/Review");
const { REFINE_MODEL, callHFModel } = require("../config/ai");

// Return meeting, latest ai output, and existing review (if any)
exports.get = async (meetingId) => {
  if (!meetingId) throw new Error("meetingId is required");

  const meeting = await Meeting.findById(meetingId);
  if (!meeting) throw new Error(`Meeting ${meetingId} not found`);

  const aiOutput = await AiOutput.findOne({ meetingId }).sort({ version: -1 }).exec();
  const review = await Review.findOne({ meetingId }).exec();

  return { meeting, aiOutput, review };
};

// Approve the meeting: create a Review and update meeting.status to APPROVED
exports.approve = async (meetingId, body) => {
  if (!meetingId) throw new Error("meetingId is required");
  if (!body || typeof body !== "object") throw new Error("body is required");

  const meeting = await Meeting.findById(meetingId);
  if (!meeting) throw new Error(`Meeting ${meetingId} not found`);

  if (meeting.status !== "REVIEW") {
    throw new Error(
      `Meeting ${meetingId} status must be "REVIEW" to approve; current status: "${meeting.status}"`
    );
  }

  const { approvedBy, finalSummary, finalActionItems } = body;
  if (!approvedBy) throw new Error("approvedBy is required");
  if (!finalSummary) throw new Error("finalSummary is required");
  if (!finalActionItems || !Array.isArray(finalActionItems)) throw new Error("finalActionItems must be an array");

  const review = new Review({
    meetingId,
    approvedBy,
    finalSummary,
    finalActionItems,
    approvedAt: new Date(),
  });

  const saved = await review.save();

  meeting.status = "APPROVED";
  await meeting.save();

  return { success: true, review: saved };
};

// Generate a diff-only refinement using HF refine model. Do NOT apply changes.
exports.refine = async (meetingId, body) => {
  if (!meetingId) throw new Error("meetingId is required");
  if (!body || typeof body !== "object") throw new Error("body is required");

  const { instruction } = body;
  if (!instruction || typeof instruction !== "string") throw new Error("instruction is required");

  const aiOutput = await AiOutput.findOne({ meetingId }).sort({ version: -1 }).exec();
  if (!aiOutput) throw new Error(`No AiOutput found for meeting ${meetingId}`);

  if (!REFINE_MODEL) throw new Error("REFINE_MODEL not configured");

  const payload = {
    inputs: `You are a deterministic assistant that proposes REFINEMENT DIFFS ONLY.\nReturn only valid JSON with shape: {"diff": {"added":[], "removed":[], "changed":[]}, "explanation":"short text"}.\nDo NOT return full documents, markdown, or explanations beyond the single field 'explanation'.\nInstruction: ${instruction}\n\nCurrent AI output JSON:\n${JSON.stringify({
      summary: aiOutput.summary,
      decisions: aiOutput.decisions,
      actionItems: aiOutput.actionItems,
      confidenceScores: aiOutput.confidenceScores,
    })}`,
  };

  const resText = await callHFModel({ model: REFINE_MODEL, payload });

  let parsed;
  try {
    parsed = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Failed to parse JSON from refine model: ${String(resText).slice(0,200)}`);
  }

  if (!parsed || typeof parsed !== "object") throw new Error("refine model returned invalid JSON");

  const { diff, explanation } = parsed;
  if (!diff || typeof diff !== "object") throw new Error('refine model output missing "diff" object');
  ["added", "removed", "changed"].forEach((k) => {
    if (!Array.isArray(diff[k])) throw new Error(`refine model diff.${k} must be an array`);
  });
  if (typeof explanation !== "string") throw new Error('refine model output missing "explanation" string');

  // NEVER apply the diff here. Return proposals only.
  return { diff, explanation };
};

// Backwards-compatible aliases (if other code imports old names)
exports.getReview = exports.get;
exports.createReview = async (data) => {
  if (!data || typeof data !== "object") throw new Error("data required");
  const review = await Review.create(data);
  return review;
};
exports.approveReview = async (reviewId) => {
  // Minimal helper: mark approvedAt now (keeps compatibility)
  const review = await Review.findById(reviewId);
  if (!review) throw new Error(`Review ${reviewId} not found`);
  review.approvedAt = new Date();
  await review.save();
  return review;
};
