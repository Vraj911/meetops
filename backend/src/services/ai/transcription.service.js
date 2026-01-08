const { TRANSCRIPTION_MODEL, callHFModel } = require("../../config/ai");

exports.transcribe = async ({ sourceUrl }) => {
  if (!sourceUrl) throw new Error('sourceUrl required');
  if (!TRANSCRIPTION_MODEL) throw new Error('TRANSCRIPTION_MODEL not configured');

  const resText = await callHFModel({ model: TRANSCRIPTION_MODEL, payload: { inputs: sourceUrl } });
  if (!resText || String(resText).trim().length === 0) {
    throw new Error('Transcription model returned empty response');
  }

  const trimmed = String(resText).trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      if (typeof parsed.text === 'string' && parsed.text.trim()) return parsed.text.trim();
      if (typeof parsed.transcript === 'string' && parsed.transcript.trim()) return parsed.transcript.trim();
      throw new Error('Transcription model returned JSON without text or transcript fields');
    }
  } catch (e) {
    // Not JSON -> assume plain text
    return trimmed;
  }
};
