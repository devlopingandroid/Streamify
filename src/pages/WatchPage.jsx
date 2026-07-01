import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useVideo, useVideos } from "../hooks/useVideos";
import { VideoPlayer } from "../components/video/VideoPlayer";
import { VideoCard } from "../components/video/VideoCard";
import { VideoCardSkeleton } from "../components/video/VideoCardSkeleton";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { ErrorState } from "../components/ui/ErrorState";
import { PageLoader } from "../components/ui/PageLoader";
import { formatNumber } from "../utils";
import { toast } from "react-hot-toast";
import { 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

export const WatchPage = () => {
  const { videoId } = useParams();

  const [descExpanded, setDescExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Video Queries
  const { data: video, isLoading: videoLoading, error: videoError, refetch: refetchVideo } = useVideo(videoId);
  const { data: recommended, isLoading: recsLoading } = useVideos();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Watch link copied to clipboard.");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed like." : "Video added to liked catalog.");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from library." : "Video saved to library.");
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? "Unsubscribed from channel." : "Successfully subscribed to channel.");
  };

  if (videoLoading) {
    return <PageLoader message="Initializing video stream session..." />;
  }

  if (videoError || !video) {
    return (
      <div className="p-6 md:p-12">
        <ErrorState 
          title="Playback Error"
          description="The requested media stream could not be found or connection refused."
          onRetry={refetchVideo}
        />
      </div>
    );
  }

  // Filter out the currently playing video from recommendations
  const alternativeSuggestions = recommended?.filter((v) => v._id !== videoId) || [];

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto animate-fade-in text-slate-100 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        
        {/* Left Side: Main Player and Metadata Details */}
        <div className="flex flex-col">
          <VideoPlayer src={video.videoFile} poster={video.thumbnail} />
          
          <h1 className="text-lg md:text-xl font-bold text-slate-100 mt-4 leading-relaxed">
            {video.title}
          </h1>

          {/* Interactive Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 pb-6 border-b border-slate-800/60">
            {/* Owner channel details */}
            <div className="flex items-center gap-4">
              <Link to="/landing">
                <Avatar src={video.owner.avatar} name={video.owner.fullname} size="lg" />
              </Link>
              <div className="flex flex-col">
                <Link to="/landing" className="font-semibold text-slate-200 hover:text-brand-cyan transition-colors text-xs">
                  {video.owner.fullname}
                </Link>
                <span className="text-[10px] text-slate-500 mt-0.5">@{video.owner.username}</span>
              </div>
              <Button 
                variant={isSubscribed ? "outline" : "solid"} 
                size="sm" 
                className="ml-2 rounded-full"
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>

            {/* Utility action buttons */}
            <div className="flex gap-2 items-center flex-wrap">
              <Button 
                variant={isLiked ? "solid" : "outline"} 
                size="sm" 
                className="gap-1.5 rounded-full"
                onClick={handleLike}
              >
                <ThumbsUp size={14} />
                <span className="text-[11px]">Like</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 rounded-full"
                onClick={handleShare}
              >
                <Share2 size={14} />
                <span className="text-[11px]">Share</span>
              </Button>
              <Button 
                variant={isSaved ? "solid" : "outline"} 
                size="sm" 
                className="gap-1.5 rounded-full"
                onClick={handleSave}
              >
                <Bookmark size={14} />
                <span className="text-[11px]">Save</span>
              </Button>
            </div>
          </div>

          {/* Video Description panel */}
          <div className="rounded-xl border border-slate-800/40 bg-slate-900/10 p-4 mt-6">
            <div className="flex gap-2 text-[10px] text-slate-500 font-semibold mb-2">
              <span>{formatNumber(video.views)} views</span>
              <span>•</span>
              <span>Uploaded 3 days ago</span>
            </div>
            <p className={`text-xs text-slate-400 leading-relaxed whitespace-pre-wrap break-words ${
              descExpanded ? "" : "line-clamp-2"
            }`}>
              {video.description}
            </p>
            <button 
              onClick={() => setDescExpanded(!descExpanded)}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-200 hover:text-brand-cyan mt-3 cursor-pointer transition-colors"
            >
              <span>{descExpanded ? "Show Less" : "Show More"}</span>
              {descExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Right Side: Suggestions List */}
        <aside className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Up Next</h2>
          <div className="flex flex-col gap-4">
            {recsLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <VideoCardSkeleton key={`rec-side-${idx}`} layout="list" />
              ))
            ) : alternativeSuggestions.length === 0 ? (
              <span className="text-2xs text-slate-500 italic">No alternative suggestions.</span>
            ) : (
              alternativeSuggestions.map((v) => (
                <VideoCard key={v._id} video={v} layout="list" />
              ))
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};
export default WatchPage;
