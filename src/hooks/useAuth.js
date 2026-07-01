import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login, logout, clearAuth } from "../store/authSlice";
import { loginApi, registerApi, logoutApi } from "../services/auth.api";
import { getCurrentUserApi } from "../services/user.api";

/**
 * Hook to retrieve and watch the current user session details.
 */
export const useCurrentUser = (options = {}) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await getCurrentUserApi();
        const user = response?.data;
        dispatch(login(user));
        return user;
      } catch (err) {
        // 401 after logout is expected
        if (err.status === 401 || err.originalError?.response?.status === 401) {
          dispatch(clearAuth());
          return null;
        }

        throw err;
      }
    },
    retry: false, // Do not spam retries on unauthenticated sessions
    staleTime: 1000 * 60 * 15, // 15 mins stale time
    ...options,
  });
};

/**
 * Hook to execute user authentication login.
 */
export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const user = data?.data?.user;
      dispatch(login(user));
      queryClient.setQueryData(["currentUser"], user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

/**
 * Hook to register a new user profile.
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

/**
 * Hook to execute logout and session clear actions.
 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(logout());
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear(); // Clear all server states cache
    },
    onError: () => {
      // Clean local session state even if network call fails
      dispatch(logout());
      queryClient.clear();
    },
  });
};
