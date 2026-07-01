import { apiClient } from "./apiClient";

export const getPlaylistsApi = async () => {
  const response = await apiClient.get("/playlists");
  return response.data;
};

export const createPlaylistApi = async (body) => {
  const response = await apiClient.post("/playlists", body);
  return response.data;
};

export const deletePlaylistApi = async (id) => {
  const response = await apiClient.delete(`/playlists/${id}`);
  return response.data;
};

export const addVideoToPlaylistApi = async (playlistId, videoId) => {
  const response = await apiClient.post(`/playlists/${playlistId}/videos`, { videoId });
  return response.data;
};

export const removeVideoFromPlaylistApi = async (playlistId, videoId) => {
  const response = await apiClient.delete(`/playlists/${playlistId}/videos/${videoId}`);
  return response.data;
};
