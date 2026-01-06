import { create } from 'zustand';
import type {
  Meeting,
  ActionItem,
  MeetingSummary,
  TranscriptLine,
  ProcessingStep,
  SyncResult,
} from '@/types';
import {
  getMockMeeting,
  getMockActionItems,
  getMockSummary,
  getMockTranscript,
  getMockProcessingSteps,
  getMockSyncResult,
} from '@/lib/mockData';

interface MeetingStore {
  // Current meeting data
  meeting: Meeting | null;
  uploadedFile: File | null;
  uploadMethod: 'transcript' | 'audio';
  
  // Processing state
  processingSteps: ProcessingStep[];
  isProcessing: boolean;
  
  // Review data
  summary: MeetingSummary | null;
  actionItems: ActionItem[];
  transcript: TranscriptLine[];
  
  // Result data
  syncResult: SyncResult | null;

  // Actions
  setMeeting: (meeting: Partial<Meeting>) => void;
  setUploadedFile: (file: File | null) => void;
  setUploadMethod: (method: 'transcript' | 'audio') => void;
  startProcessing: () => Promise<void>;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => void;
  addActionItem: (item: Omit<ActionItem, 'id'>) => void;
  removeActionItem: (id: string) => void;
  syncToServices: () => Promise<void>;
  reset: () => void;
}

export const useMeetingStore = create<MeetingStore>()((set, get) => ({
  meeting: null,
  uploadedFile: null,
  uploadMethod: 'transcript',
  processingSteps: [],
  isProcessing: false,
  summary: null,
  actionItems: [],
  transcript: [],
  syncResult: null,

  setMeeting: (meetingData) => {
    const current = get().meeting || getMockMeeting();
    set({ meeting: { ...current, ...meetingData } });
  },

  setUploadedFile: (file) => {
    set({ uploadedFile: file });
  },

  setUploadMethod: (method) => {
    set({ uploadMethod: method });
  },

  startProcessing: async () => {
    set({ isProcessing: true, processingSteps: getMockProcessingSteps() });

    // Simulate step-by-step processing
    const steps = getMockProcessingSteps();
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const updatedSteps = steps.map((step, index) => {
        if (index < i) {
          return { ...step, status: 'complete' as const, progress: 100 };
        } else if (index === i) {
          return { ...step, status: 'processing' as const, progress: 80 };
        }
        return step;
      });
      
      set({ processingSteps: updatedSteps });
    }

    // Complete all steps
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      processingSteps: steps.map((s) => ({ ...s, status: 'complete' as const, progress: 100 })),
      isProcessing: false,
      summary: getMockSummary(),
      actionItems: getMockActionItems(),
      transcript: getMockTranscript(),
    });
  },

  updateActionItem: (id, updates) => {
    set({
      actionItems: get().actionItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  },

  addActionItem: (item) => {
    const newItem: ActionItem = {
      ...item,
      id: `ai_${Date.now()}`,
    };
    set({ actionItems: [...get().actionItems, newItem] });
  },

  removeActionItem: (id) => {
    set({
      actionItems: get().actionItems.filter((item) => item.id !== id),
    });
  },

  syncToServices: async () => {
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ syncResult: getMockSyncResult() });
  },

  reset: () => {
    set({
      meeting: null,
      uploadedFile: null,
      uploadMethod: 'transcript',
      processingSteps: [],
      isProcessing: false,
      summary: null,
      actionItems: [],
      transcript: [],
      syncResult: null,
    });
  },
}));
