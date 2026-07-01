import React from "react";
import { Link } from "react-router-dom";
import { AppLogo } from "../components/ui/AppLogo";
import { LoginForm } from "../components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-base justify-between relative overflow-hidden text-slate-100">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-radial from-brand-cyan/15 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-radial from-brand-indigo/15 to-transparent pointer-events-none z-0" />

      <header className="flex justify-center items-center py-8 px-4 z-10">
        <Link to="/landing">
          <AppLogo />
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-[440px] rounded-2xl glassmorphism p-8 shadow-2xl animate-fade-in text-center">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-1 tracking-tight">Sign In</h1>
            <p className="text-xs text-slate-400">Access your enterprise video catalog</p>
          </div>
          
          <LoginForm />

          <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800/60 select-none">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-cyan hover:underline font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-[10px] text-slate-500 z-10 select-none">
        <p>&copy; {new Date().getFullYear()} Streamify Inc. Enterprise Media CDN System.</p>
      </footer>
    </div>
  );
};
export default LoginPage;
