const axios = require("axios");

const HF_API_TOKEN = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_TOKEN || "";
const BASE_URL = process.env.HF_BASE_URL || "https://api-inference.huggingface.co/models";

const TRANSCRIPTION_MODEL = process.env.HF_TRANSCRIPTION_MODEL || "";
const SUMMARIZATION_MODEL = process.env.HF_SUMMARIZATION_MODEL || "";
const DECISION_MODEL = process.env.HF_DECISION_MODEL || "";
const ACTION_ITEMS_MODEL = process.env.HF_ACTION_ITEMS_MODEL || "";
const CONFIDENCE_MODEL = process.env.HF_CONFIDENCE_MODEL || "";
const REFINE_MODEL = process.env.HF_REFINE_MODEL || "";
const DOCS_MODEL = process.env.HF_DOCS_MODEL || "";

async function callHFModel({ model, payload }) {
  if (!model) throw new Error("model is required");
  if (!HF_API_TOKEN) throw new Error("HF_API_TOKEN is not set in environment");

  const url = `${BASE_URL}/${model}`;

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      responseType: "text",
      timeout: 60_000,
    });

    return res.data; // raw response text (do NOT parse JSON here)
  } catch (err) {
    // Normalize axios error to include useful info but keep message concise
    if (err.response) {
      const status = err.response.status;
      const text = err.response.data;
      throw new Error(`HF model call failed for ${model}: ${status} - ${String(text).slice(0, 100)}`);
    }
    throw new Error(`HF model call failed for ${model}: ${err.message}`);
  }
}

module.exports = {
  HF_API_TOKEN,
  BASE_URL,
  TRANSCRIPTION_MODEL,
  SUMMARIZATION_MODEL,
  DECISION_MODEL,
  ACTION_ITEMS_MODEL,
  CONFIDENCE_MODEL,
  REFINE_MODEL,
  DOCS_MODEL,
  callHFModel,
};
