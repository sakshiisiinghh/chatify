import { create } from "zustand";

function getInitialTheme() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chat-theme") || "cupcake";
  }
  return "cupcake";
}

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    // Apply DaisyUI theme at the document root for immediate effect
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
}));