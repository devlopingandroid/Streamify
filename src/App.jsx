import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import { initializeTheme } from "./store/uiSlice";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./styles/index.css";

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize user theme configurations
    dispatch(initializeTheme());
    
    // Simulate check-auth initialization for the foundation phase
    const timer = setTimeout(() => {
      dispatch(setUser(null)); // Sets user to null and isLoading to false
    }, 400);

    return () => clearTimeout(timer);
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
