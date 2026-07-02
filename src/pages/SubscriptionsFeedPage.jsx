import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useInfiniteSubscriptionsFeed } from "../hooks/useUserFeatures";
import { VideoGrid } from "../components/video/VideoGrid";
import { VideoCard } from "../components/video/VideoCard";
import { VideoCardSkeleton } from "../components/video/VideoCardSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Button } from "../components/ui/Button";
import { UserCheck, PlaySquare } from "lucide-react";

export const SubscriptionsFeedPage = () => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteSubscriptionsFeed(12);

  const observerTarget = useRef(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-[1440px] mx-auto select-none">
        <div className="pb-4 border-b border-slate-800/60">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PlaySquare size={20} className="text-slate-400" />
            <span>Subscriptions Feed</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Browse the latest uploads from your subscribed channels.</p>
        </div>
        <VideoGrid>
          {Array.from({ length: 8 }).map((_, idx) => (
            <VideoCardSkeleton key={`feed-skel-${idx}`} />
          ))}
        </VideoGrid>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState
          title="Subscriptions Feed Error"
          description="Failed to load your subscriptions video feed. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const videos = data?.pages.flatMap((page) => page.docs || []) || [];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 text-slate-100 select-none animate-fade-in max-w-[1440px] mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PlaySquare size={20} className="text-slate-400" />
            <span>Subscriptions Feed</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Browse the latest uploads from your subscribed channels.</p>
        </div>
        <Link to="/subscriptions" className="flex-shrink-0">
          <Button variant="outline" size="sm" className="rounded-full gap-1.5">
            <UserCheck size={14} />
            <span>Manage Channels</span>
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          title="No Recent Uploads"
          description="Your subscribed creators haven't uploaded any media streams recently. Try managing your channels to discover more creators."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <VideoGrid>
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
            
            {/* Show skeletons while loading next page */}
            {isFetchingNextPage && (
              Array.from({ length: 4 }).map((_, idx) => (
                <VideoCardSkeleton key={`next-page-skel-${idx}`} />
              ))
            )}
          </VideoGrid>
          
          {/* Intersection Observer trigger anchor element */}
          <div ref={observerTarget} className="h-10 w-full flex items-center justify-center text-xs text-slate-500">
            {isFetchingNextPage && "Loading more videos..."}
            {!hasNextPage && videos.length > 0 && "All caught up! You've viewed all recent subscription videos."}
          </div>
        </div>
      )}

    </div>
  );
};

export default SubscriptionsFeedPage;
