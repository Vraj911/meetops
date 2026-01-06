const ROUTES = {
  // Root
  ROOT: "/",
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  INVITE: "/invite",
  // App
  WORKSPACE: "/workspace",
  INTEGRATIONS: "/integrations",
  UPLOAD: "/upload",
  PROCESSING: "/processing",
  REVIEW: "/review",
  RESULT: "/result",
  DOCS: "/docs",
  SETTINGS: "/settings"
};
const UPLOAD_LIMITS = {
  TRANSCRIPT_MAX_SIZE: 50 * 1024 * 1024,
  // 50MB
  AUDIO_MAX_SIZE: 100 * 1024 * 1024,
  // 100MB
  TRANSCRIPT_FORMATS: [".txt", ".docx", ".md"],
  AUDIO_FORMATS: [".mp3", ".m4a", ".wav"]
};
const PROCESSING_STEPS = [
  "Transcribing",
  "Summarizing",
  "Extracting Decisions",
  "Action Items",
  "Analyzing Urgency"
];
const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical"
};
const CONFIDENCE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60
};
const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  PAGE_TRANSITION: 400
};
const STORAGE_KEYS = {
  THEME: "meetops-theme",
  AUTH_TOKEN: "meetops-auth-token"
};
export {
  ANIMATION_DURATIONS,
  CONFIDENCE_THRESHOLDS,
  PRIORITY_LABELS,
  PROCESSING_STEPS,
  ROUTES,
  STORAGE_KEYS,
  UPLOAD_LIMITS
};
