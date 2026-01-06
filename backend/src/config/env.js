function required(name, value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    const err = new Error(`Missing required env var: ${name}`);
    err.code = "ENV_MISSING";
    throw err;
  }
  return value;
}

function asInt(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBool(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: asInt(process.env.PORT, 8080),

  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8080",

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || "",

  // HuggingFace
  HF_API_TOKEN: process.env.HF_API_TOKEN || "",
  HF_TRANSCRIPTION_MODEL: process.env.HF_TRANSCRIPTION_MODEL || "openai/whisper-small",
  HF_SUMMARY_MODEL: process.env.HF_SUMMARY_MODEL || "facebook/bart-large-cnn",
  HF_DECISION_MODEL: process.env.HF_DECISION_MODEL || "google/flan-t5-base",
  HF_ACTIONITEM_MODEL: process.env.HF_ACTIONITEM_MODEL || "google/flan-t5-base",
  HF_CONFIDENCE_MODEL: process.env.HF_CONFIDENCE_MODEL || "google/flan-t5-base",

  // Clerk (auth)
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
  CLERK_JWT_ISSUER: process.env.CLERK_JWT_ISSUER || "",

  // Redis / BullMQ
  REDIS_URL: process.env.REDIS_URL || "",
  BULLMQ_PREFIX: process.env.BULLMQ_PREFIX || "meetops",

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: asInt(process.env.SMTP_PORT, 587),
  SMTP_SECURE: asBool(process.env.SMTP_SECURE, false),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "no-reply@meetops.local",

  // Swagger
  SWAGGER_ENABLED: asBool(process.env.SWAGGER_ENABLED, true),
  SWAGGER_ROUTE: process.env.SWAGGER_ROUTE || "/docs",

  // External integrations (optional)
  JIRA_BASE_URL: process.env.JIRA_BASE_URL || "",
  JIRA_EMAIL: process.env.JIRA_EMAIL || "",
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || "",
};

function validateEnvForRuntime() {
  // For hackathon/dev you might not want hard failures.
  // Call this in production boot to enforce minimum requirements.
  required("MONGO_URI", env.MONGO_URI);
}

module.exports = {
  env,
  validateEnvForRuntime,
};
