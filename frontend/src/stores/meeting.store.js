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
    const state = get();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Build payload from review page
    const summaryText = [
      `Key Themes: ${state.summary?.keyThemes?.join(', ') || ''}`,
      `Decisions: ${(state.summary?.decisions || []).map(d => d.text).join(' | ')}`,
      `Overall Confidence: ${state.summary?.overallConfidence ?? ''}%`
    ].join('\n');

    const actionItemsPayload = (state.actionItems || []).map(item => ({
      title: item.title,
      ownerHint: item.owner,
      confidence: item.confidence,
      priority: item.priority,
      dueDate: item.dueDate,
      description: `Priority: ${item.priority}; Due: ${item.dueDate}; Source: ${item.source || ''}`,
    }));

    const meetingId = state.meeting?.id || 'payload';

    try {
      // Sync to Jira
      const jiraRes = await fetch(`${baseUrl}/api/sync/${encodeURIComponent(meetingId)}/jira`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          force: true,
          summary: summaryText,
          actionItems: actionItemsPayload,
        })
      });
      const jiraContentType = jiraRes.headers.get('content-type') || '';
      if (!jiraContentType.includes('application/json')) {
        const text = await jiraRes.text();
        throw new Error(`Jira sync failed (non-JSON): ${text.slice(0, 120)}...`);
      }
      const jiraData = await jiraRes.json();
      if (!jiraRes.ok || !jiraData.success) {
        throw new Error(jiraData.error || 'Jira sync failed');
      }

      const createdIssues = jiraData.data?.createdIssues || [];

      // Sync to Calendar
      const calendarRes = await fetch(`${baseUrl}/api/sync/${encodeURIComponent(meetingId)}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          force: true,
          actionItems: actionItemsPayload,
        })
      });
      const calendarContentType = calendarRes.headers.get('content-type') || '';
      if (!calendarContentType.includes('application/json')) {
        const text = await calendarRes.text();
        throw new Error(`Calendar sync failed (non-JSON): ${text.slice(0, 120)}...`);
      }
      const calendarData = await calendarRes.json();
      if (!calendarRes.ok || !calendarData.success) {
        throw new Error(calendarData.error || 'Calendar sync failed');
      }

      const calendarResults = calendarData.data || {};
      const createdEvents = calendarResults.succeeded || 0;
      const eventResults = Array.isArray(calendarResults.results)
        ? calendarResults.results.filter((r) => r.success)
        : [];
      const failedEvents = Array.isArray(calendarResults.errors)
        ? calendarResults.errors
        : [];

      set({
        syncResult: {
          success: true,
          actionItemsCreated: createdIssues.length,
          teamMembersAssigned: 0,
          calendarEventsCreated: createdEvents,
          syncDuration: '—',
          jiraTickets: createdIssues.map((ci, idx) => ({
            id: `jira_${idx + 1}`,
            key: ci.issueKey,
            title: ci.actionItemTitle,
            status: 'To Do',
            assignee: '',
            url: `${import.meta.env.VITE_JIRA_HOST || ''}/browse/${ci.issueKey}`
          })),
          calendarEvents: eventResults.map((event, idx) => ({
            id: `cal_${idx + 1}`,
            title: event.actionItem,
            date: event.eventStart || '',
            url: event.eventLink,
          })),
          itemsRequiringAttention: failedEvents.map((err, idx) => ({
            title: `Calendar event failed (${err.actionItem || idx + 1})`,
            reason: err.error || 'Unknown calendar error'
          })),
        }
      });
    } catch (err) {
      console.error('Sync error:', err);
      set({
        syncResult: {
          success: false,
          actionItemsCreated: 0,
          teamMembersAssigned: 0,
          calendarEventsCreated: 0,
          syncDuration: '—',
          jiraTickets: [],
          calendarEvents: [],
          itemsRequiringAttention: [
            { title: 'Sync failed', reason: err.message }
          ],
        }
      });
    }
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
