import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVideosApi } from "../services/mockVideoService";
import { VideoCard } from "../../../components/ui/VideoCard";
import { VideoCardSkeleton } from "../../../components/ui/VideoCardSkeleton";

export const HomeFeed = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ["videos", searchQuery],
    queryFn: () => getVideosApi(searchQuery),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <VideoCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-slate-400">
        <h2 className="text-xl font-bold text-slate-200 mb-2">Failed to retrieve video catalog</h2>
        <p className="text-xs">An error occurred while connecting to the stream servers. Please verify your connection.</p>
      </div>
    );
  }

  const hasVideos = videos && videos.length > 0;

  return (
    <div className="p-6 animate-fade-in">
      {searchQuery ? (
        <h1 className="text-sm font-semibold text-slate-300 mb-6">
          Search results for: <span className="text-brand-cyan italic">"{searchQuery}"</span>
        </h1>
      ) : (
        <h1 className="text-sm font-semibold text-slate-300 mb-6">Recommended Videos</h1>
      )}

      {!hasVideos ? (
        <div className="text-center py-20 px-6 rounded-xl glassmorphism max-w-[600px] mx-auto flex flex-col items-center mt-8">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-xl font-medium mb-3">?</div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">No matches found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't find any enterprise media matching "{searchQuery}". Try refining your search query keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
export default HomeFeed;
