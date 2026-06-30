import { apiClient } from "../../../services/apiClient";

export const getChannelApi = async (username) => {
  const response = await apiClient.get(`/users/c/${username}`);
  return response.data;
};

export const updateAvatarApi = async (formData) => {
  const response = await apiClient.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateCoverImageApi = async (formData) => {
  const response = await apiClient.patch("/users/cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export default getChannelApi;
