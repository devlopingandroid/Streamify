import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-base justify-between relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-radial from-brand-cyan/15 to-transparent pointer-events-none z-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-radial from-brand-indigo/15 to-transparent pointer-events-none z-1" />

      <header className="flex justify-center items-center py-8 px-4 z-10">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-widest text-slate-100">
          <span className="gradient-text">▲</span>
          <span>VIEWSTREAM</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-[440px] rounded-2xl glassmorphism p-8 shadow-2xl animate-fade-in">
          <Outlet />
        </div>
      </main>

      <footer className="text-center py-6 text-[10px] text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} ViewStream Inc. Enterprise Media CDN System.</p>
      </footer>
    </div>
  );
};
export default AuthLayout;
