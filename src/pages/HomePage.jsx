import React from "react";
import { useVideos, useTrendingVideos } from "../hooks/useVideos";
import { useContinueWatching } from "../hooks/useUserFeatures";
import { VideoGrid } from "../components/video/VideoGrid";
import { VideoCard } from "../components/video/VideoCard";
import { VideoCardSkeleton } from "../components/video/VideoCardSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";

export const HomePage = () => {
  const {
    data: recommended,
    isLoading: recommendedLoading,
    error: recommendedError,
    refetch: refetchRecommended,
  } = useVideos();

  const {
    data: trending,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useTrendingVideos();

  const { data: continueWatching } = useContinueWatching();

  const handleRetryAll = () => {
    refetchRecommended();
    refetchTrending();
  };

  const hasErrors = recommendedError || trendingError;
  const isLoading = recommendedLoading || trendingLoading;

  if (hasErrors) {
    return (
      <div className="p-6 md:p-12">
        <ErrorState
          title="Playback Server Connection Error"
          description="We had trouble establishing a handshake with the video distribution layers."
          onRetry={handleRetryAll}
        />
      </div>
    );
  }
  console.log("Recommended =", recommended);
  console.log("Trending =", trending);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-10 text-slate-100 select-none">

      {/* Continue Watching Section */}
      {continueWatching && continueWatching.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Continue Watching</h2>
          <VideoGrid>
            {continueWatching.map((video) => (
              <VideoCard key={`cw-${video._id}`} video={video} />
            ))}
          </VideoGrid>
        </section>
      )}

      {/* Recommended Section */}
      <section>
        <h2 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Recommended Videos</h2>
        {isLoading ? (
          <VideoGrid>
            {Array.from({ length: 4 }).map((_, idx) => (
              <VideoCardSkeleton key={`rec-skel-${idx}`} />
            ))}
          </VideoGrid>
        ) : !recommended || recommended.length === 0 ? (
          <EmptyState
            title="Recommended Feed is Empty"
            description="Upload educational streams to populate recommendations."
          />
        ) : (
          <VideoGrid>
            {recommended.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </VideoGrid>
        )}
      </section>

      {/* Trending Section */}
      <section className="border-t border-slate-800/40 pt-10">
        <h2 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Trending Videos</h2>
        {isLoading ? (
          <VideoGrid>
            {Array.from({ length: 4 }).map((_, idx) => (
              <VideoCardSkeleton key={`trend-skel-${idx}`} />
            ))}
          </VideoGrid>
        ) : !trending || trending.length === 0 ? (
          <EmptyState
            title="No Trending Videos"
            description="Views metrics are required to calculate trends lists."
          />
        ) : (
          <VideoGrid>
            {trending.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </VideoGrid>
        )}
      </section>

    </div>
  );
};
export default HomePage;
