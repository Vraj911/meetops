import { create } from 'zustand';
import type { Workspace, TeamMember, PendingInvite, WorkspaceStats } from '@/types';
import {
  getMockWorkspace,
  getMockTeamMembers,
  getMockPendingInvites,
  getMockWorkspaceStats,
} from '@/lib/mockData';

interface WorkspaceStore {
  workspace: Workspace | null;
  teamMembers: TeamMember[];
  pendingInvites: PendingInvite[];
  stats: WorkspaceStats | null;
  isLoading: boolean;

  // Actions
  loadWorkspace: () => Promise<void>;
  inviteMembers: (emails: string[], role: 'member' | 'admin', message?: string) => Promise<void>;
  revokeInvite: (inviteId: string) => void;
  resendInvite: (inviteId: string) => Promise<void>;
  removeMember: (memberId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()((set, get) => ({
  workspace: null,
  teamMembers: [],
  pendingInvites: [],
  stats: null,
  isLoading: false,

  loadWorkspace: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set({
      workspace: getMockWorkspace(),
      teamMembers: getMockTeamMembers(),
      pendingInvites: getMockPendingInvites(),
      stats: getMockWorkspaceStats(),
      isLoading: false,
    });
  },

  inviteMembers: async (emails: string[], role: 'member' | 'admin', _message?: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newInvites: PendingInvite[] = emails.map((email, index) => ({
      id: `inv_new_${index}`,
      email,
      role,
      invitedAt: 'Just now',
      status: 'pending' as const,
    }));

    set({
      pendingInvites: [...get().pendingInvites, ...newInvites],
    });
  },

  revokeInvite: (inviteId: string) => {
    set({
      pendingInvites: get().pendingInvites.filter((inv) => inv.id !== inviteId),
    });
  },

  resendInvite: async (inviteId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set({
      pendingInvites: get().pendingInvites.map((inv) =>
        inv.id === inviteId ? { ...inv, invitedAt: 'Just now' } : inv
      ),
    });
  },

  removeMember: (memberId: string) => {
    set({
      teamMembers: get().teamMembers.filter((m) => m.id !== memberId),
    });
  },
}));
