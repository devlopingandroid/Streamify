import React from "react";
import { Link } from "react-router-dom";
import { useSubscriptions } from "../hooks/useUserFeatures";
import { useVideos } from "../hooks/useVideos";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { VideoGrid } from "../components/video/VideoGrid";
import { VideoCard } from "../components/video/VideoCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { PageLoader } from "../components/ui/PageLoader";
import { UserCheck } from "lucide-react";
import { formatNumber } from "../utils";

export const SubscriptionsPage = () => {
  const { data: channels, isLoading: channelsLoading, error, refetch } = useSubscriptions();
  const { data: videos, isLoading: videosLoading } = useVideos();

  if (channelsLoading || videosLoading) {
    return <PageLoader message="Fetching subscriber channels feed..." />;
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState 
          title="Subscriptions Handshake Failure"
          description="We had trouble retrieving your subscription channel catalog."
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasChannels = channels && channels.length > 0;

  const latestUploads = videos?.filter((video) => 
    channels?.some((channel) => channel.username === video.owner.username)
  ) || [];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-10 text-slate-100 select-none animate-fade-in">
      
      {/* Header Info */}
      <div className="pb-4 border-b border-slate-800/60">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserCheck size={20} className="text-slate-400" />
          <span>Subscriptions</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Explore channels you follow and browse their latest uploads.</p>
      </div>

      {!hasChannels ? (
        <EmptyState 
          title="No Active Subscriptions"
          description="Follow creators to see their stream uploads listed here."
        />
      ) : (
        <>
          {/* Subscribed Channels Grid */}
          <section>
            <h2 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Subscribed Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {channels.map((channel) => (
                <div 
                  key={channel._id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/10 hover:border-slate-800 transition-colors"
                >
                  <Avatar src={channel.avatar} name={channel.fullname} size="lg" />
                  <div className="flex flex-col min-w-0 flex-grow">
                    <span className="text-xs font-bold text-slate-200 truncate">{channel.fullname}</span>
                    <span className="text-[10px] text-slate-500 truncate">@{channel.username}</span>
                    <span className="text-[10px] text-brand-cyan font-medium mt-1">
                      {formatNumber(channel.subscribersCount)} subscribers
                    </span>
                  </div>
                  <Link to={`/c/${channel.username}`} className="flex-shrink-0">
                    <Button variant="outline" size="2xs" className="rounded-full">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Uploads Feed Grid */}
          <section className="border-t border-slate-800/40 pt-10">
            <h2 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Latest Uploads</h2>
            {latestUploads.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No recent uploads from your subscriptions.</span>
            ) : (
              <VideoGrid>
                {latestUploads.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </VideoGrid>
            )}
          </section>
        </>
      )}

    </div>
  );
};
export default SubscriptionsPage;
