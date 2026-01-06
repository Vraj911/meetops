import { create } from "zustand";
import {
  getMockMeeting,
  getMockActionItems,
  getMockSummary,
  getMockTranscript,
  getMockProcessingSteps,
  getMockSyncResult
} from "@/lib/mockData";
const useMeetingStore = create()((set, get) => ({
  meeting: null,
  uploadedFile: null,
  uploadMethod: "transcript",
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
    const steps = getMockProcessingSteps();
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updatedSteps = steps.map((step, index) => {
        if (index < i) {
          return { ...step, status: "complete", progress: 100 };
        } else if (index === i) {
          return { ...step, status: "processing", progress: 80 };
        }
        return step;
      });
      set({ processingSteps: updatedSteps });
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      processingSteps: steps.map((s) => ({ ...s, status: "complete", progress: 100 })),
      isProcessing: false,
      summary: getMockSummary(),
      actionItems: getMockActionItems(),
      transcript: getMockTranscript()
    });
  },
  updateActionItem: (id, updates) => {
    set({
      actionItems: get().actionItems.map(
        (item) => item.id === id ? { ...item, ...updates } : item
      )
    });
  },
  addActionItem: (item) => {
    const newItem = {
      ...item,
      id: `ai_${Date.now()}`
    };
    set({ actionItems: [...get().actionItems, newItem] });
  },
  removeActionItem: (id) => {
    set({
      actionItems: get().actionItems.filter((item) => item.id !== id)
    });
  },
  syncToServices: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ syncResult: getMockSyncResult() });
  },
  reset: () => {
    set({
      meeting: null,
      uploadedFile: null,
      uploadMethod: "transcript",
      processingSteps: [],
      isProcessing: false,
      summary: null,
      actionItems: [],
      transcript: [],
      syncResult: null
    });
  }
}));
export {
  useMeetingStore
};
