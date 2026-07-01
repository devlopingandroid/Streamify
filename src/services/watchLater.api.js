import { apiClient } from "./apiClient";

export const getWatchLaterApi = async () => {
  const response = await apiClient.get("/watchlater");
  return response.data;
};

export const toggleWatchLaterApi = async (videoId) => {
  const response = await apiClient.post(`/watchlater/toggle/v/${videoId}`);
  return response.data;
};
