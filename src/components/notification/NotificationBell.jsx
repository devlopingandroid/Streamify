import React, { useState } from "react";
import { Bell } from "lucide-react";
import { NotificationBadge } from "./NotificationBadge";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={toggleDropdown}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 hover:border-slate-700/60 transition-all duration-200 cursor-pointer ${
          dropdownOpen ? "bg-slate-800 border-slate-700 text-slate-100" : ""
        }`}
        aria-label="View notifications"
      >
        <Bell size={18} />
        <NotificationBadge className="absolute -top-0.5 -right-0.5 border-2 border-slate-950" />
      </button>

      <NotificationDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
    </div>
  );
};
export default NotificationBell;
