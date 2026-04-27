import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/auth/authStore";
import { isInLark } from "@/shared/auth/larkSdk";
import { roleHome } from "@/shared/auth/roleHome";

export function LandingRedirect() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  if (token) return <Navigate to={roleHome(role)} replace />;
  if (isInLark()) return <Navigate to="/lark/entry" replace />;
  return <Navigate to="/login" replace />;
}
