import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/shared/auth/authApi";
import { useAuthStore } from "@/shared/auth/authStore";
import { getApiErrorMessage } from "@/shared/auth/apiClient";
import { roleHome } from "@/shared/auth/roleHome";
import type { LarkProfile } from "@/shared/auth/types";
import { Button } from "@/shared/ui";

const PENDING_PROFILE_KEY = "miabos_pending_lark_profile";

export function BindPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);

  const [profile, setProfile] = useState<LarkProfile | null>(() =>
    readPendingProfile(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      // Nothing to bind — bounce home (or login).
      navigate(user ? roleHome(user.role) : "/login", { replace: true });
    }
  }, [profile, user, navigate]);

  if (!profile || !user) return null;

  async function onConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await authApi.bind(profile!);
      setSession(res.token, res.user);
      sessionStorage.removeItem(PENDING_PROFILE_KEY);
      navigate(roleHome(res.user.role), { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Liên kết Lark thất bại"));
    } finally {
      setSubmitting(false);
    }
  }

  function onCancel() {
    sessionStorage.removeItem(PENDING_PROFILE_KEY);
    setProfile(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--color-bg-page)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "var(--color-bg-card)",
          padding: 32,
          borderRadius: 12,
          boxShadow: "var(--shadow-elevated)",
          fontFamily: "var(--font-primary)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
          Liên kết Lark
        </h1>
        <p
          style={{
            margin: "8px 0 24px",
            color: "var(--color-text-secondary)",
            fontSize: 13,
          }}
        >
          Bạn đang đăng nhập với <strong>{user.email}</strong>. Liên kết với
          Lark account dưới đây để lần sau đăng nhập trực tiếp từ Lark.
        </p>

        <div
          style={{
            background: "var(--color-bg-page)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            fontSize: 13,
            display: "grid",
            gap: 8,
          }}
        >
          <Row label="Tên Lark" value={profile.name ?? "—"} />
          <Row label="Email Lark" value={profile.email ?? "—"} />
          <Row label="Open ID" value={profile.openId} mono />
          {profile.tenantKey && (
            <Row label="Tenant" value={profile.tenantKey} mono />
          )}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: "10px 12px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#991B1B",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              color: "var(--color-text-primary)",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "var(--font-primary)",
            }}
          >
            Bỏ qua
          </button>
          <Button
            onClick={onConfirm}
            disabled={submitting}
            style={{ flex: 1 }}
          >
            {submitting ? "Đang liên kết…" : "Xác nhận liên kết"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
      <span
        style={{
          color: "var(--color-text-primary)",
          fontFamily: mono ? "var(--font-mono, monospace)" : undefined,
          fontSize: mono ? 12 : 13,
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function readPendingProfile(): LarkProfile | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as LarkProfile) : null;
  } catch {
    return null;
  }
}
