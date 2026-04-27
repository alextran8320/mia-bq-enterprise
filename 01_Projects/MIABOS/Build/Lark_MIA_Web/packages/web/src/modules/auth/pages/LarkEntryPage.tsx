import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/shared/auth/authApi";
import { useAuthStore } from "@/shared/auth/authStore";
import { getApiErrorMessage } from "@/shared/auth/apiClient";
import { loadLarkSdk, requestLarkCode } from "@/shared/auth/larkSdk";
import { roleHome } from "@/shared/auth/roleHome";

const PENDING_PROFILE_KEY = "miabos_pending_lark_profile";

type Phase =
  | "loading-sdk"
  | "requesting-code"
  | "exchanging"
  | "needs-binding"
  | "error";

export function LarkEntryPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [phase, setPhase] = useState<Phase>("loading-sdk");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const config = await authApi.getConfig();
        if (!config.larkAppId) {
          throw new Error(
            "Server chưa cấu hình Lark App ID. Liên hệ admin.",
          );
        }
        if (cancelled) return;

        setPhase("loading-sdk");
        await loadLarkSdk();
        if (cancelled) return;

        setPhase("requesting-code");
        const code = await requestLarkCode(config.larkAppId);
        if (cancelled) return;

        setPhase("exchanging");
        const result = await authApi.larkExchange(code);
        if (cancelled) return;

        if ("token" in result) {
          setSession(result.token, result.user);
          navigate(roleHome(result.user.role), { replace: true });
          return;
        }

        // needsBinding=true → stash + bounce to /login
        sessionStorage.setItem(
          PENDING_PROFILE_KEY,
          JSON.stringify(result.larkProfile),
        );
        setPhase("needs-binding");
        navigate("/login", { replace: true });
      } catch (err) {
        if (cancelled) return;
        setError(getApiErrorMessage(err, "Không đăng nhập được qua Lark"));
        setPhase("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, setSession]);

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
          maxWidth: 420,
          textAlign: "center",
          fontFamily: "var(--font-primary)",
        }}
      >
        {phase !== "error" ? (
          <>
            <Spinner />
            <h2 style={{ margin: "24px 0 8px", fontSize: 18 }}>
              {messageFor(phase)}
            </h2>
            <p
              style={{
                margin: 0,
                color: "var(--color-text-secondary)",
                fontSize: 13,
              }}
            >
              Vui lòng giữ ứng dụng Lark mở
            </p>
          </>
        ) : (
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>
              Không đăng nhập được qua Lark
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "10px 16px",
                background: "var(--color-text-primary)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Đăng nhập bằng email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function messageFor(phase: Phase): string {
  switch (phase) {
    case "loading-sdk":
      return "Đang tải Lark SDK…";
    case "requesting-code":
      return "Đang xác thực với Lark…";
    case "exchanging":
      return "Đang đăng nhập…";
    case "needs-binding":
      return "Cần liên kết tài khoản nội bộ — chuyển hướng…";
    default:
      return "";
  }
}

function Spinner() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        border: "3px solid var(--color-border)",
        borderTopColor: "var(--color-text-primary)",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "miabos-spin 0.7s linear infinite",
      }}
    />
  );
}
