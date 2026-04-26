import axios from "axios";
import { clearAuth, getAuthToken } from "./authStore";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15_000,
});

// Inject Bearer token on every request (when present).
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: clear local session and bounce to /login.
// 403 is left for the calling code to handle (toast / inline message).
apiClient.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      // Avoid loops: only redirect if not already on /login.
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        const next = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        window.location.assign(`/login?next=${next}`);
      }
    }
    return Promise.reject(error);
  },
);

// Convenience: pull a `{ error, details? }` message out of an axios error.
export function getApiErrorMessage(error: unknown, fallback = "Có lỗi xảy ra") {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { error?: string })?.error ??
      error.message ??
      fallback
    );
  }
  return fallback;
}
