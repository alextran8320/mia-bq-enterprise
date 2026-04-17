import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  DollarSign,
  Package,
  Search,
} from "lucide-react";
import { Badge, Card, DataTable, Input } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import {
  getOrderOverviewMetrics,
  searchOrders,
  type OrderRecord,
  type OrderSearchResult,
  type OrderSummaryTone,
  type OrderType,
  type OrderWarningState,
} from "@/mocks/orders/orders";

const ORDER_TYPE_STYLES: Record<
  OrderType,
  { label: string; color: string; bg: string }
> = {
  online: {
    label: "Online",
    color: "var(--color-primary)",
    bg: "var(--color-primary-light)",
  },
  pos: { label: "POS", color: "#7C3AED", bg: "#F3E8FF" },
  erp: { label: "ERP / Logistics", color: "#0F766E", bg: "#CCFBF1" },
  returned: { label: "Đổi trả", color: "var(--color-warning)", bg: "#FEF3C7" },
};

const WARNING_STYLES: Record<
  Exclude<OrderWarningState, "none">,
  { label: string; color: string; bg: string }
> = {
  stale: {
    label: "Cần cập nhật",
    color: "var(--color-warning)",
    bg: "#FFF7ED",
  },
  conflict: {
    label: "Cần đối soát",
    color: "var(--color-error)",
    bg: "#FFE4E6",
  },
  restricted: { label: "Giới hạn quyền", color: "#7C3AED", bg: "#F3E8FF" },
};

const SUMMARY_TONES: Record<OrderSummaryTone, CSSProperties> = {
  default: { color: "var(--color-text-primary)" },
  success: { color: "var(--color-success)" },
  warning: { color: "var(--color-warning)" },
  danger: { color: "var(--color-error)" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang giao": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Đã xuất hóa đơn": {
    color: "var(--color-primary)",
    bg: "var(--color-primary-light)",
  },
  "Đang xử lý kho": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đang xử lý đổi trả": { color: "#7C3AED", bg: "#F3E8FF" },
  "Cần review": { color: "var(--color-error)", bg: "#FFE4E6" },
};

const initialResult = searchOrders("");

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

function StatusChip({ label }: { label: string }) {
  const style = STATUS_STYLES[label] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };
  return <Badge label={label} color={style.color} bg={style.bg} />;
}

const METRIC_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  orders: { icon: <Package size={20} />, color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  review: { icon: <AlertTriangle size={20} />, color: "var(--color-error)", bg: "#FFE4E6" },
  stale: { icon: <CircleAlert size={20} />, color: "var(--color-warning)", bg: "#FEF3C7" },
  gmv: { icon: <DollarSign size={20} />, color: "var(--color-success)", bg: "#DCFCE7" },
};

function OverviewMetrics({ result }: { result: OrderSearchResult }) {
  const records = result.kind === "found" ? result.records : [];
  const metrics = getOrderOverviewMetrics(records);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "var(--space-4)",
      }}
    >
      {metrics.map((metric) => {
        const mi = METRIC_ICONS[metric.id];
        return (
          <Card key={metric.id}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-3)",
              }}
            >
              {mi && (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: mi.bg,
                    color: mi.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {mi.icon}
                </div>
              )}
              <div>
                <Eyebrow>{metric.label}</Eyebrow>
                <div
                  style={{
                    marginTop: "var(--space-1)",
                    fontSize: "22px",
                    fontWeight: 700,
                    ...SUMMARY_TONES[metric.tone],
                  }}
                >
                  {metric.value}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
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

/* ── Table columns ── */
const orderColumns: Column<OrderRecord>[] = [
  {
    key: "orderCode",
    header: "Mã đơn",
    render: (o) => (
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          {o.orderCode}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--color-text-secondary)",
            marginTop: 2,
          }}
        >
          {o.customerName}
        </div>
      </div>
    ),
    width: "22%",
  },
  {
    key: "orderType",
    header: "Loại đơn",
    render: (o) => {
      const s = ORDER_TYPE_STYLES[o.orderType];
      return <Badge label={s.label} color={s.color} bg={s.bg} />;
    },
  },
  {
    key: "statusLabel",
    header: "Trạng thái",
    render: (o) => <StatusChip label={o.statusLabel} />,
  },
  {
    key: "orderValue",
    header: "Giá trị",
    render: (o) => (
      <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>
        {o.orderValue.toLocaleString("vi-VN")} đ
      </span>
    ),
  },
  {
    key: "fulfillmentStatus",
    header: "Giao vận",
    render: (o) => (
      <span style={{ fontSize: "13px" }}>{o.fulfillmentStatus}</span>
    ),
  },
  {
    key: "source",
    header: "Nguồn",
    render: (o) => (
      <Badge
        label={o.source}
        color="var(--color-text-secondary)"
        bg="var(--color-bg-surface)"
      />
    ),
  },
  {
    key: "lastUpdated",
    header: "Cập nhật",
    render: (o) => (
      <span
        style={{
          fontSize: "12px",
          color: "var(--color-text-tertiary)",
        }}
      >
        {o.lastUpdated}
      </span>
    ),
  },
  {
    key: "warningState",
    header: "Cảnh báo",
    render: (o) => {
      if (o.warningState === "none") return null;
      const ws = WARNING_STYLES[o.warningState];
      return <Badge label={ws.label} color={ws.color} bg={ws.bg} />;
    },
  },
];

type StatusFilter = "all" | "delivering" | "invoiced" | "warehouse" | "return" | "review";
type TypeFilter = "all" | OrderType;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "delivering", label: "Đang giao" },
  { value: "invoiced", label: "Đã xuất HĐ" },
  { value: "warehouse", label: "Xử lý kho" },
  { value: "return", label: "Đổi trả" },
  { value: "review", label: "Cần review" },
];

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "online", label: "Online" },
  { value: "pos", label: "POS" },
  { value: "erp", label: "ERP" },
  { value: "returned", label: "Đổi trả" },
];

const STATUS_FILTER_MAP: Record<StatusFilter, string | null> = {
  all: null,
  delivering: "Đang giao",
  invoiced: "Đã xuất hóa đơn",
  warehouse: "Đang xử lý kho",
  return: "Đang xử lý đổi trả",
  review: "Cần review",
};

export function OrderSummaryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<OrderSearchResult>(initialResult);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allRecords = result.kind === "found" ? result.records : [];

  const records = allRecords.filter((o) => {
    if (statusFilter !== "all") {
      const expected = STATUS_FILTER_MAP[statusFilter];
      if (expected && o.statusLabel !== expected) return false;
    }
    if (typeFilter !== "all" && o.orderType !== typeFilter) return false;
    return true;
  });

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResult(searchOrders(search));
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div style={{ marginBottom: "var(--space-2)" }}>
        <Eyebrow>Đơn hàng và dịch vụ</Eyebrow>
        <h1 style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>
          Tra cứu đơn hàng
        </h1>
      </div>

      <OverviewMetrics result={result} />

      {/* Filter bar */}
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
          placeholder="Tìm mã đơn, SĐT, tên khách..."
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
          value={typeFilter}
          options={TYPE_FILTERS}
          onChange={setTypeFilter}
        />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={orderColumns}
          data={records}
          rowKey={(o) => o.id}
          onRowClick={(o) => navigate(`/orders/${o.id}`)}
        />
      </Card>
    </div>
  );
}
