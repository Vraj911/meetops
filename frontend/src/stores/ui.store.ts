import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface UIStore {
  theme: Theme;
  aiPanelOpen: boolean;
  inviteModalOpen: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAiPanelOpen: (open: boolean) => void;
  toggleAiPanel: () => void;
  setInviteModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      aiPanelOpen: false,
      inviteModalOpen: false,

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        // Update favicon based on theme
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = theme === 'dark' ? '/logo_light.jpeg' : '/logo_dark.jpeg';
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
      
      toggleAiPanel: () => set({ aiPanelOpen: !get().aiPanelOpen }),

      setInviteModalOpen: (open) => set({ inviteModalOpen: open }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        // Update favicon based on theme
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon && state?.theme) {
          favicon.href = state.theme === 'dark' ? '/logo_light.jpeg' : '/logo_dark.jpeg';
        }
      },
    }
  )
);
