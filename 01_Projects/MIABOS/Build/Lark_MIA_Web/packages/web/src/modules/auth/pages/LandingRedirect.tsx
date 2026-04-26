import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/auth/authStore";
import { isInLark } from "@/shared/auth/larkSdk";

const HOME = "/analytics/executive";

export function LandingRedirect() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to={HOME} replace />;
  if (isInLark()) return <Navigate to="/lark/entry" replace />;
  return <Navigate to="/login" replace />;
}
