import React from "react";
import { Link } from "react-router-dom";
import { AppLogo } from "../components/ui/AppLogo";
import { RegisterForm } from "../components/auth/RegisterForm";

export const RegisterPage = () => {
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

      <main className="flex-grow flex items-center justify-center p-4 z-10 my-4">
        <div className="w-full max-w-[500px] rounded-2xl glassmorphism p-8 shadow-2xl animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-1 tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-400">Join our enterprise video CDN network</p>
          </div>
          
          <RegisterForm />

          <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800/60 select-none">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-cyan hover:underline font-semibold">
              Sign In Here
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
export default RegisterPage;
