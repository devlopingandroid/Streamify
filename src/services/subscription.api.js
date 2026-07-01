import { apiClient } from "./apiClient";

export const getSubscriptionsApi = async () => {
  const response = await apiClient.get("/subscriptions");
  return response.data;
};
