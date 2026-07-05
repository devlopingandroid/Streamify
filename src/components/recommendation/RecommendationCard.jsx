import React from "react";
import { Link } from "react-router-dom";
import { VideoThumbnail } from "../video/VideoThumbnail";
import { VideoMeta } from "../video/VideoMeta";
import { Avatar } from "../ui/Avatar";
import { Bookmark } from "lucide-react";
import { useWatchLater } from "../../hooks/useUserFeatures";

/**
 * A card component that displays video recommendation item.
 * Designed using dark theme and glassmorphism styling tokens copied from:
 * - src/components/video/VideoCard.jsx (for hover transitions, border/bg tokens)
 * - src/styles/index.css (for .glassmorphism styling context)
 */
export const RecommendationCard = ({ video, layout = "grid" }) => {
  const isList = layout === "list";

  const { 
    data: watchLaterVideos, 
    toggleWatchLater, 
    isToggling: isWatchLaterToggling, 
    togglingVideoId 
  } = useWatchLater();

  if (!video) return null;

  const isWatchLater = watchLaterVideos?.some((v) => (v._id || v) === video._id);
  const isWatchLaterPending = isWatchLaterToggling && (togglingVideoId === video._id);

  return (
    <div 
      className={`flex rounded-xl border border-slate-800/30 bg-slate-900/10 hover:bg-slate-900/40 hover:border-brand-cyan/30 hover:shadow-[0_4px_25px_rgba(6,182,212,0.06)] hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden relative ${
        isList ? "flex-col sm:flex-row gap-4 p-3" : "flex-col gap-2"
      }`}
    >
      {/* Watch Later Bookmark button */}
      <div className={`absolute top-2 right-2 z-20 transition-opacity duration-150 ${
        isWatchLater ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatchLater({ videoId: video._id, video });
          }}
          disabled={isWatchLaterPending}
          className="w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-900/95 border border-slate-800/50 flex items-center justify-center text-slate-350 hover:text-brand-cyan transition-all shadow cursor-pointer focus:outline-none disabled:opacity-50"
          aria-label="Toggle Watch Later"
          title={isWatchLater ? "Remove from Watch Later" : "Watch Later"}
        >
          {isWatchLaterPending ? (
            <span className="w-3 h-3 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
          ) : (
            <Bookmark size={12} className={isWatchLater ? "fill-current text-cyan-400" : ""} />
          )}
        </button>
      </div>

      {/* Thumbnail Trigger */}
      <Link 
        to={`/watch/${video._id}`}
        className={`block w-full ${isList ? "sm:w-[240px] flex-shrink-0" : ""}`}
        aria-label={`Play video: ${video.title}`}
      >
        <VideoThumbnail 
          src={video.thumbnail} 
          alt={video.title} 
          duration={video.duration} 
        />
      </Link>

      {/* Detail Metadata Box */}
      <div className={`flex gap-3 p-3 ${isList ? "sm:p-0 flex-grow" : ""}`}>
        {!isList && (
          <div className="flex-shrink-0">
            <Avatar src={video.owner?.avatar} name={video.owner?.fullname || "User"} size="sm" />
          </div>
        )}

        <div className="flex flex-col gap-1 flex-grow min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-xs font-semibold text-slate-100 hover:text-brand-cyan transition-colors leading-relaxed line-clamp-2">
              {video.title}
            </h3>
          </Link>

          <span className="text-[10px] text-slate-400 select-none">
            {video.owner?.fullname || "User"}
          </span>

          <VideoMeta views={video.views} createdAt={video.createdAt} />
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
