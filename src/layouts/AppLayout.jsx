import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogout } from "../hooks/useAuth";
import { toggleSidebar } from "../store/uiSlice";
import { useDebounce } from "../hooks/useDebounce";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { NotificationBell } from "../components/notification/NotificationBell";
import { AppLogo } from "../components/ui/AppLogo";
import { Avatar } from "../components/ui/Avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Menu,
  Home,
  LogOut,
  Search,
  ChevronDown,
  X,
  User,
  Settings,
  Clock,
  Bookmark,
  ThumbsUp,
  UserCheck,
  PlaySquare,
  Upload,
  Flame
} from "lucide-react";

export const AppLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarExpanded } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        toast.success("Successfully logged out.");
        navigate("/landing");
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-base text-slate-100 relative">
      {/* Top Navbar */}
      <TopNavbar
        user={user}
        onToggleSidebar={() => dispatch(toggleSidebar())}
        onOpenMobile={() => setMobileOpen(true)}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onCloseDropdown={() => setDropdownOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <div className="flex flex-grow mt-16 relative">
        {/* Collapsible Sidebar for Desktop */}
        <DesktopSidebar sidebarExpanded={sidebarExpanded} />

        {/* Off-canvas mobile drawer with Framer Motion */}
        <AnimatePresence>
          {mobileOpen && (
            <MobileDrawer
              onClose={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          )}
        </AnimatePresence>

        {/* Content Panel */}
        <main
          className={`flex-grow min-h-[calc(100vh-64px)] transition-all duration-300 ${sidebarExpanded ? "pl-60 max-[1024px]:pl-20 max-[768px]:pl-0" : "pl-20 max-[768px]:pl-0"
            }`}
        >
          {/* Framer motion page transition wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// ==========================================
// Sub Component: TopNavbar
// ==========================================
const TopNavbar = ({
  user,
  onToggleSidebar,
  onOpenMobile,
  dropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onLogout,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 600);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      // API placeholder simulation for Task 8
      // console.log("Simulating search trigger: ", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <header className="flex h-16 items-center justify-between px-6 border-b border-slate-800/60 fixed top-0 left-0 right-0 z-[1000] bg-dark-base/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobile}
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Open navigation drawer"
        >
          <Menu size={20} />
        </button>

        {/* Desktop sidebar trigger */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle sidebar panel"
        >
          <Menu size={20} />
        </button>

        <Link to="/">
          <AppLogo showText={true} />
        </Link>
      </div>

      {/* Search Input (Task 8) */}
      <div className="hidden sm:flex items-center w-full max-w-[400px] bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1.5 focus-within:border-brand-cyan transition-all select-none">
        <Search size={16} className="text-slate-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search corporate stream library..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-transparent text-xs text-slate-100 w-full focus:outline-none placeholder-slate-500"
          aria-label="Search field input"
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="text-slate-500 hover:text-slate-300 cursor-pointer"
            aria-label="Clear search field"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Controls / Avatar dropdown */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <NotificationBell />

        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-800/40 transition-colors cursor-pointer"
            aria-label="User profile settings menu"
          >
            <Avatar src={user?.avatar} name={user?.fullname || "User"} size="sm" />
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-[99]" onClick={onCloseDropdown} />
              <div className="absolute right-0 top-[calc(100%+8px)] w-[220px] rounded-xl border border-slate-800/80 bg-slate-900 p-1.5 shadow-2xl z-[100] animate-fade-in">
                <div className="px-3 py-2 text-left">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.fullname}</p>
                  <p className="text-[10px] text-slate-500 truncate">@{user?.username}</p>
                </div>
                <hr className="border-slate-800 my-1" />

                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onCloseDropdown}
                >
                  <Home size={15} />
                  <span>My Dashboard</span>
                </Link>

                <Link
                  to={`/c/${user?.username}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onCloseDropdown}
                >
                  <User size={15} />
                  <span>My Channel</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onCloseDropdown}
                >
                  <Settings size={15} />
                  <span>Account Settings</span>
                </Link>

                <Link
                  to="/upload"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onCloseDropdown}
                >
                  <Upload size={15} />
                  <span>Upload Video</span>
                </Link>

                <hr className="border-slate-800 my-1" />
                <button
                  onClick={() => {
                    onCloseDropdown();
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// ==========================================
// Sub Component: DesktopSidebar
// ==========================================
const DesktopSidebar = ({ sidebarExpanded }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`border-r border-slate-800/60 bg-dark-base fixed top-16 bottom-0 left-0 z-[998] py-4 transition-all duration-300 flex flex-col justify-between ${sidebarExpanded ? "w-60" : "w-20 max-[768px]:-translate-x-full"
        }`}
    >
      <nav className="flex flex-col gap-1 px-3">
        <Link
          to="/"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Home Feed"
        >
          <Home size={20} className={`transition-transform duration-200 ${isActive("/") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Home Feed</span>}
        </Link>

        <Link
          to="/trending"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/trending")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Trending"
        >
          <Flame size={20} className={`transition-transform duration-200 ${isActive("/trending") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Trending</span>}
        </Link>

        <Link
          to="/feed/subscriptions"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/feed/subscriptions")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Subscriptions"
        >
          <UserCheck size={20} className={`transition-transform duration-200 ${isActive("/feed/subscriptions") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Subscriptions</span>}
        </Link>

        <Link
          to="/playlists"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/playlists")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Playlists"
        >
          <PlaySquare size={20} className={`transition-transform duration-200 ${isActive("/playlists") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Playlists</span>}
        </Link>

        <Link
          to="/history"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/history")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Watch History"
        >
          <Clock size={20} className={`transition-transform duration-200 ${isActive("/history") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">History</span>}
        </Link>

        <Link
          to="/watch-later"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/watch-later")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Watch Later"
        >
          <Bookmark size={20} className={`transition-transform duration-200 ${isActive("/watch-later") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Watch Later</span>}
        </Link>

        <Link
          to="/liked-videos"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/liked-videos")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Liked Videos"
        >
          <ThumbsUp size={20} className={`transition-transform duration-200 ${isActive("/liked-videos") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Liked Videos</span>}
        </Link>

        <Link
          to="/upload"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-95 h-12 group ${isActive("/upload")
            ? "bg-cyan-500/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan rounded-l-none"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          title="Upload Video"
        >
          <Upload size={20} className={`transition-transform duration-200 ${isActive("/upload") ? "scale-110 text-brand-cyan" : "group-hover:scale-110 group-hover:text-brand-cyan"}`} />
          {sidebarExpanded && <span className="text-xs">Upload Video</span>}
        </Link>
      </nav>

      {sidebarExpanded && (
        <div className="px-6 py-4 border-t border-slate-800/40 text-center select-none">
          <p className="text-[10px] text-slate-600">Streamify Corp &copy; {new Date().getFullYear()}</p>
        </div>
      )}
    </aside>
  );
};

// ==========================================
// Sub Component: MobileDrawer (Task 1)
// ==========================================
const MobileDrawer = ({ onClose, onLogout }) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[1998] bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Drawer Card */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        className="fixed top-0 bottom-0 left-0 w-[280px] bg-dark-base border-r border-slate-800 z-[1999] p-6 flex flex-col justify-between"
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <AppLogo />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 cursor-pointer"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Home size={20} />
              <span className="text-xs font-semibold">Home Feed</span>
            </Link>

            <Link
              to="/trending"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Flame size={20} />
              <span className="text-xs font-semibold">Trending</span>
            </Link>

            <Link
              to="/feed/subscriptions"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <UserCheck size={20} />
              <span className="text-xs font-semibold">Subscriptions</span>
            </Link>

            <Link
              to="/playlists"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <PlaySquare size={20} />
              <span className="text-xs font-semibold">Playlists</span>
            </Link>

            <Link
              to="/history"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Clock size={20} />
              <span className="text-xs font-semibold">History</span>
            </Link>

            <Link
              to="/watch-later"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Bookmark size={20} />
              <span className="text-xs font-semibold">Watch Later</span>
            </Link>

            <Link
              to="/liked-videos"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ThumbsUp size={20} />
              <span className="text-xs font-semibold">Liked Videos</span>
            </Link>

            <Link
              to="/upload"
              onClick={onClose}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Upload size={20} />
              <span className="text-xs font-semibold">Upload Video</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          <span className="text-xs font-semibold">Sign Out</span>
        </button>
      </motion.div>
    </>
  );
};
export default AppLayout;
