import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getMockUser } from "@/lib/mockData";
import { STORAGE_KEYS } from "@/lib/constants";
const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email, _password) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser = getMockUser();
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
          isLoading: false
        });
      },
      signup: async (email, _password, _workspaceName) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const mockUser = getMockUser();
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
          isLoading: false
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },
      acceptInvite: async (_token) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUser = getMockUser();
        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
      }
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
export {
  useAuthStore
};
