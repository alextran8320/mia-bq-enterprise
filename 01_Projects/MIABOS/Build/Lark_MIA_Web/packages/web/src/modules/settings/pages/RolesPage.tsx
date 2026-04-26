import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Badge, Card } from "@/shared/ui";
import { roleApi, type RoleEntry } from "@/shared/api/roleApi";
import { getApiErrorMessage } from "@/shared/auth/apiClient";

const ROLE_BADGE: Record<string, { color: string; bg: string }> = {
  admin: { color: "#7C3AED", bg: "#F3E8FF" },
  manager: { color: "var(--color-warning)", bg: "#FEF3C7" },
  staff: { color: "var(--color-success)", bg: "#DCFCE7" },
};

export function RolesPage() {
  const [roles, setRoles] = useState<RoleEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    roleApi
      .list()
      .then((res) => {
        if (!cancelled) setRoles(res.roles);
      })
      .catch((err) => {
        if (!cancelled)
          setError(getApiErrorMessage(err, "Không tải được danh sách role"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: "0 0 4px" }}>Vai trò & Quyền</h1>
        <p
          style={{
            margin: 0,
            color: "var(--color-text-secondary)",
            fontSize: 13,
          }}
        >
          Danh sách role của hệ thống. Để chỉnh chi tiết permission code, sửa
          file <code>db/seed.ts</code> rồi chạy <code>npm run db:seed</code>.
        </p>
      </div>

      <div style={{ position: "relative", maxWidth: 320 }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-tertiary)",
          }}
        />
        <input
          placeholder="Tìm role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "var(--font-primary)",
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
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

      {loading ? (
        <div style={{ padding: 40, color: "var(--color-text-secondary)" }}>
          Đang tải…
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filtered.map((r) => {
            const s = ROLE_BADGE[r.name] ?? {
              color: "var(--color-text-secondary)",
              bg: "var(--color-bg-surface)",
            };
            return (
              <Card key={r.id} style={{ padding: 20 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <Badge label={r.name} color={s.color} bg={s.bg} />
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: 13,
                    }}
                  >
                    {r.description ?? "—"}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    {r.permissions.length} quyền
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {r.permissions.length === 0 ? (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      Chưa có permission nào
                    </span>
                  ) : (
                    r.permissions.map((code) => (
                      <span
                        key={code}
                        style={{
                          padding: "3px 8px",
                          background: "var(--color-bg-page)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 4,
                          fontSize: 11,
                          fontFamily: "var(--font-mono, monospace)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {code}
                      </span>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
