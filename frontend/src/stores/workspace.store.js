import { create } from "zustand";
import {
  getMockWorkspace,
  getMockTeamMembers,
  getMockPendingInvites,
  getMockWorkspaceStats
} from "@/lib/mockData";
const useWorkspaceStore = create()((set, get) => ({
  workspace: null,
  teamMembers: [],
  pendingInvites: [],
  stats: null,
  isLoading: false,
  loadWorkspace: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      workspace: getMockWorkspace(),
      teamMembers: getMockTeamMembers(),
      pendingInvites: getMockPendingInvites(),
      stats: getMockWorkspaceStats(),
      isLoading: false
    });
  },
  inviteMembers: async (emails, role, _message) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newInvites = emails.map((email, index) => ({
      id: `inv_new_${index}`,
      email,
      role,
      invitedAt: "Just now",
      status: "pending"
    }));
    set({
      pendingInvites: [...get().pendingInvites, ...newInvites]
    });
  },
  revokeInvite: (inviteId) => {
    set({
      pendingInvites: get().pendingInvites.filter((inv) => inv.id !== inviteId)
    });
  },
  resendInvite: async (inviteId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      pendingInvites: get().pendingInvites.map(
        (inv) => inv.id === inviteId ? { ...inv, invitedAt: "Just now" } : inv
      )
    });
  },
  removeMember: (memberId) => {
    set({
      teamMembers: get().teamMembers.filter((m) => m.id !== memberId)
    });
  }
}));
export {
  useWorkspaceStore
};
