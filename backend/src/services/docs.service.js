const fs = require("fs");
const path = require("path");
const { DOCS_MODEL, callHFModel } = require("../config/ai");

// Ask a question, answering ONLY from static markdown files in src/docs
exports.ask = async ({ question }) => {
  if (!question || typeof question !== "string") throw new Error("question is required");
  if (!DOCS_MODEL) throw new Error("DOCS_MODEL not configured");

  const docsDir = path.join(__dirname, "..", "docs");
  let files;
  try {
    files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));
  } catch (err) {
    throw new Error("Failed to read docs directory");
  }

  if (!files.length) throw new Error("No markdown docs found");

  const contents = files
    .map((f) => {
      try {
        return `--- ${f} ---\n${fs.readFileSync(path.join(docsDir, f), "utf8")}`;
      } catch (e) {
        return `--- ${f} ---\n<failed to read>`;
      }
    })
    .join("\n\n");

  const prompt = `Answer ONLY using the following docs. Do NOT use external information. Return a concise plain-text answer (no markdown).\n\nDocs:\n${contents}\n\nQuestion: ${question}`;

  const resText = await callHFModel({ model: DOCS_MODEL, payload: { inputs: prompt } });
  if (!resText || String(resText).trim().length === 0) throw new Error("Docs model returned empty answer");

  return { answer: String(resText).trim() };
};

// Backwards-compatible placeholders
exports.generateDocs = exports.ask;
exports.getDocs = async () => {
  // Not implemented: docs are read dynamically via ask
  throw new Error("getDocs not implemented; use ask({question}) to query docs");
};
