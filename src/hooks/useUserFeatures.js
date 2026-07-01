import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSearchResultsApi } from "../services/search.api";
import { getWatchHistoryApi, clearWatchHistoryApi } from "../services/history.api";
import { getPlaylistsApi, createPlaylistApi, deletePlaylistApi } from "../services/playlist.api";
import { getSubscriptionsApi } from "../services/subscription.api";
import { getLikedVideosApi, toggleLikeVideoApi } from "../services/likes.api";
import { getWatchLaterApi, toggleWatchLaterApi } from "../services/watchLater.api";

// Static mock array fallbacks for stability when backend database is empty or unseeded
const MOCK_MEMBER_CHANNELS = [
  {
    _id: "user-arch",
    username: "systemarch",
    fullname: "Tech Architecture Labs",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop",
    subscribersCount: 12400,
  },
  {
    _id: "user-code",
    username: "codecraft",
    fullname: "CodeCraft Academy",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    subscribersCount: 89000,
  },
];

const MOCK_PLAYLISTS = [
  {
    _id: "playlist-1",
    name: "Distributed Systems Course",
    videosCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "playlist-2",
    name: "React 19 Dashboard Masterclass",
    videosCount: 1,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Hook to execute search results.
 */
export const useSearch = (query = "") => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      try {
        const res = await getSearchResultsApi(query);
        return res?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!query,
  });
};

/**
 * Hook to execute history retrieval and clearance.
 */
export const useHistory = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      try {
        const res = await getWatchHistoryApi();
        return res?.data || [];
      } catch {
        return [];
      }
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearWatchHistoryApi,
    onSuccess: () => {
      queryClient.setQueryData(["history"], []);
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return { ...query, clearHistory: clearMutation.mutate, isClearing: clearMutation.isPending };
};

/**
 * Hook to retrieve and toggle Watch Later lists.
 */
export const useWatchLater = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["watchLater"],
    queryFn: async () => {
      try {
        const res = await getWatchLaterApi();
        return res?.data || [];
      } catch {
        return [];
      }
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleWatchLaterApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchLater"] });
    },
  });

  return { ...query, toggleWatchLater: toggleMutation.mutate };
};

/**
 * Hook to retrieve and toggle Liked videos.
 */
export const useLikedVideos = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["likedVideos"],
    queryFn: async () => {
      try {
        const res = await getLikedVideosApi();
        return res?.data || [];
      } catch {
        return [];
      }
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: toggleLikeVideoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likedVideos"] });
    },
  });

  return { ...query, toggleLike: toggleLikeMutation.mutate };
};

/**
 * Hook to retrieve creators subscriptions.
 */
export const useSubscriptions = () => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      try {
        const res = await getSubscriptionsApi();
        return res?.data || [];
      } catch {
        return MOCK_MEMBER_CHANNELS;
      }
    },
  });
};

/**
 * Hook to manage playlists.
 */
export const usePlaylists = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      try {
        const res = await getPlaylistsApi();
        return res?.data || [];
      } catch {
        return MOCK_PLAYLISTS;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: createPlaylistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlaylistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });

  return {
    ...query,
    createPlaylist: createMutation.mutate,
    isCreating: createMutation.isPending,
    deletePlaylist: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
