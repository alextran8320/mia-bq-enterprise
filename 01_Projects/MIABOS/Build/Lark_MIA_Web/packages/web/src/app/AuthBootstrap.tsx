import { useEffect, type ReactNode } from "react";
import { authApi } from "@/shared/auth/authApi";
import { useAuthStore } from "@/shared/auth/authStore";

/**
 * Refresh the user from the BE on cold-load when we have a persisted token.
 *
 * Why: localStorage may hold stale role/permissions if an admin promoted/demoted
 * the user in another session. By calling /me before unblocking the router,
 * the UI always renders against the latest server state.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) {
        setHydrated(true);
        return;
      }
      try {
        const fresh = await authApi.me();
        if (!cancelled) setUser(fresh);
      } catch {
        // 401 path is already handled by the axios interceptor (clear + redirect).
        // Anything else (network blip): drop the session to be safe.
        if (!cancelled) clear();
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hydrated) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-page)",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-primary)",
          fontSize: 14,
        }}
      >
        Đang tải phiên đăng nhập…
      </div>
    );
  }
  return <>{children}</>;
}
