function getMockUser() {
  return {
    id: "usr_001",
    email: "john@company.com",
    name: "John Doe",
    role: "owner",
    lastActive: "2h ago"
  };
}
function getMockInviteData() {
  return {
    workspaceName: "Acme Engineering",
    invitedBy: "John Doe",
    invitedByEmail: "john@company.com",
    email: "user@company.com",
    role: "member",
    token: "abc123"
  };
}
function getMockWorkspace() {
  return {
    id: "ws_001",
    name: "Acme Engineering",
    owner: "John Doe",
    ownerEmail: "john@company.com",
    createdAt: "Jan 15, 2024",
    domain: "acme-engineering.meetops.app",
    plan: "enterprise"
  };
}
function getMockWorkspaceStats() {
  return {
    meetingsProcessed: 24,
    actionItemsCreated: 142,
    syncSuccessRate: 98
  };
}
function getMockTeamMembers() {
  return [
    {
      id: "usr_001",
      email: "john@company.com",
      name: "John Doe",
      role: "owner",
      lastActive: "2h ago",
      joinedAt: "Jan 15, 2024"
    },
    {
      id: "usr_002",
      email: "alice@company.com",
      name: "Alice Chen",
      role: "member",
      lastActive: "1d ago",
      joinedAt: "Jan 20, 2024"
    },
    {
      id: "usr_003",
      email: "bob@company.com",
      name: "Bob Smith",
      role: "member",
      lastActive: "3d ago",
      joinedAt: "Feb 1, 2024"
    },
    {
      id: "usr_004",
      email: "carol@company.com",
      name: "Carol Williams",
      role: "admin",
      lastActive: "5h ago",
      joinedAt: "Feb 10, 2024"
    },
    {
      id: "usr_005",
      email: "david@company.com",
      name: "David Lee",
      role: "member",
      lastActive: "1w ago",
      joinedAt: "Feb 15, 2024"
    },
    {
      id: "usr_006",
      email: "eva@company.com",
      name: "Eva Martinez",
      role: "member",
      lastActive: "2d ago",
      joinedAt: "Mar 1, 2024"
    }
  ];
}
function getMockPendingInvites() {
  return [
    {
      id: "inv_001",
      email: "user2@company.com",
      role: "member",
      invitedAt: "2d ago",
      status: "pending"
    },
    {
      id: "inv_002",
      email: "user3@company.com",
      role: "member",
      invitedAt: "1d ago",
      status: "pending"
    }
  ];
}
function getMockJiraIntegration() {
  return {
    status: "connected",
    instanceUrl: "company.atlassian.net",
    project: "ENG (Engineering)",
    issueType: "Task (default)",
    lastSync: "2 hours ago",
    issuesCreated: 12
  };
}
function getMockCalendarIntegration() {
  return {
    status: "not_connected",
    defaultCalendar: "Team Calendar",
    eventType: "Follow-up Meeting",
    bufferTime: "15 minutes before"
  };
}
function getMockApiAccess() {
  return {
    status: "available",
    webhooksEnabled: true,
    rateLimit: "100 requests/hour"
  };
}
function getMockMeeting() {
  return {
    id: "mtg_001",
    title: "Q4 Planning - Engineering",
    date: "March 15, 2024",
    time: "2:30 PM",
    duration: "45m",
    participants: [
      "alice@company.com",
      "bob@company.com",
      "carol@company.com",
      "david@company.com",
      "john@company.com"
    ]
  };
}
function getMockTranscript() {
  return [
    {
      timestamp: "14:32",
      speaker: "Alice",
      text: "We need to update our API documentation before the release.",
      confidence: 0.95
    },
    {
      timestamp: "14:33",
      speaker: "Bob",
      text: "I can take that. I'll aim to have it done by next Friday.",
      confidence: 0.92
    },
    {
      timestamp: "14:35",
      speaker: "Alice",
      text: "Great. Let's also discuss the mobile MVP scope.",
      confidence: 0.88
    },
    {
      timestamp: "14:36",
      speaker: "Carol",
      text: "I think we should prioritize the core features first.",
      confidence: 0.91
    },
    {
      timestamp: "14:38",
      speaker: "David",
      text: "There's also the login bug that needs attention. It's blocking QA.",
      confidence: 0.78
    },
    {
      timestamp: "14:40",
      speaker: "John",
      text: "We should consider the API v2 timeline as well.",
      confidence: 0.85
    },
    {
      timestamp: "14:42",
      speaker: "Alice",
      text: "Let's set a deadline for the mobile review. How about March 29?",
      confidence: 0.94
    },
    {
      timestamp: "14:45",
      speaker: "Bob",
      text: "Maybe we should prioritize the login bug fix today.",
      confidence: 0.72
    }
  ];
}
function getMockSummary() {
  return {
    keyThemes: [
      "Mobile app development priorities",
      "API documentation updates",
      "Q4 release timeline"
    ],
    decisions: [
      {
        id: "dec_001",
        text: "Mobile MVP scope finalized",
        confidence: 0.92,
        timestamp: "14:35"
      },
      {
        id: "dec_002",
        text: "Prioritize API updates",
        confidence: 0.85,
        timestamp: "14:32"
      },
      {
        id: "dec_003",
        text: "API v2 deadline: March 29",
        confidence: 0.67,
        timestamp: "14:40"
      }
    ],
    risks: ["Timeline is tight for mobile release", "Login bug may delay QA"],
    overallConfidence: 82
  };
}
function getMockActionItems() {
  return [
    {
      id: "ai_001",
      title: "Update API docs",
      owner: "bob@company.com",
      priority: "medium",
      dueDate: "Mar 22",
      confidence: 0.85,
      source: "Alice mentioned at 14:32"
    },
    {
      id: "ai_002",
      title: "Mobile MVP scope",
      owner: "alice@company.com",
      priority: "high",
      dueDate: "Mar 29",
      confidence: 0.67,
      source: "Discussion at 14:35"
    },
    {
      id: "ai_003",
      title: "Fix login bug",
      owner: "john@company.com",
      priority: "critical",
      dueDate: "Today",
      confidence: 0.78,
      source: "David mentioned at 14:38 - Low Confidence"
    },
    {
      id: "ai_004",
      title: "Review mobile timeline",
      owner: "carol@company.com",
      priority: "high",
      dueDate: "Mar 25",
      confidence: 0.91,
      source: "Team consensus at 14:42"
    },
    {
      id: "ai_005",
      title: "Prepare QA environment",
      owner: "david@company.com",
      priority: "medium",
      dueDate: "Mar 20",
      confidence: 0.88,
      source: "Follow-up to login bug discussion"
    },
    {
      id: "ai_006",
      title: "API v2 architecture review",
      owner: "john@company.com",
      priority: "medium",
      dueDate: "Mar 27",
      confidence: 0.72,
      source: "Mentioned at 14:40"
    }
  ];
}
function getMockProcessingSteps() {
  return [
    {
      id: "step_001",
      name: "Transcribing",
      status: "complete",
      progress: 100,
      description: "Converting audio to text..."
    },
    {
      id: "step_002",
      name: "Summarizing",
      status: "processing",
      progress: 80,
      description: "Extracting key themes from conversation..."
    },
    {
      id: "step_003",
      name: "Extracting Decisions",
      status: "pending",
      progress: 0,
      description: "Identifying clear decisions made..."
    },
    {
      id: "step_004",
      name: "Action Items",
      status: "pending",
      progress: 0,
      description: "Parsing action items from discussion..."
    },
    {
      id: "step_005",
      name: "Analyzing Urgency",
      status: "pending",
      progress: 0,
      description: "Will analyze priority & deadlines"
    }
  ];
}
function getMockSyncResult() {
  return {
    success: true,
    actionItemsCreated: 6,
    teamMembersAssigned: 3,
    calendarEventsCreated: 1,
    syncDuration: "8.2 seconds",
    jiraTickets: [
      {
        id: "jira_001",
        key: "ENG-123",
        title: "Update API documentation",
        status: "To Do",
        assignee: "Bob Smith",
        url: "#"
      },
      {
        id: "jira_002",
        key: "ENG-124",
        title: "Define mobile MVP scope",
        status: "To Do",
        assignee: "Alice Chen",
        url: "#"
      }
    ],
    calendarEvents: [
      {
        id: "cal_001",
        title: "Follow-up: Mobile Review",
        date: "March 29",
        time: "2:00 PM",
        duration: "30 minutes",
        url: "#"
      }
    ],
    itemsRequiringAttention: [
      {
        title: "Fix login bug",
        reason: "No JIRA project access"
      }
    ]
  };
}
function getMockAiPrompts() {
  return [
    {
      id: "prompt_001",
      icon: "\u{1F50D}",
      label: "Find missing action items",
      description: "Scan transcript for overlooked tasks"
    },
    {
      id: "prompt_002",
      icon: "\u{1F4CA}",
      label: "Adjust priority based on urgency",
      description: "Reorder items by deadline and impact"
    },
    {
      id: "prompt_003",
      icon: "\u270F\uFE0F",
      label: "Clarify ambiguous items",
      description: "Make vague action items more specific"
    },
    {
      id: "prompt_004",
      icon: "\u{1F517}",
      label: "Merge similar items",
      description: "Combine duplicate or related tasks"
    },
    {
      id: "prompt_005",
      icon: "\u23F1\uFE0F",
      label: "Estimate effort for each",
      description: "Add time estimates to action items"
    },
    {
      id: "prompt_006",
      icon: "\u{1F4C5}",
      label: "Suggest due dates",
      description: "Propose deadlines based on context"
    }
  ];
}
function getMockAiRefinementResult() {
  return {
    changes: "+2 items, -1 merge",
    confidenceImpact: "+12%",
    explanation: "Found 2 additional action items from the discussion. Merged duplicate API documentation tasks."
  };
}
function getMockDocsContent() {
  return {
    sections: [
      { id: "problem", title: "The Problem" },
      { id: "workflow", title: "How MeetOps Works" },
      { id: "ai-role", title: "AI's Role" },
      { id: "design", title: "Design Principles" },
      { id: "integrations", title: "Integrations" },
      { id: "api", title: "API" }
    ]
  };
}
export {
  getMockActionItems,
  getMockAiPrompts,
  getMockAiRefinementResult,
  getMockApiAccess,
  getMockCalendarIntegration,
  getMockDocsContent,
  getMockInviteData,
  getMockJiraIntegration,
  getMockMeeting,
  getMockPendingInvites,
  getMockProcessingSteps,
  getMockSummary,
  getMockSyncResult,
  getMockTeamMembers,
  getMockTranscript,
  getMockUser,
  getMockWorkspace,
  getMockWorkspaceStats
};
