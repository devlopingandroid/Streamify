import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "./hooks/useAuth";
import { initializeTheme } from "./store/uiSlice";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./styles/index.css";

export const App = () => {
  const dispatch = useDispatch();

  // Execute startup cookies check validation via TanStack Query hook
  useCurrentUser();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: "glassmorphism border border-slate-800 text-slate-100 text-xs rounded-lg p-4 shadow-2xl",
          style: {
            background: "var(--color-dark-card)",
            color: "var(--color-slate-100)",
          },
        }}
      />
    </>
  );
};
export default App;
