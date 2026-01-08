const { SUMMARIZATION_MODEL, callHFModel } = require("../../config/ai");

exports.summarize = async ({ transcriptText }) => {
  if (!transcriptText) throw new Error('transcriptText required');
  if (!SUMMARIZATION_MODEL) throw new Error('SUMMARIZATION_MODEL not configured');

  const prompt = `You are a deterministic assistant. Produce ONLY valid JSON and nothing else.\nOutput must exactly satisfy this schema: {"summary": ["short point 1","short point 2"]}.\nDo NOT include markdown, explanation, or extra fields.\nTranscript:\n"""${transcriptText}"""`;

  const resText = await callHFModel({ model: SUMMARIZATION_MODEL, payload: { inputs: prompt } });

  let parsed;
  try {
    parsed = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Failed to parse JSON from summarization model: ${String(resText).slice(0,200)}`);
  }

  if (!Array.isArray(parsed.summary)) throw new Error('summarization model output missing "summary" array');
  if (!parsed.summary.every(s => typeof s === 'string')) throw new Error('summarization model "summary" items must be strings');

  return parsed.summary;
};
