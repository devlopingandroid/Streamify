import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./RouteGuards";
import { PageLoader } from "../components/ui/PageLoader";

// Placeholder Views for the Foundation phase (No business layouts or logic)
const MockHome = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center select-none">
    <h2 className="text-xl font-bold text-slate-100 mb-2">Streamify Foundation Dashboard</h2>
    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
      Welcome to the authenticated area. The media streaming modules will be mounted here in subsequent phases.
    </p>
  </div>
);

const MockLogin = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center select-none">
    <h2 className="text-xl font-bold text-slate-100 mb-2">Authentication Gateway</h2>
    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
      Sign-in forms and credentials verification will be wired here in the auth module phase.
    </p>
  </div>
);

const MockRegister = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center select-none">
    <h2 className="text-xl font-bold text-slate-100 mb-2">Create Account</h2>
    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
      Profile creations and banner upload controls will be configured here.
    </p>
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader message="Loading page assets..." />}>
        <Routes>
          {/* Public Views */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<MockLogin />} />
            <Route path="/register" element={<MockRegister />} />
          </Route>

          {/* Secure Layout Portal */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MockHome />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default AppRoutes;
