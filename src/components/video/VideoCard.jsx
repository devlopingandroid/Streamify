import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MoreVertical, Bookmark, Loader2 } from "lucide-react";
import { VideoThumbnail } from "./VideoThumbnail";
import { VideoMeta } from "./VideoMeta";
import { Avatar } from "../ui/Avatar";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { useDeleteVideo } from "../../hooks/useDeleteVideo";
import { useToggleVideoStatus } from "../../hooks/useToggleVideoStatus";
import { useWatchLater } from "../../hooks/useUserFeatures";
import { truncateText } from "../../utils";

export const VideoCard = ({ video, layout = "grid" }) => {
  const isList = layout === "list";
  const { user } = useSelector((state) => state.auth);

  // Ownership check
  const ownerId = video.owner?._id || video.owner;
  const isOwner = user && ownerId && user._id === ownerId;

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const { 
    data: watchLaterVideos, 
    toggleWatchLater, 
    isToggling: isWatchLaterToggling, 
    togglingVideoId 
  } = useWatchLater();
  const isWatchLater = watchLaterVideos?.some((v) => (v._id || v) === video._id);
  const isWatchLaterPending = isWatchLaterToggling && (togglingVideoId === video._id);

  const deleteMutation = useDeleteVideo();
  const toggleStatusMutation = useToggleVideoStatus();

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(video._id, {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
      },
    });
  };

  return (
    <div 
      className={`flex rounded-xl border border-slate-800/30 bg-slate-900/10 hover:bg-slate-900/40 hover:border-brand-cyan/30 hover:shadow-[0_4px_25px_rgba(6,182,212,0.06)] hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden relative ${
        isList ? "flex-col sm:flex-row gap-4 p-3" : "flex-col gap-2"
      }`}
    >
      {/* Management Actions (Only for owners) */}
      {isOwner && (
        <div className="absolute top-2 right-2 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-7 h-7 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-slate-100 transition-colors shadow cursor-pointer focus:outline-none"
            aria-label="Manage video"
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <>
              {/* Overlay background to close the menu on clicking outside */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(false);
                }} 
              />
              <div 
                className="absolute right-0 mt-1 w-32 rounded-lg border border-slate-800 bg-slate-900/90 backdrop-blur-md p-1 shadow-2xl z-40 animate-fade-in flex flex-col gap-0.5"
                onClick={(e) => e.stopPropagation()} // Prevent card navigation
              >
                <Link
                  to={`/edit-video/${video._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 transition-colors block"
                >
                  Edit Video
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setIsPlaylistModalOpen(true);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 transition-colors block cursor-pointer"
                >
                  Save to Playlist
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    toggleStatusMutation.mutate(video._id);
                  }}
                  disabled={toggleStatusMutation.isPending}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {video.isPublished ? "Make Private" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setConfirmDeleteOpen(true);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Delete Video
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {!isOwner && (
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
              <Loader2 size={12} className="animate-spin text-cyan-400" />
            ) : (
              <Bookmark size={12} className={isWatchLater ? "fill-current text-cyan-400" : ""} />
            )}
          </button>
        </div>
      )}

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
            <Avatar src={video.owner?.avatar} name={video.owner?.fullname || "User"} size="sm" />
          </Link>
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

          {isList && (
            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mt-2 hidden sm:block select-none">
              {truncateText(video.description, 160)}
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete this video?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger={true}
        isLoading={deleteMutation.isPending}
      />

      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        videoId={video._id}
      />
    </div>
  );
};
export default VideoCard;

