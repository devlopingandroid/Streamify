import React from "react";
import { Link } from "react-router-dom";
import { VideoThumbnail } from "./VideoThumbnail";
import { VideoMeta } from "./VideoMeta";
import { Avatar } from "../ui/Avatar";
import { truncateText } from "../../utils";

export const VideoCard = ({ video, layout = "grid" }) => {
  const isList = layout === "list";

  return (
    <div 
      className={`flex rounded-xl border border-slate-800/40 bg-slate-900/10 hover:border-slate-800 transition-all group overflow-hidden ${
        isList ? "flex-col sm:flex-row gap-4 p-3" : "flex-col gap-2"
      }`}
    >
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
          <Link to={`/landing`} className="flex-shrink-0">
            <Avatar src={video.owner.avatar} name={video.owner.fullname} size="sm" />
          </Link>
        )}

        <div className="flex flex-col gap-1 flex-grow min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-xs font-semibold text-slate-100 hover:text-brand-cyan transition-colors leading-relaxed line-clamp-2">
              {video.title}
            </h3>
          </Link>

          <span className="text-[10px] text-slate-400 select-none">
            {video.owner.fullname}
          </span>

          <VideoMeta views={video.views} createdAt={video.createdAt} />

          {isList && (
            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mt-2 hidden sm:block select-none">
              {truncateText(video.description, 160)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default VideoCard;
