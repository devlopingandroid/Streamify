import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getVideoByIdApi, getSuggestedVideosApi } from "../services/mockVideoService";
import { showToast } from "../../../store/toastSlice";
import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { VideoCard } from "../../../components/ui/VideoCard";
import { VideoCardSkeleton } from "../../../components/ui/VideoCardSkeleton";
import { formatDuration, formatViews, formatTimeAgo } from "../../../utils/formatters";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  Share2 
} from "lucide-react";

export const VideoDetail = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Queries
  const { data: video, isLoading, error } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoByIdApi(videoId || ""),
    enabled: !!videoId,
  });

  const { data: suggested } = useQuery({
    queryKey: ["suggestedVideos", videoId],
    queryFn: () => getSuggestedVideosApi(videoId || ""),
    enabled: !!videoId,
  });

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.warn("Autoplay blocked", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleScrubChange = (e) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
    if (videoRef.current) {
      videoRef.current.volume = value;
      videoRef.current.muted = value === 0;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        dispatch(showToast("Failed to launch fullscreen view: " + err.message, "error"));
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Reset states
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="flex flex-col">
            <div className="w-full aspect-video bg-slate-900 rounded-xl animate-pulse" />
            <div className="mt-4 h-10 bg-slate-900 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <VideoCardSkeleton key={idx} layout="list" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center py-20 text-slate-400">
        <h2 className="text-xl font-bold text-slate-200 mb-2">Playback Error</h2>
        <p className="text-xs">The requested media stream could not be initialized. Please check that the URL parameters are correct.</p>
      </div>
    );
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="p-6 animate-fade-in max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Main column player */}
        <div className="flex flex-col">
          {/* Custom player */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group" ref={playerRef}>
            <video
              ref={videoRef}
              src={video.videoFile}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />

            {/* Custom Control Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              {/* Progress Scrubber */}
              <div className="relative w-full h-1 bg-white/20 rounded-full mb-4 flex items-center hover:h-1.5 transition-all">
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-cyan rounded-full" 
                  style={{ width: `${progressPercent}%` }} 
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleScrubChange}
                  className="absolute inset-x-0 -top-1.5 w-full h-4 opacity-0 cursor-pointer m-0"
                  aria-label="Seek time scrubber"
                />
              </div>

              {/* Action controls row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-slate-100 hover:text-brand-cyan transition-colors cursor-pointer" aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-slate-100 hover:text-brand-cyan transition-colors cursor-pointer" aria-label={isMuted ? "Unmute" : "Mute"}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-[60px] h-1 cursor-pointer accent-brand-cyan"
                      aria-label="Volume slider"
                    />
                  </div>

                  <span className="text-[10px] text-slate-300 font-medium select-none">
                    {formatDuration(currentTime)} / {formatDuration(duration)}
                  </span>
                </div>

                <div>
                  <button onClick={handleFullscreen} className="text-slate-100 hover:text-brand-cyan transition-colors cursor-pointer" aria-label="Fullscreen view">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details information */}
          <h1 className="text-xl font-bold text-slate-100 mt-4 leading-relaxed">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => dispatch(showToast("Added to liked catalog", "success"))}>
                <ThumbsUp size={14} />
                <span>Like</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                dispatch(showToast("Link copied to clipboard", "success"));
              }}>
                <Share2 size={14} />
                <span>Share</span>
              </Button>
            </div>
          </div>

          <hr className="border-slate-800 my-6" />

          {/* Owner details */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link to={`/c/${video.owner.username}`}>
                <Avatar src={video.owner.avatar} name={video.owner.fullname} size="lg" />
              </Link>
              <div className="flex flex-col">
                <Link to={`/c/${video.owner.username}`} className="font-semibold text-slate-100 hover:text-brand-cyan transition-colors">
                  {video.owner.fullname}
                </Link>
                <span className="text-[10px] text-slate-400 mt-0.5">12.4K subscribers</span>
              </div>
            </div>
            <Button variant="solid" className="rounded-full">
              Subscribe
            </Button>
          </div>

          {/* Description Card */}
          <div className="rounded-xl glassmorphism p-4 mt-6">
            <p className={`text-xs text-slate-400 leading-relaxed white-space-pre-wrap word-break-break-word ${descExpanded ? "" : "line-clamp-2"}`}>
              {video.description}
            </p>
            <button 
              className="flex items-center gap-1 text-[10px] font-semibold text-slate-200 hover:text-brand-cyan mt-2 cursor-pointer transition-colors" 
              onClick={() => setDescExpanded(!descExpanded)}
            >
              <span>{descExpanded ? "Show Less" : "Show More"}</span>
              {descExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Suggested column list */}
        <aside className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-300">Up Next</h2>
          <div className="flex flex-col gap-3">
            {suggested?.map((v) => (
              <VideoCard key={v._id} video={v} layout="list" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
export default VideoDetail;
