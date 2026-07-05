import React from "react";
import { BellOff } from "lucide-react";

export const NotificationEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-3 select-none">
      <div className="w-12 h-12 rounded-full bg-slate-800/40 flex items-center justify-center text-slate-400">
        <BellOff size={20} />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-semibold text-slate-400">All caught up!</h4>
        <p className="text-[10px] leading-relaxed max-w-[200px]">
          You have no new alerts or subscription activities.
        </p>
      </div>
    </div>
  );
};
export default NotificationEmpty;
