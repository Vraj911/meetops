const { CONFIDENCE_MODEL, callHFModel } = require("../../config/ai");

exports.score = async ({ transcriptText, summary, decisions, actionItems }) => {
  if (!transcriptText) throw new Error('transcriptText required');
  if (!CONFIDENCE_MODEL) throw new Error('CONFIDENCE_MODEL not configured');

  const payloadObj = { transcriptText, summary, decisions, actionItems };
  const prompt = `You are a deterministic assistant. Produce ONLY valid JSON and nothing else.\nOutput must exactly satisfy this schema: {"confidenceScores": {"summary":0.9, "decisions":0.8, "actionItems":0.75}}.\nEach value must be a number between 0 and 1.\nDo NOT include markdown, explanation, or extra fields.\nInput JSON:\n${JSON.stringify(payloadObj)}`;

  const resText = await callHFModel({ model: CONFIDENCE_MODEL, payload: { inputs: prompt } });

  let parsed;
  try {
    parsed = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Failed to parse JSON from confidence model: ${String(resText).slice(0,200)}`);
  }

  if (!parsed || typeof parsed !== 'object' || typeof parsed.confidenceScores !== 'object' || parsed.confidenceScores === null) {
    throw new Error('confidence model output missing "confidenceScores" object');
  }

  const cs = parsed.confidenceScores;
  ['summary', 'decisions', 'actionItems'].forEach((k) => {
    if (typeof cs[k] !== 'number' || Number.isNaN(cs[k]) || cs[k] < 0 || cs[k] > 1) {
      throw new Error(`confidenceScores.${k} must be a number between 0 and 1`);
    }
  });

  return cs;
};
