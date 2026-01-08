const { ACTION_ITEMS_MODEL, callHFModel } = require("../../config/ai");

exports.extract = async ({ transcriptText }) => {
  if (!transcriptText) throw new Error('transcriptText required');
  if (!ACTION_ITEMS_MODEL) throw new Error('ACTION_ITEMS_MODEL not configured');

  const prompt = `You are a deterministic assistant. Produce ONLY valid JSON and nothing else.\nOutput must exactly satisfy this schema: {"actionItems": [{"title":"...","ownerHint":"...","confidence":0.75}] }.\nConfidence must be a number between 0 and 1.\nDo NOT include markdown, explanation, or extra fields.\nTranscript:\n"""${transcriptText}"""`;

  const resText = await callHFModel({ model: ACTION_ITEMS_MODEL, payload: { inputs: prompt } });

  let parsed;
  try {
    parsed = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Failed to parse JSON from action items model: ${String(resText).slice(0,200)}`);
  }

  if (!Array.isArray(parsed.actionItems)) throw new Error('action items model output missing "actionItems" array');

  parsed.actionItems.forEach((it, idx) => {
    if (!it || typeof it !== 'object') throw new Error(`action item at index ${idx} must be an object`);
    if (typeof it.title !== 'string' || !it.title.trim()) throw new Error(`action item at index ${idx} missing or invalid "title"`);
    if (typeof it.ownerHint !== 'string') throw new Error(`action item at index ${idx} missing or invalid "ownerHint"`);
    if (typeof it.confidence !== 'number' || Number.isNaN(it.confidence) || it.confidence < 0 || it.confidence > 1) {
      throw new Error(`action item at index ${idx} has invalid "confidence"; must be number between 0 and 1`);
    }
  });

  return parsed.actionItems;
};
