import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("callyX-theme") || "helloween",
  setTheme: (theme) => {
    localStorage.setItem("callyX-theme", theme);
    set({ theme });
  },
}));
