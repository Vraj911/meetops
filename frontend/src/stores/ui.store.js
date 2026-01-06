import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";
const useUIStore = create()(
  persist(
    (set, get) => ({
      theme: "dark",
      aiPanelOpen: false,
      inviteModalOpen: false,
      setTheme: (theme) => {
        set({ theme });
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
          favicon.href = theme === "dark" ? "/logo_light.jpeg" : "/logo_dark.jpeg";
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        get().setTheme(newTheme);
      },
      setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
      toggleAiPanel: () => set({ aiPanelOpen: !get().aiPanelOpen }),
      setInviteModalOpen: (open) => set({ inviteModalOpen: open })
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon && state?.theme) {
          favicon.href = state.theme === "dark" ? "/logo_light.jpeg" : "/logo_dark.jpeg";
        }
      }
    }
  )
);
export {
  useUIStore
};
