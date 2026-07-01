import React from "react";
import { Link } from "react-router-dom";
import { AppLogo } from "../components/ui/AppLogo";
import { Button } from "../components/ui/Button";
import { Shield, Zap, LayoutGrid, MonitorPlay } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-base justify-between relative overflow-hidden text-slate-100">
      {/* Background radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-radial from-brand-cyan/10 to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-radial from-brand-indigo/10 to-transparent pointer-events-none z-0" />

      {/* Header bar */}
      <header className="flex justify-between items-center py-6 px-6 md:px-12 z-10 border-b border-slate-800/40 bg-dark-base/40 backdrop-blur-md sticky top-0">
        <AppLogo />
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="solid" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Body section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 z-10 text-center max-w-[900px] mx-auto mt-10 md:mt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 text-xs text-brand-cyan mb-6 animate-fade-in font-medium select-none">
          <Zap size={12} />
          <span>Streamify SaaS CDN v1.0 Launch</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in select-none">
          Enterprise Media Streaming <br />
          <span className="gradient-text">Engineered for Teams</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed mb-8 select-none">
          Deploy premium quality media assets across distributed CDNs with zero latency. Secure, accessible, and fast.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/register">
            <Button variant="solid" size="lg">Create Free Account</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Portal Dashboard</Button>
          </Link>
        </div>

        {/* Feature grids */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left border-t border-slate-800/80 pt-16">
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-2">
              <MonitorPlay size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Custom Playback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native HTML5 media player featuring volume controls, progressive buffer seek, and custom shortcuts.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-2">
              <Shield size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">HttpOnly Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Token refresh rotation maps and httpOnly secure cookies shield user sessions.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-2">
              <LayoutGrid size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Responsive Grids</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Redesigned layouts optimized dynamically across breakpoints (mobile to desktop).
            </p>
          </div>
        </section>
      </main>

      {/* Footer tab */}
      <footer className="text-center py-8 border-t border-slate-800/40 text-2xs text-slate-500 z-10 select-none">
        <p>&copy; {new Date().getFullYear()} Streamify Inc. Enterprise Media CDN System.</p>
      </footer>
    </div>
  );
};
export default LandingPage;
