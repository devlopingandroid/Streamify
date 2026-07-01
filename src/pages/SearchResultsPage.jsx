import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useUserFeatures";
import { VideoGrid } from "../components/video/VideoGrid";
import { VideoCard } from "../components/video/VideoCard";
import { VideoCardSkeleton } from "../components/video/VideoCardSkeleton";
import { SortDropdown } from "../components/video/SortDropdown";
import { ViewToggle } from "../components/video/ViewToggle";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [layout, setLayout] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");

  const { data: videos, isLoading, error, refetch } = useSearch(query);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="h-6 w-48 bg-slate-800 animate-pulse rounded" />
        <VideoGrid className={layout === "list" ? "grid-cols-1!" : ""}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <VideoCardSkeleton key={`search-skel-${idx}`} layout={layout} />
          ))}
        </VideoGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState 
          title="Search Handshake Failure"
          description="We had trouble establishing connection to retrieve search results."
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasResults = videos && videos.length > 0;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 text-slate-100 select-none animate-fade-in">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <h1 className="text-sm font-semibold text-slate-300">
            Search results for: <span className="text-brand-cyan italic">"{query}"</span>
          </h1>
          <p className="text-[10px] text-slate-500 mt-0.5">{videos?.length || 0} files found</p>
        </div>

        {hasResults && (
          <div className="flex items-center gap-3">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "relevance", label: "Relevance" },
                { value: "date", label: "Upload Date" },
                { value: "views", label: "Views" },
              ]}
            />
            <ViewToggle layout={layout} onChange={setLayout} />
          </div>
        )}
      </div>

      {!hasResults ? (
        <EmptyState 
          title="No Matching Videos Found"
          description={`We couldn't locate any streams matching "${query}". Try broadening your search tags.`}
        />
      ) : (
        <VideoGrid className={layout === "list" ? "grid-cols-1!" : ""}>
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} layout={layout} />
          ))}
        </VideoGrid>
      )}
    </div>
  );
};
export default SearchResultsPage;
