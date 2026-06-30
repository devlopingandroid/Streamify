import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
import { formatDuration, formatViews, formatTimeAgo } from "../../utils/formatters";

export const VideoCard = ({ video, layout = "grid" }) => {
  return (
    <div className={`flex overflow-hidden rounded-xl border border-slate-800 bg-dark-card glow-hover text-slate-100 w-full ${
      layout === "list" ? "flex-col sm:flex-row gap-4 p-3" : "flex-col gap-2"
    }`}>
      {/* Thumbnail */}
      <Link 
        to={`/watch/${video._id}`} 
        className={`relative aspect-video overflow-hidden bg-slate-800 w-full ${
          layout === "list" ? "sm:w-[240px] flex-shrink-0 rounded-lg" : ""
        }`}
      >
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]" 
          loading="lazy" 
        />
        <span className="absolute bottom-2 right-2 bg-slate-950/80 text-slate-100 text-[10px] px-1.5 py-0.5 rounded font-medium">
          {formatDuration(video.duration)}
        </span>
      </Link>

      {/* Info details */}
      <div className={`flex gap-3 p-3 ${layout === "list" ? "sm:p-0 flex-grow" : ""}`}>
        {layout === "grid" && (
          <Link to={`/c/${video.owner.username}`} className="flex-shrink-0">
            <Avatar src={video.owner.avatar} name={video.owner.fullname} size="sm" />
          </Link>
        )}

        <div className="flex flex-col gap-0.5 flex-grow min-w-0">
          <Link to={`/watch/${video._id}`} className="hover:text-brand-cyan transition-colors">
            <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-relaxed">
              {video.title}
            </h3>
          </Link>

          <Link to={`/c/${video.owner.username}`} className="text-[11px] text-slate-400 hover:text-slate-200 w-fit">
            {video.owner.fullname}
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>

          {layout === "list" && (
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed hidden sm:block">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default VideoCard;
