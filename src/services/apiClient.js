import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Normalized API error format.
 */
export const parseError = (error) => {
  const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
  const status = error.response?.status || 500;
  const errors = error.response?.data?.errors || null;
  return { message, status, errors, originalError: error };
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Config adjustments (e.g. adding request trace headers) can go here
    return config;
  },
  (error) => {
    return Promise.reject(parseError(error));
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Placeholder check for token refresh flows
    // To be fully wired to auth store triggers in the authentication module phase
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Placeholder representation:
      // return handleRefreshTokenFlow(originalRequest);
      
      return Promise.reject(parseError(error));
    }

    return Promise.reject(parseError(error));
  }
);

export default apiClient;
