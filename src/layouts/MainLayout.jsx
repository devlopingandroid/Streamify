import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutLocal } from "../features/auth/authSlice";
import { toggleSidebar, setTheme } from "../store/uiSlice";
import { 
  Menu, 
  Home, 
  History, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Settings, 
  Search,
  Bell
} from "lucide-react";

export const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme, sidebarExpanded } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Listen to logout redirects from Axios client
  useEffect(() => {
    const handleLogoutRedirect = () => {
      dispatch(logoutLocal());
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth-logout-redirect", handleLogoutRedirect);
    return () => {
      window.removeEventListener("auth-logout-redirect", handleLogoutRedirect);
    };
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    try {
      const { logOutApi } = await import("../features/auth/services/authApi");
      await logOutApi();
    } catch (e) {
      console.warn("Server logout failed, clearing local session", e);
    } finally {
      dispatch(logoutLocal());
      navigate("/login", { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-base text-slate-100">
      {/* Top Navbar */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-slate-800 fixed top-0 left-0 right-0 z-[1000] bg-dark-base/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer" 
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle navigation drawer"
          >
            <Menu size={20} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wider text-slate-100">
            <span className="gradient-text">▲</span>
            <span className="hidden sm:inline">VIEWSTREAM</span>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden sm:flex w-full max-w-[500px] bg-slate-900 border border-slate-800 rounded-full overflow-hidden focus-within:border-brand-cyan focus-within:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
          <input 
            type="text" 
            placeholder="Search enterprise video catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 text-xs text-slate-100 bg-transparent focus:outline-none"
          />
          <button type="submit" className="px-5 text-slate-400 border-l border-slate-800 bg-slate-800/10 hover:bg-slate-800 hover:text-brand-cyan flex items-center justify-center cursor-pointer transition-colors" aria-label="Submit search">
            <Search size={16} />
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer" 
            onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer" aria-label="Notifications">
            <Bell size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700 hover:border-brand-cyan transition-colors flex items-center justify-center cursor-pointer" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User account details"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullname} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-brand-cyan to-brand-indigo text-slate-950 flex items-center justify-center font-bold">
                  {user?.fullname?.charAt(0).toUpperCase() || <User size={18} />}
                </div>
              )}
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-[999]" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+8px)] w-[240px] rounded-xl glassmorphism p-2 shadow-2xl z-[1000] animate-fade-in">
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-100">{user?.fullname}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">@{user?.username}</p>
                  </div>
                  <hr className="border-slate-800 my-1.5" />
                  
                  <Link 
                    to={`/c/${user?.username}`} 
                    className="flex items-center gap-3 p-2.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>My Channel</span>
                  </Link>

                  <Link 
                    to="/settings" 
                    className="flex items-center gap-3 p-2.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </Link>

                  <hr className="border-slate-800 my-1.5" />
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Workspace Wrapper */}
      <div className="flex mt-16 flex-grow relative">
        {/* Left Sidebar */}
        <aside className={`bg-dark-base border-r border-slate-800 fixed top-16 bottom-0 left-0 z-[998] flex flex-col justify-between py-4 transition-all duration-300 ${
          sidebarExpanded ? "w-60" : "w-18 md:w-18 max-[768px]:-translate-x-full"
        }`}>
          <nav className="flex flex-col gap-1 px-3">
            <Link 
              to="/" 
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors h-12 ${
                isActiveRoute("/") ? "bg-cyan-500/10 text-brand-cyan font-medium" : ""
              }`}
              title="Home Feed"
            >
              <Home size={20} />
              {sidebarExpanded && <span className="text-xs whitespace-nowrap">Home Feed</span>}
            </Link>

            <Link 
              to="/history" 
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors h-12 ${
                isActiveRoute("/history") ? "bg-cyan-500/10 text-brand-cyan font-medium" : ""
              }`}
              title="Watch History"
            >
              <History size={20} />
              {sidebarExpanded && <span className="text-xs whitespace-nowrap">Watch History</span>}
            </Link>

            <Link 
              to={`/c/${user?.username}`} 
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors h-12 ${
                isActiveRoute(`/c/${user?.username}`) ? "bg-cyan-500/10 text-brand-cyan font-medium" : ""
              }`}
              title="Channel Profile"
            >
              <User size={20} />
              {sidebarExpanded && <span className="text-xs whitespace-nowrap">My Channel</span>}
            </Link>

            <Link 
              to="/settings" 
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors h-12 ${
                isActiveRoute("/settings") ? "bg-cyan-500/10 text-brand-cyan font-medium" : ""
              }`}
              title="Settings"
            >
              <Settings size={20} />
              {sidebarExpanded && <span className="text-xs whitespace-nowrap">Settings</span>}
            </Link>
          </nav>

          {sidebarExpanded && (
            <div className="px-6 py-4 text-[10px] text-slate-500 border-t border-slate-800 text-center">
              <p>v1.0 Enterprise</p>
            </div>
          )}
        </aside>

        {/* Content Panel */}
        <main className={`flex-grow min-h-[calc(100vh-64px)] transition-all duration-300 ${
          sidebarExpanded ? "pl-60 max-[768px]:pl-0" : "pl-18 max-[768px]:pl-0"
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
