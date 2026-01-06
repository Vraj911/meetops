// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  lastActive?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string;
  createdAt: string;
  domain: string;
  plan: 'starter' | 'pro' | 'enterprise';
}

export interface TeamMember extends User {
  joinedAt: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: 'member' | 'admin';
  invitedAt: string;
  status: 'pending' | 'expired';
}

export interface WorkspaceStats {
  meetingsProcessed: number;
  actionItemsCreated: number;
  syncSuccessRate: number;
}

// Integration Types
export type IntegrationStatus = 'connected' | 'not_connected' | 'connecting' | 'error';

export interface JiraIntegration {
  status: IntegrationStatus;
  instanceUrl?: string;
  project?: string;
  issueType?: string;
  lastSync?: string;
  issuesCreated?: number;
}

export interface CalendarIntegration {
  status: IntegrationStatus;
  defaultCalendar?: string;
  eventType?: string;
  bufferTime?: string;
}

export interface ApiAccess {
  status: 'available' | 'unavailable';
  webhooksEnabled: boolean;
  rateLimit: string;
}

// Meeting Types
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
}

export interface TranscriptLine {
  timestamp: string;
  speaker: string;
  text: string;
  confidence?: number;
}

export interface Decision {
  id: string;
  text: string;
  confidence: number;
  timestamp: string;
}

export interface ActionItem {
  id: string;
  title: string;
  owner: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  confidence: number;
  source: string;
  completed?: boolean;
}

export interface MeetingSummary {
  keyThemes: string[];
  decisions: Decision[];
  risks: string[];
  overallConfidence: number;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  description?: string;
}

// Sync Result Types
export interface JiraTicket {
  id: string;
  key: string;
  title: string;
  status: string;
  assignee: string;
  url: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  url: string;
}

export interface SyncResult {
  success: boolean;
  actionItemsCreated: number;
  teamMembersAssigned: number;
  calendarEventsCreated: number;
  syncDuration: string;
  jiraTickets: JiraTicket[];
  calendarEvents: CalendarEvent[];
  itemsRequiringAttention: {
    title: string;
    reason: string;
  }[];
}

// AI Refinement Types
export interface AiPrompt {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export interface AiChange {
  type: 'add' | 'remove' | 'modify' | 'merge';
  count?: number;
  confidenceImpact?: string;
}

// UI Types
export type Theme = 'light' | 'dark';

export interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
}
