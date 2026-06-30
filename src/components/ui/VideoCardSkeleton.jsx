import React from "react";

export const VideoCardSkeleton = ({ layout = "grid" }) => {
  return (
    <div className={`flex overflow-hidden rounded-xl border border-transparent bg-dark-card w-full animate-pulse ${
      layout === "list" ? "flex-col sm:flex-row gap-4 p-3" : "flex-col gap-2"
    }`}>
      {/* Thumbnail loader */}
      <div className={`aspect-video bg-slate-800 w-full ${
        layout === "list" ? "sm:w-[240px] flex-shrink-0 rounded-lg" : ""
      }`} />
      
      {/* Detail loader */}
      <div className={`flex gap-3 p-3 ${layout === "list" ? "sm:p-0 flex-grow" : ""}`}>
        {layout === "grid" && <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />}
        
        <div className="flex flex-col gap-2 flex-grow">
          <div className="h-3.5 bg-slate-800 rounded w-[85%]" />
          <div className="h-2.5 bg-slate-800 rounded w-[45%]" />
          <div className="h-2.5 bg-slate-800 rounded w-[60%]" />
        </div>
      </div>
    </div>
  );
};
export default VideoCardSkeleton;
