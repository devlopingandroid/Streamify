import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { PageLoader } from "../components/ui/PageLoader";

/**
 * ProtectedRoute Guard placeholder.
 * Protects authenticated layout endpoints.
 */
export const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <PageLoader message="Verifying session credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

/**
 * PublicRoute Guard placeholder.
 * Restricts access to public-only views (e.g. login/register pages) for authenticated users.
 */
export const PublicRoute = ({ redirectPath = "/" }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <PageLoader message="Loading secure portal..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
