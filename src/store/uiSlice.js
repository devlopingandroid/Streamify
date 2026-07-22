import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("streamify-theme") || "dark",
  sidebarExpanded: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSidebarExpanded: (state, action) => {
      state.sidebarExpanded = action.payload;
    },
    setTheme: (state, action) => {
      const theme = action.payload;
      state.theme = theme;
      localStorage.setItem("streamify-theme", theme);
      
      const root = window.document.documentElement;
      root.removeAttribute("data-theme");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.setAttribute("data-theme", systemTheme);
      } else {
        root.setAttribute("data-theme", theme);
      }
    },
    initializeTheme: (state) => {
      const root = window.document.documentElement;
      root.removeAttribute("data-theme");
      if (state.theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.setAttribute("data-theme", systemTheme);
      } else {
        root.setAttribute("data-theme", state.theme);
      }
    }
  },
});

export const { toggleSidebar, setSidebarExpanded, setTheme, initializeTheme } = uiSlice.actions;
export default uiSlice.reducer;
