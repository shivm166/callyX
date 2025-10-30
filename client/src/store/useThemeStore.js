import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("callyX-theme") || "winter",
  setTheme: (theme) => {
    localStorage.setItem("callyX-theme", theme);
    set({ theme });
  },
}));
