import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthedUser } from "./types";

type AuthState = {
  token: string | null;
  user: AuthedUser | null;
  // True once we've finished the initial /me refresh on mount.
  // Use this to avoid flickering /login → /dashboard during boot.
  hydrated: boolean;
  setSession: (token: string, user: AuthedUser) => void;
  setUser: (user: AuthedUser) => void;
  setHydrated: (v: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      clear: () => set({ token: null, user: null }),
    }),
    {
      name: "miabos_auth",
      // Only persist token + user. `hydrated` is a runtime flag.
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
);

// Convenience selectors / direct access for non-React callers (axios interceptor).
export const getAuthToken = () => useAuthStore.getState().token;
export const clearAuth = () => useAuthStore.getState().clear();

// Cross-tab sync: when another tab logs out, this tab clears too.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "miabos_auth" && !e.newValue) {
      useAuthStore.getState().clear();
    }
  });
}
