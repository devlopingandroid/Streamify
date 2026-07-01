import { apiClient } from "./apiClient";

export const getWatchHistoryApi = async () => {
  const response = await apiClient.get("/users/history");
  return response.data;
};

export const clearWatchHistoryApi = async () => {
  const response = await apiClient.delete("/users/history");
  return response.data;
};
