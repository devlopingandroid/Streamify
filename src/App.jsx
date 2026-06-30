import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";
import { initializeTheme } from "./store/uiSlice";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from "./components/ui/ToastContainer";
import { apiClient } from "./services/apiClient";
import "./styles/index.css";

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize user theme configurations
    dispatch(initializeTheme());
    
    // Check initial authentication cookies
    const checkAuth = async () => {
      try {
        const response = await apiClient.get("/users/current-user");
        dispatch(setUser(response.data?.data || null));
      } catch (error) {
        dispatch(setUser(null));
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
};
export default App;
