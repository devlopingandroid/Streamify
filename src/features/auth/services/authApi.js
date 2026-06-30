import { apiClient } from "../../../services/apiClient";

export const loginApi = async (body) => {
  const response = await apiClient.post("/users/login", body);
  return response.data;
};

export const registerApi = async (formData) => {
  const response = await apiClient.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const logOutApi = async () => {
  const response = await apiClient.post("/users/logout");
  return response.data;
};

export const changePasswordApi = async (body) => {
  const response = await apiClient.post("/users/change-password", body);
  return response.data;
};
