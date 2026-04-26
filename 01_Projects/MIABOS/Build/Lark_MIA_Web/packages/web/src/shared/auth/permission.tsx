import { type ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./authStore";

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const set = useMemo(
    () => new Set(user?.permissions ?? []),
    [user?.permissions],
  );
  return {
    has: (code: string) => set.has(code),
    hasAny: (codes: string[]) => codes.some((c) => set.has(c)),
    hasAll: (codes: string[]) => codes.every((c) => set.has(c)),
    isAdmin: user?.role === "admin",
    role: user?.role ?? null,
  };
}

/**
 * Layout-level guard. Use as a route element wrapper:
 *   element: <RequireAuth><AppShell/></RequireAuth>
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const location = useLocation();

  if (!token) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  // While the bootstrap /me call is in flight we still have a token in store —
  // render children optimistically. If /me fails, AuthBootstrap will clear()
  // and the next render will redirect.
  if (!hydrated) return null;
  return <>{children}</>;
}

/**
 * UI-level guard. Hide a section/button when the user lacks permission.
 *
 *   <RequirePermission code="customer:write">
 *     <Button>Tạo khách hàng</Button>
 *   </RequirePermission>
 *
 * Pass `redirect` to bounce to / when used as a route element instead of
 * silently hiding (useful for protected pages like /operations/users-roles).
 */
export function RequirePermission({
  code,
  children,
  fallback = null,
  redirect = false,
}: {
  code: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
  redirect?: boolean;
}) {
  const { hasAny } = usePermissions();
  const codes = Array.isArray(code) ? code : [code];
  const allowed = hasAny(codes);

  if (!allowed) {
    if (redirect) return <Navigate to="/" replace />;
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
