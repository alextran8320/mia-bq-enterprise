import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Badge, Card, DataTable, Input } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import {
  ESCALATION_RECORDS,
  type EscalationRecord,
} from "@/mocks/operations/operations";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang xử lý": { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  "Chờ phân công": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đã giải quyết": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần đối soát": { color: "var(--color-error)", bg: "#FFE4E6" },
};

const DOMAIN_STYLES: Record<string, { color: string; bg: string }> = {
  inventory: { color: "#0F766E", bg: "#CCFBF1" },
  pricing: { color: "#7C3AED", bg: "#F3E8FF" },
  policy: { color: "#C2410C", bg: "#FFEDD5" },
  customer: { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
};

const DOMAIN_LABELS: Record<string, string> = {
  inventory: "Tồn kho",
  pricing: "Giá",
  policy: "Chính sách",
  customer: "Khách hàng",
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
type DomainFilter = "all" | "inventory" | "pricing" | "policy" | "customer";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang xử lý" },
  { value: "attention", label: "Cần chú ý" },
  { value: "resolved", label: "Đã xử lý" },
];

const DOMAIN_FILTERS: { value: DomainFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "inventory", label: "Tồn kho" },
  { value: "pricing", label: "Giá" },
  { value: "policy", label: "Chính sách" },
  { value: "customer", label: "Khách hàng" },
];

const columns: Column<EscalationRecord>[] = [
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
          {r.subject}
        </div>
      </div>
    ),
    width: "26%",
  },
  {
    key: "domain",
    header: "Lĩnh vực",
    render: (r) => {
      const s = DOMAIN_STYLES[r.domain] ?? { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" };
      return <Badge label={DOMAIN_LABELS[r.domain] ?? r.domain} color={s.color} bg={s.bg} />;
    },
  },
  {
    key: "actor",
    header: "Người tạo",
    render: (r) => <span style={{ fontSize: "13px" }}>{r.actor}</span>,
  },
  {
    key: "assignee",
    header: "Phân công",
    render: (r) => <span style={{ fontSize: "13px" }}>{r.assignee}</span>,
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
    key: "ageLabel",
    header: "Tuổi ticket",
    render: (r) => (
      <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
        {r.ageLabel}
      </span>
    ),
  },
];

function normalize(v: string) {
  return v.trim().toLowerCase();
}

export function EscalationQueuePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");
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

  const records = ESCALATION_RECORDS.filter((r) => {
    if (statusFilter !== "all" && r.statusGroup !== statusFilter) return false;
    if (domainFilter !== "all" && r.domain !== domainFilter) return false;
    if (debouncedSearch.trim()) {
      const kw = normalize(debouncedSearch);
      const haystack = [r.id, r.subject, r.assignee, r.actor, r.domain, ...r.tags].map(normalize);
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
          Hàng đợi xử lý
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
          placeholder="Tìm mã ticket, chủ đề, người tạo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />

        <FilterSelect
          value={statusFilter}
          options={STATUS_FILTERS}
          onChange={setStatusFilter}
        />

        <FilterSelect
          value={domainFilter}
          options={DOMAIN_FILTERS}
          onChange={setDomainFilter}
        />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={records}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/operations/escalations/${r.id}`)}
        />
      </Card>
    </div>
  );
}
