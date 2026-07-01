import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useChannel } from "../hooks/useUser";
import { useVideos } from "../hooks/useVideos";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { VideoGrid } from "../components/video/VideoGrid";
import { VideoCard } from "../components/video/VideoCard";
import { VideoCardSkeleton } from "../components/video/VideoCardSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { PageLoader } from "../components/ui/PageLoader";
import { Users, Mail, Settings } from "lucide-react";
import { formatNumber } from "../utils";
import { toast } from "react-hot-toast";

export const ChannelPage = () => {
  const { username } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("videos");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Queries
  const { data: channel, isLoading, error, refetch } = useChannel(username);
  const { data: videos, isLoading: videosLoading } = useVideos();

  const isOwnProfile = currentUser?.username === username;

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? "Unsubscribed from channel." : "Successfully subscribed to channel.");
  };

  if (isLoading) {
    return <PageLoader message="Retrieving channel parameters..." />;
  }

  if (error || !channel) {
    return (
      <div className="p-6 md:p-12">
        <ErrorState 
          title="Channel Profile Error"
          description="We had trouble establishing connection to retrieve this channel profile."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Filter videos belonging to this channel
  const channelVideos = videos?.filter((v) => v.owner.username === username) || [];

  return (
    <div className="flex flex-col w-full animate-fade-in text-slate-100 select-none">
      
      {/* Cover Banner */}
      <div className="w-full h-[180px] md:h-[260px] relative bg-slate-900 overflow-hidden border-b border-slate-800/60">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-cyan/10 to-brand-indigo/10" />
        )}
      </div>

      {/* Profile Row Detail */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6 px-6 md:px-12 -mt-12 relative z-10">
        <div className="relative w-24 h-24 rounded-full border-4 border-dark-base bg-dark-base shadow-xl flex-shrink-0">
          <Avatar src={channel.avatar} name={channel.fullname} size="xl" className="w-full h-full" />
        </div>

        <div className="flex flex-col flex-grow pb-2">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start w-full">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-100">{channel.fullname}</h1>
              <p className="text-xs text-slate-400 mt-0.5">@{channel.username}</p>
            </div>
            
            {isOwnProfile ? (
              <Link to="/settings">
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  <Settings size={14} />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            ) : (
              <Button 
                variant={isSubscribed ? "outline" : "solid"}
                size="sm"
                className="rounded-full"
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>
          
          <div className="flex gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Users size={12} className="text-slate-500" />
              <span><strong>{formatNumber(channel.subscribersCount)}</strong> Subscribers</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Users size={12} className="text-slate-500" />
              <span><strong>{formatNumber(channel.channelsSubscribedToCount)}</strong> Subscribed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list menu */}
      <div className="flex border-b border-slate-800/80 mt-8 px-6 md:px-12">
        {["videos", "playlists", "about"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab 
                ? "border-brand-cyan text-brand-cyan" 
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content panel */}
      <div className="p-6 md:p-12">
        {activeTab === "videos" ? (
          videosLoading ? (
            <VideoGrid>
              {Array.from({ length: 3 }).map((_, idx) => (
                <VideoCardSkeleton key={`ch-skel-${idx}`} />
              ))}
            </VideoGrid>
          ) : channelVideos.length === 0 ? (
            <EmptyState 
              title="No Videos Uploaded"
              description="This channel hasn't uploaded any media streams yet."
            />
          ) : (
            <VideoGrid>
              {channelVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </VideoGrid>
          )
        ) : activeTab === "playlists" ? (
          <EmptyState 
            title="No Playlists Configured"
            description="Playlists features will be enabled in subsequent phase releases."
          />
        ) : (
          <div className="rounded-xl border border-slate-800/40 bg-slate-900/10 p-6 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">About Channel</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Welcome to the workspace of {channel.fullname}. Streamify enterprise members distribute instructionals, media cards, and system reports here.
            </p>
            <div className="border-t border-slate-800/60 pt-4 mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Mail size={14} className="text-slate-500" />
              <span>Contact: {channel.email}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
export default ChannelPage;
