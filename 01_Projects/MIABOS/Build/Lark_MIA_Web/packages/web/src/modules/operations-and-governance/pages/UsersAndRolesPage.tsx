import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Badge, Card, DataTable, Input } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { userApi, type UserSummary } from "@/shared/api/userApi";
import { getApiErrorMessage } from "@/shared/auth/apiClient";

const ROLE_STYLES: Record<string, { color: string; bg: string }> = {
  admin: { color: "#7C3AED", bg: "#F3E8FF" },
  manager: { color: "var(--color-warning)", bg: "#FEF3C7" },
  staff: { color: "var(--color-success)", bg: "#DCFCE7" },
};

function Eyebrow({ children }: { children: string }) {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 500,
        color: "var(--color-text-tertiary)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </span>
  );
}

function FilterSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderRadius: "var(--radius-sm)",
          border: open ? "1.5px solid var(--color-text-primary)" : "1.5px solid transparent",
          background: "var(--color-bg-card)",
          color: "var(--color-text-primary)",
          fontSize: "14px",
          fontFamily: "var(--font-primary)",
          fontWeight: 400,
          cursor: "pointer",
          boxShadow: "var(--shadow-ambient)",
          minWidth: 140,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>{selectedLabel}</span>
        {open ? (
          <ChevronUp size={16} color="var(--color-text-tertiary)" />
        ) : (
          <ChevronDown size={16} color="var(--color-text-tertiary)" />
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 20,
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            boxShadow: "var(--shadow-elevated)",
            minWidth: 180,
            padding: 4,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                background: opt.value === value ? "var(--color-bg-page)" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                textAlign: "left",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-primary)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-page)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  opt.value === value ? "var(--color-bg-page)" : "transparent")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type RoleFilter = "all" | "admin" | "manager" | "staff";
type ActiveFilter = "all" | "active" | "inactive";

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Tất cả role" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

const ACTIVE_FILTERS: { value: ActiveFilter; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã khoá" },
];

export function UsersAndRolesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [items, setItems] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    userApi
      .list({
        q: debouncedSearch || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        active:
          activeFilter === "all" ? undefined : activeFilter === "active",
      })
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Không tải được danh sách người dùng"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, roleFilter, activeFilter]);

  const columns: Column<UserSummary>[] = [
    {
      key: "email",
      header: "Email",
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>
            {r.fullName ?? "—"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              marginTop: 2,
            }}
          >
            {r.email}
          </div>
        </div>
      ),
      width: "30%",
    },
    {
      key: "role",
      header: "Role",
      render: (r) => {
        const s = ROLE_STYLES[r.role] ?? {
          color: "var(--color-text-secondary)",
          bg: "var(--color-bg-surface)",
        };
        return <Badge label={r.role} color={s.color} bg={s.bg} />;
      },
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (r) =>
        r.isActive ? (
          <Badge label="Hoạt động" color="var(--color-success)" bg="#DCFCE7" />
        ) : (
          <Badge label="Khoá" color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
        ),
    },
    {
      key: "hasLarkBinding",
      header: "Lark",
      render: (r) =>
        r.hasLarkBinding ? (
          <Badge label="Đã liên kết" color="#2F64F6" bg="#EAF1FE" />
        ) : (
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>—</span>
        ),
    },
    {
      key: "updatedAt",
      header: "Cập nhật",
      render: (r) => (
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
          {new Date(r.updatedAt).toLocaleString("vi-VN")}
        </span>
      ),
    },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
    >
      <div style={{ marginBottom: "var(--space-2)" }}>
        <Eyebrow>Vận hành</Eyebrow>
        <h1 style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>
          Người dùng & Vai trò
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Input
          icon={<Search size={16} />}
          placeholder="Tìm theo tên hoặc email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />
        <FilterSelect
          value={roleFilter}
          options={ROLE_FILTERS}
          onChange={setRoleFilter}
        />
        <FilterSelect
          value={activeFilter}
          options={ACTIVE_FILTERS}
          onChange={setActiveFilter}
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

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--color-text-secondary)",
              fontSize: 13,
            }}
          >
            Đang tải…
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            rowKey={(r) => r.id}
            onRowClick={(r) => navigate(`/operations/users-roles/${r.id}`)}
          />
        )}
      </Card>
    </div>
  );
}
