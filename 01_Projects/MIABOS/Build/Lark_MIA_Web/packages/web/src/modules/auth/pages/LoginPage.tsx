import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/shared/auth/authApi";
import { useAuthStore } from "@/shared/auth/authStore";
import { getApiErrorMessage } from "@/shared/auth/apiClient";
import { isInLark } from "@/shared/auth/larkSdk";
import { roleHome } from "@/shared/auth/roleHome";
import type { LarkProfile } from "@/shared/auth/types";
import { Button } from "@/shared/ui";

const PENDING_PROFILE_KEY = "miabos_pending_lark_profile";

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const nextParam = params.get("next");

  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = useAuthStore((s) => s.user?.role);
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (token && hydrated) {
    return <Navigate to={nextParam ?? roleHome(role)} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { token, user } = await authApi.login(email, password);
      setSession(token, user);
      const pending = readPendingProfile();
      if (pending) {
        navigate("/bind", { replace: true });
      } else {
        navigate(nextParam ?? roleHome(user.role), { replace: true });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Đăng nhập thất bại"));
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 400,
          background: "var(--color-bg-card)",
          padding: 32,
          borderRadius: 12,
          boxShadow: "var(--shadow-elevated)",
          fontFamily: "var(--font-primary)",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
            Đăng nhập MIA BQ
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              color: "var(--color-text-secondary)",
              fontSize: 13,
            }}
          >
            Dùng email công ty hoặc tài khoản Lark
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="ban@bq.vn"
            autoFocus
          />
          <Field
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />
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
              }}
            >
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={submitting || !email || !password}
            style={{ width: "100%" }}
          >
            {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
        </form>

        {isInLark() && (
          <button
            onClick={() => navigate("/lark/entry")}
            style={{
              marginTop: 16,
              width: "100%",
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
            Đăng nhập bằng Lark
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          padding: "10px 12px",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          fontSize: 14,
          fontFamily: "var(--font-primary)",
          outline: "none",
        }}
      />
    </label>
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
