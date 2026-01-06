import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { getMockUser } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, workspaceName?: string) => Promise<void>;
  logout: () => void;
  acceptInvite: (token: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const mockUser = getMockUser();
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      signup: async (email: string, _password: string, _workspaceName?: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockUser = getMockUser();
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      acceptInvite: async (_token: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const mockUser = getMockUser();
        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
