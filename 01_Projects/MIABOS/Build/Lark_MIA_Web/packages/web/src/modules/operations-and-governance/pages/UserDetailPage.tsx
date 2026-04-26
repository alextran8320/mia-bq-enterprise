import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { userApi, type UserSummary } from "@/shared/api/userApi";
import { useAuthStore } from "@/shared/auth/authStore";
import { usePermissions, RequirePermission } from "@/shared/auth/permission";
import { getApiErrorMessage } from "@/shared/auth/apiClient";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.user);
  const { has } = usePermissions();
  const canWrite = has("user:write");

  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    userApi
      .get(id)
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch((err) => {
        if (!cancelled)
          setError(getApiErrorMessage(err, "Không tải được thông tin user"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function patchAndRefresh(patch: Parameters<typeof userApi.patch>[1]) {
    if (!id) return;
    setError(null);
    setInfo(null);
    setSaving(true);
    try {
      const updated = await userApi.patch(id, patch);
      setUser(updated);
      setInfo("Đã lưu");
    } catch (err) {
      setError(getApiErrorMessage(err, "Lưu thất bại"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, color: "var(--color-text-secondary)" }}>
        Đang tải…
      </div>
    );
  }
  if (error && !user) {
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => navigate(-1)} variant="tertiary">
          <ArrowLeft size={16} /> Quay lại
        </Button>
        <div
          role="alert"
          style={{
            marginTop: 16,
            padding: 16,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            color: "#991B1B",
          }}
        >
          {error}
        </div>
      </div>
    );
  }
  if (!user) return null;

  const isSelf = me?.id === user.id;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 8px",
            background: "transparent",
            border: "none",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "var(--font-primary)",
          }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
        <h1 style={{ marginTop: 8, marginBottom: 4 }}>
          {user.fullName ?? user.email}
        </h1>
        <div style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
          {user.email}
        </div>
      </div>

      {(error || info) && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            background: error ? "#FEF2F2" : "#ECFDF5",
            border: `1px solid ${error ? "#FECACA" : "#A7F3D0"}`,
            color: error ? "#991B1B" : "#065F46",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {error ?? info}
        </div>
      )}

      <Card style={{ padding: 24 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 16 }}>Thông tin tài khoản</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            rowGap: 14,
            columnGap: 24,
            fontSize: 14,
          }}
        >
          <Label>Email</Label>
          <Value>{user.email}</Value>

          <Label>Họ tên</Label>
          <Value>{user.fullName ?? "—"}</Value>

          <Label>Role</Label>
          <Value>
            {canWrite && !isSelf ? (
              <select
                value={user.role}
                disabled={saving}
                onChange={(e) => patchAndRefresh({ role: e.target.value })}
                style={selectStyle}
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <Badge label={user.role} color="#7C3AED" bg="#F3E8FF" />
            )}
            {isSelf && (
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 11,
                  color: "var(--color-text-tertiary)",
                }}
              >
                (Không thể tự đổi role)
              </span>
            )}
          </Value>

          <Label>Trạng thái</Label>
          <Value>
            {user.isActive ? (
              <Badge
                label="Hoạt động"
                color="var(--color-success)"
                bg="#DCFCE7"
              />
            ) : (
              <Badge
                label="Đã khoá"
                color="var(--color-text-secondary)"
                bg="var(--color-bg-surface)"
              />
            )}
            <RequirePermission code="user:write">
              {!isSelf && (
                <button
                  onClick={() => patchAndRefresh({ isActive: !user.isActive })}
                  disabled={saving}
                  style={{
                    marginLeft: 12,
                    padding: "4px 12px",
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: "var(--font-primary)",
                  }}
                >
                  {user.isActive ? "Khoá tài khoản" : "Mở khoá"}
                </button>
              )}
            </RequirePermission>
          </Value>

          <Label>Liên kết Lark</Label>
          <Value>
            {user.hasLarkBinding ? (
              <Badge label="Đã liên kết" color="#2F64F6" bg="#EAF1FE" />
            ) : (
              <span style={{ color: "var(--color-text-tertiary)" }}>
                Chưa liên kết
              </span>
            )}
          </Value>

          <Label>Ngày tạo</Label>
          <Value>{new Date(user.createdAt).toLocaleString("vi-VN")}</Value>

          <Label>Cập nhật lần cuối</Label>
          <Value>{new Date(user.updatedAt).toLocaleString("vi-VN")}</Value>
        </div>
      </Card>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
      {children}
    </div>
  );
}
function Value({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "var(--color-text-primary)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  fontSize: 13,
  fontFamily: "var(--font-primary)",
  background: "var(--color-bg-card)",
};
