import { apiClient } from "./apiClient";

export const getLikedVideosApi = async () => {
  const response = await apiClient.get("/likes");
  return response.data;
};

export const toggleLikeVideoApi = async (videoId) => {
  const response = await apiClient.post(`/likes/toggle/v/${videoId}`);
  return response.data;
};
