const { DECISION_MODEL, callHFModel } = require("../../config/ai");

exports.extract = async ({ transcriptText }) => {
  if (!transcriptText) throw new Error('transcriptText required');
  if (!DECISION_MODEL) throw new Error('DECISION_MODEL not configured');

  const prompt = `You are a deterministic assistant. Produce ONLY valid JSON and nothing else.\nOutput must exactly satisfy this schema: {"decisions": ["decision 1","decision 2"]}.\nReturn an empty array if there are no decisions.\nDo NOT include markdown, explanation, or extra fields.\nTranscript:\n"""${transcriptText}"""`;

  const resText = await callHFModel({ model: DECISION_MODEL, payload: { inputs: prompt } });

  let parsed;
  try {
    parsed = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Failed to parse JSON from decision model: ${String(resText).slice(0,200)}`);
  }

  if (!Array.isArray(parsed.decisions)) throw new Error('decision model output missing "decisions" array');
  if (!parsed.decisions.every(d => typeof d === 'string')) throw new Error('decision model "decisions" items must be strings');

  return parsed.decisions;
};
