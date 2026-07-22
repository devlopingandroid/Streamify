import React from "react";
import { Link } from "react-router-dom";
import { VideoThumbnail } from "../video/VideoThumbnail";
import { VideoMeta } from "../video/VideoMeta";
import { Avatar } from "../ui/Avatar";
import { Bookmark } from "lucide-react";
import { useWatchLater } from "../../hooks/useUserFeatures";

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
      className={`flex rounded-xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 group overflow-hidden relative ${
        isList ? "flex-col sm:flex-row gap-6 p-5" : "flex-col gap-3.5 p-5"
      }`}
    >
      {/* Watch Later Bookmark button */}
      <div className={`absolute top-7 right-7 z-20 transition-opacity duration-150 ${
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
          className="w-7 h-7 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#334155] hover:text-[#0F172A] transition-all shadow-sm cursor-pointer focus:outline-none disabled:opacity-50"
          aria-label="Toggle Watch Later"
          title={isWatchLater ? "Remove from Watch Later" : "Watch Later"}
        >
          {isWatchLaterPending ? (
            <span className="w-3 h-3 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Bookmark size={12} className={isWatchLater ? "fill-current text-[#0F172A]" : ""} />
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
      <div className={`flex gap-3 ${isList ? "sm:p-0 flex-grow" : "flex-grow px-1 py-0.5"}`}>
        {!isList && (
          <div className="flex-shrink-0">
            <Avatar src={video.owner?.avatar} name={video.owner?.fullname || "User"} size="sm" />
          </div>
        )}

        <div className="flex flex-col gap-1 flex-grow min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-xs font-semibold text-[#0F172A] hover:text-[#334155] transition-colors leading-relaxed line-clamp-2">
              {video.title}
            </h3>
          </Link>

          <span className="text-[10px] text-[#64748B] font-medium select-none">
            {video.owner?.fullname || "User"}
          </span>

          <VideoMeta views={video.views} createdAt={video.createdAt} />
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
