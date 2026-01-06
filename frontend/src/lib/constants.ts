// Route paths
export const ROUTES = {
  // Root
  ROOT: '/',
  
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  INVITE: '/invite',
  
  // App
  WORKSPACE: '/workspace',
  INTEGRATIONS: '/integrations',
  UPLOAD: '/upload',
  PROCESSING: '/processing',
  REVIEW: '/review',
  RESULT: '/result',
  DOCS: '/docs',
  SETTINGS: '/settings',
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  TRANSCRIPT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  AUDIO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  TRANSCRIPT_FORMATS: ['.txt', '.docx', '.md'],
  AUDIO_FORMATS: ['.mp3', '.m4a', '.wav'],
} as const;

// Processing steps
export const PROCESSING_STEPS = [
  'Transcribing',
  'Summarizing',
  'Extracting Decisions',
  'Action Items',
  'Analyzing Urgency',
] as const;

// Priority levels
export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
} as const;

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
} as const;

// Animation durations (in ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  PAGE_TRANSITION: 400,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'meetops-theme',
  AUTH_TOKEN: 'meetops-auth-token',
} as const;
