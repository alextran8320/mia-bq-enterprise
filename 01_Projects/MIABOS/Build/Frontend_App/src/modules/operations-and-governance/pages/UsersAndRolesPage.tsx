import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Badge, Card, DataTable, Input } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import {
  USER_SCOPE_PROFILES,
  type UserScopeProfile,
} from "@/mocks/operations/operations";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang áp dụng": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần rà soát": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Giới hạn quyền": { color: "#7C3AED", bg: "#F3E8FF" },
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
            zIndex: 10,
            background: "#fff",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
            minWidth: "100%",
            padding: "4px 0",
            overflow: "hidden",
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
                padding: "10px 16px",
                border: "none",
                background: opt.value === value ? "var(--color-bg-page)" : "transparent",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                fontFamily: "var(--font-primary)",
                fontWeight: opt.value === value ? 600 : 400,
                textAlign: "left",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value)
                  e.currentTarget.style.background = "var(--color-bg-page)";
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type StatusFilter = "all" | "active" | "attention" | "resolved";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Hoạt động" },
  { value: "attention", label: "Cần chú ý" },
  { value: "resolved", label: "Đã xử lý" },
];

const columns: Column<UserScopeProfile>[] = [
  {
    key: "id",
    header: "Mã",
    render: (r) => (
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          {r.id}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginTop: 2,
          }}
        >
          {r.name}
        </div>
      </div>
    ),
    width: "22%",
  },
  {
    key: "role",
    header: "Vai trò",
    render: (r) => <span style={{ fontSize: "13px" }}>{r.role}</span>,
  },
  {
    key: "ownerTeam",
    header: "Đội",
    render: (r) => <span style={{ fontSize: "13px" }}>{r.ownerTeam}</span>,
  },
  {
    key: "branchSummary",
    header: "Phạm vi chi nhánh",
    render: (r) => (
      <span style={{ fontSize: "13px" }}>{r.branchSummary}</span>
    ),
  },
  {
    key: "statusLabel",
    header: "Trạng thái",
    render: (r) => {
      const s = STATUS_STYLES[r.statusLabel] ?? { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" };
      return <Badge label={r.statusLabel} color={s.color} bg={s.bg} />;
    },
  },
  {
    key: "updatedAt",
    header: "Cập nhật",
    render: (r) => (
      <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
        {r.updatedAt}
      </span>
    ),
  },
];

function normalize(v: string) {
  return v.trim().toLowerCase();
}

export function UsersAndRolesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const records = USER_SCOPE_PROFILES.filter((r) => {
    if (statusFilter !== "all" && r.statusGroup !== statusFilter) return false;
    if (debouncedSearch.trim()) {
      const kw = normalize(debouncedSearch);
      const haystack = [r.id, r.name, r.role, r.ownerTeam, r.branchSummary, ...r.modes].map(normalize);
      if (!haystack.some((h) => h.includes(kw))) return false;
    }
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
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
          placeholder="Tìm tên, vai trò, đội..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />

        <FilterSelect
          value={statusFilter}
          options={STATUS_FILTERS}
          onChange={setStatusFilter}
        />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={records}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/operations/users-roles/${r.id}`)}
        />
      </Card>
    </div>
  );
}
