import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Loader2
} from "lucide-react";
import { formatDuration } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import { recordWatchProgressApi } from "../../services/history.api";

export const VideoPlayer = ({ src, poster, videoId, resumePosition }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const lastRecordedTimeRef = useRef(-1);
  const resumeAppliedRef = useRef(false);
  const intervalIdRef = useRef(null);

  const queryClient = useQueryClient();

  const saveProgress = useCallback((force = false) => {
    if (!videoRef.current || !videoId) return;
    const currentProgress = Math.floor(videoRef.current.currentTime);
    const totalDuration = Math.floor(videoRef.current.duration);

    if (totalDuration <= 0) return;

    if (!force && lastRecordedTimeRef.current === currentProgress) return;

    lastRecordedTimeRef.current = currentProgress;
    recordWatchProgressApi(videoId, currentProgress, totalDuration)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["continueWatching"] });
        queryClient.invalidateQueries({ queryKey: ["resumePosition", videoId] });
      })
      .catch(() => {});
  }, [videoId, queryClient]);

  // Auto-hide controls overlay on cursor inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  // Reset seek and track states when videoId changes
  useEffect(() => {
    resumeAppliedRef.current = false;
    lastRecordedTimeRef.current = -1;
  }, [videoId]);

  // Periodically record progress every 10 seconds while playing
  useEffect(() => {
    if (isPlaying) {
      intervalIdRef.current = setInterval(() => {
        saveProgress(false);
      }, 10000);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isPlaying, videoId, saveProgress]);

  // Record progress on component cleanup (leaving page) and page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress(true);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveProgress(true);
    };
  }, [videoId, saveProgress]);

  // Seek to resumePosition once duration and resumePosition are available
  useEffect(() => {
    if (videoRef.current && duration > 0 && resumePosition > 0 && !resumeAppliedRef.current) {
      videoRef.current.currentTime = resumePosition;
      setCurrentTime(resumePosition);
      resumeAppliedRef.current = true;
    }
  }, [duration, resumePosition]);

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

  const handleScrubChange = (e) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
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

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard Shortcuts (Task 7)
  const handleKeyDown = (e) => {
    if (!videoRef.current) return;
    const key = e.key.toLowerCase();
    
    // Prevent default scroll behaviors on arrow/space triggers
    if (["space", " ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }

    switch (key) {
      case " ":
      case "space":
        togglePlay();
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        toggleFullscreen();
        break;
      case "arrowright":
        videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
        break;
      case "arrowleft":
        videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
        break;
      case "arrowup":
        const upVol = Math.min(volume + 0.05, 1);
        setVolume(upVol);
        videoRef.current.volume = upVol;
        break;
      case "arrowdown":
        const downVol = Math.max(volume - 0.05, 0);
        setVolume(downVol);
        videoRef.current.volume = downVol;
        break;
      default:
        break;
    }
  };

  // Synchronize fullscreen events from double clicks or escape keys
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={playerRef}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      tabIndex={0}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-cyan group select-none"
      role="region"
      aria-label="Video Player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsWaiting(true)}
        onPlaying={() => setIsWaiting(false)}
        onPause={() => saveProgress(true)}
        onEnded={() => saveProgress(true)}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Spinner for Buffer State */}
      {isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] pointer-events-none">
          <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
        </div>
      )}

      {/* Custom Control Bar Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col p-4 pt-12 transition-opacity duration-300 z-10 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
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
            aria-label="Seek video scrubber"
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex justify-between items-center text-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay} 
              className="hover:text-brand-cyan transition-colors cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            {/* Volume controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMute} 
                className="hover:text-brand-cyan transition-colors cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 cursor-pointer accent-brand-cyan"
                aria-label="Volume slider controls"
              />
            </div>

            <span className="text-[10px] font-semibold text-slate-300">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback speed selector */}
            <div className="relative group/speed">
              <button 
                className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 hover:text-brand-cyan transition-colors cursor-pointer"
                aria-label="Playback speed"
              >
                {playbackRate}x
              </button>
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover/speed:flex flex-col bg-slate-900 border border-slate-800 rounded p-1 shadow-xl z-20">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={`px-3 py-1 text-[10px] rounded text-left hover:bg-slate-800 transition-colors cursor-pointer ${
                      playbackRate === rate ? "text-brand-cyan font-bold" : "text-slate-400"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={toggleFullscreen} 
              className="hover:text-brand-cyan transition-colors cursor-pointer"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoPlayer;
