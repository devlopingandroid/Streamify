import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./RouteGuards";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";

// Lazy load route pages
const LoginForm = lazy(() => import("../features/auth/components/LoginForm").then(module => ({ default: module.LoginForm })));
const RegisterForm = lazy(() => import("../features/auth/components/RegisterForm").then(module => ({ default: module.RegisterForm })));
const HomeFeed = lazy(() => import("../features/videos/components/HomeFeed").then(module => ({ default: module.HomeFeed })));
const VideoDetail = lazy(() => import("../features/videos/components/VideoDetail").then(module => ({ default: module.VideoDetail })));
const ChannelProfile = lazy(() => import("../features/channel/components/ChannelProfile").then(module => ({ default: module.ChannelProfile })));
const HistoryList = lazy(() => import("../features/history/components/HistoryList").then(module => ({ default: module.HistoryList })));
const SettingsPage = lazy(() => import("../components/Settings").then(module => ({ default: module.SettingsPage })));
const StyleGuidePage = lazy(() => import("../components/StyleGuide").then(module => ({ default: module.StyleGuidePage })));

const FallbackLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh] w-full">
    <div className="w-9 h-9 border-2 border-slate-800 border-t-brand-cyan rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          {/* Public Views */}
          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>
          </Route>

          {/* Secure Layout Portal */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomeFeed />} />
              <Route path="/watch/:videoId" element={<VideoDetail />} />
              <Route path="/history" element={<HistoryList />} />
              <Route path="/c/:username" element={<ChannelProfile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/styleguide" element={<StyleGuidePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default AppRoutes;
