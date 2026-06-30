import React from "react";
import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../services/apiClient";
import { VideoCard } from "../../../components/ui/VideoCard";
import { VideoCardSkeleton } from "../../../components/ui/VideoCardSkeleton";
import { showToast } from "../../../store/toastSlice";
import { History, Trash2 } from "lucide-react";

export const HistoryList = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: watchHistory, isLoading, error } = useQuery({
    queryKey: ["watchHistory"],
    queryFn: async () => {
      const response = await apiClient.get("/users/history");
      return response.data?.data || [];
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(["watchHistory"], []);
      dispatch(showToast("Successfully cleared local watch history", "success"));
    },
    onError: () => {
      dispatch(showToast("Failed to clear watch history", "error"));
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-[800px] mx-auto p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History size={24} className="text-brand-cyan" />
            <h1 className="text-2xl font-bold text-slate-100">Watch History</h1>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <VideoCardSkeleton key={idx} layout="list" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-slate-400">
        <h2 className="text-xl font-bold text-slate-200 mb-2">Failed to retrieve history</h2>
        <p className="text-xs">An error occurred while loading your watch history logs. Please verify your connection status.</p>
      </div>
    );
  }

  const hasHistory = watchHistory && watchHistory.length > 0;

  return (
    <div className="max-w-[800px] mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-2">
          <History size={24} className="text-brand-cyan" />
          <h1 className="text-2xl font-bold text-slate-100">Watch History</h1>
        </div>
        
        {hasHistory && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your local watch history log?")) {
                clearMutation.mutate();
              }
            }}
            disabled={clearMutation.isPending}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glassmorphism text-xs font-medium text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all cursor-pointer border border-transparent"
            aria-label="Clear watch history"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {!hasHistory ? (
        <div className="text-center py-20 px-6 rounded-xl glassmorphism max-w-[600px] mx-auto flex flex-col items-center">
          <div className="text-4xl text-slate-600 mb-3 font-light">Ø</div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Your Watch History is Empty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Videos you watch will accumulate here, making it easy to review your educational courses and stream uploads.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {watchHistory.map((video) => (
            <VideoCard key={video._id} video={video} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
};
export default HistoryList;
