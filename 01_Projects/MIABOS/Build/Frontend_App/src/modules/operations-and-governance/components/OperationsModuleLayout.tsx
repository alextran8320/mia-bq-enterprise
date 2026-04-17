import {
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import {
  AlertTriangle,
  ArrowRightLeft,
  CircleAlert,
  Clock3,
  LayoutDashboard,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/shared/ui";
import {
  OPERATIONS_QUICK_QUERIES,
  getOperationsOverviewMetrics,
  getOperationsPageSummary,
  type OperationsDomain,
  type OperationsFilterStatus,
  type OperationsFilters,
  type OperationsMetricTone,
  type OperationsWarningState,
} from "@/mocks/operations/operations";

const STATUS_OPTIONS: Array<{ value: OperationsFilterStatus; label: string }> =
  [
    { value: "all", label: "Mọi trạng thái" },
    { value: "attention", label: "Cần chú ý" },
    { value: "active", label: "Đang vận hành" },
    { value: "resolved", label: "Đã xử lý" },
  ];

const DOMAIN_OPTIONS: Array<{ value: OperationsDomain; label: string }> = [
  { value: "all", label: "Mọi domain" },
  { value: "inventory", label: "Tồn kho" },
  { value: "pricing", label: "Giá bán" },
  { value: "policy", label: "Chính sách" },
  { value: "customer", label: "Khách hàng" },
  { value: "access", label: "Quyền truy cập" },
  { value: "integration", label: "Tích hợp" },
];

const PAGE_TABS = [
  {
    to: "/operations/escalations",
    label: "Escalation Queue",
    icon: CircleAlert,
  },
  { to: "/operations/users-roles", label: "Users And Roles", icon: Users },
  { to: "/operations/scope-rules", label: "Scope Rules", icon: ShieldAlert },
  {
    to: "/operations/integration-ops",
    label: "Integration Ops",
    icon: LayoutDashboard,
  },
  {
    to: "/operations/source-mapping",
    label: "Source Mapping",
    icon: ArrowRightLeft,
  },
] as const;

const SURFACE_CARDS = [
  {
    label: "Quyền & phạm vi",
    note: "Vai trò, chi nhánh, kênh và mức nhạy cảm.",
    color: "#0F4C81",
    bg: "rgba(47, 100, 246, 0.1)",
  },
  {
    label: "Workflow",
    note: "Escalation, assignment và hàng đợi xử lý.",
    color: "#9A3412",
    bg: "#FFEDD5",
  },
  {
    label: "Tích hợp",
    note: "Retry queue, dead-letter và health của connector.",
    color: "#0F766E",
    bg: "#CCFBF1",
  },
  {
    label: "Mapping",
    note: "Canonical key và rule ưu tiên nguồn dữ liệu.",
    color: "#7C3AED",
    bg: "#F3E8FF",
  },
] as const;

export const WARNING_STYLES: Record<
  Exclude<OperationsWarningState, "none">,
  { label: string; color: string; bg: string }
> = {
  attention: {
    label: "Cần chú ý",
    color: "var(--color-warning)",
    bg: "#FFF7ED",
  },
  blocked: { label: "Đang chặn", color: "var(--color-error)", bg: "#FFE4E6" },
  restricted: { label: "Giới hạn quyền", color: "#7C3AED", bg: "#F3E8FF" },
};

export const METRIC_TONES: Record<OperationsMetricTone, CSSProperties> = {
  default: { color: "var(--color-text-primary)" },
  success: { color: "var(--color-success)" },
  warning: { color: "var(--color-warning)" },
  danger: { color: "var(--color-error)" },
};

export interface OperationsOutletContext {
  filters: OperationsFilters;
}

export function useOperationsContext() {
  return useOutletContext<OperationsOutletContext>();
}

export function Eyebrow({ children }: { children: string }) {
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

export function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "148px 1fr",
        gap: "var(--space-3)",
        alignItems: "start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "12px",
          color: "var(--color-text-tertiary)",
        }}
      >
        <span style={{ display: "flex" }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export function WarningBanner({
  warningState,
  customText,
}: {
  warningState: OperationsWarningState;
  customText?: string;
}) {
  if (warningState === "none") {
    return null;
  }

  const config = {
    attention: {
      icon: <Clock3 size={16} />,
      text: "Trường hợp này cần được theo dõi sát hơn vì đang có độ trễ, độ lệch hoặc rule chưa phủ đủ.",
    },
    blocked: {
      icon: <AlertTriangle size={16} />,
      text: "Luồng hiện tại đang bị chặn bởi xung đột dữ liệu, lỗi kết nối hoặc thiếu điều kiện để kết luận an toàn.",
    },
    restricted: {
      icon: <ShieldAlert size={16} />,
      text: "Thông tin đang hiển thị theo phạm vi quyền hiện tại; một số chi tiết nhạy cảm đã được ẩn bớt.",
    },
  }[warningState];

  const style = WARNING_STYLES[warningState];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "var(--radius-md)",
        background: style.bg,
        color: style.color,
      }}
    >
      <div style={{ display: "flex", marginTop: 2 }}>{config.icon}</div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
          {style.label}
        </div>
        <div style={{ fontSize: "13px", lineHeight: 1.6 }}>
          {customText ?? config.text}
        </div>
      </div>
    </div>
  );
}

export function EmptyResultCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <Eyebrow>Không có dữ liệu phù hợp</Eyebrow>
      <h2
        style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}
      >
        {title}
      </h2>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 560 }}>
        {description}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginTop: "var(--space-4)",
        }}
      >
        {OPERATIONS_QUICK_QUERIES.map((item) => (
          <Badge
            key={item.label}
            label={item.label}
            color="var(--color-text-secondary)"
            bg="var(--color-bg-surface)"
          />
        ))}
      </div>
    </Card>
  );
}

function FilterChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={option.value === value ? "primary" : "secondary"}
            onClick={() => onChange(option.value)}
            style={{ padding: "8px 14px", fontSize: "12px" }}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SearchHint({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "rgba(255,255,255,0.78)",
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
        {text}
      </div>
    </div>
  );
}

function SurfaceCard({
  label,
  note,
  color,
  bg,
}: {
  label: string;
  note: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        minWidth: 132,
        height: "100%",
        padding: "14px 16px",
        borderRadius: "var(--radius-lg)",
        background: bg,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: 700, color }}>{label}</div>
      <div
        style={{
          fontSize: "12px",
          lineHeight: 1.5,
          color: "var(--color-text-secondary)",
        }}
      >
        {note}
      </div>
    </div>
  );
}

function ResultSummary({
  pathname,
  filters,
}: {
  pathname: string;
  filters: OperationsFilters;
}) {
  const summary = getOperationsPageSummary(pathname, filters);

  return (
    <Card
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <div>
        <Eyebrow>Tổng quan trang</Eyebrow>
        <h3
          style={{
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-1)",
          }}
        >
          {summary.title}
        </h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "13px",
            maxWidth: 620,
          }}
        >
          {summary.description}
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        <Badge
          label={`${summary.count} ${summary.countLabel}`}
          color="var(--color-primary)"
          bg="var(--color-primary-light)"
        />
        {summary.badges.map((item) => (
          <Badge
            key={item}
            label={item}
            color="var(--color-text-secondary)"
            bg="var(--color-bg-surface)"
          />
        ))}
      </div>
    </Card>
  );
}

export function OperationsModuleLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const filters = useMemo<OperationsFilters>(
    () => ({
      query: searchParams.get("q") ?? "",
      status: (searchParams.get("status") as OperationsFilterStatus) ?? "all",
      domain: (searchParams.get("domain") as OperationsDomain) ?? "all",
    }),
    [searchParams],
  );

  const [draftQuery, setDraftQuery] = useState(filters.query);
  const metrics = useMemo(
    () => getOperationsOverviewMetrics(filters),
    [filters],
  );

  const setFilter = (key: "q" | "status" | "domain", value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value.length === 0 || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilter("q", draftQuery.trim());
  };

  if (location.pathname === "/operations") {
    return <Navigate to="/operations/escalations" replace />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <Card
        style={{
          background:
            "linear-gradient(135deg, rgba(244, 114, 76, 0.11) 0%, rgba(255, 255, 255, 1) 44%, rgba(255, 250, 245, 1) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            marginBottom: "var(--space-5)",
          }}
        >
          <div>
            <Eyebrow>Operations & governance</Eyebrow>
            <h1
              style={{
                marginTop: "var(--space-2)",
                marginBottom: "var(--space-2)",
              }}
            >
              Kiểm soát quyền truy cập, workflow và tình trạng vận hành
            </h1>
            <p style={{ color: "var(--color-text-secondary)", maxWidth: 700 }}>
              Dành cho Admin, Ops, PM và Tech Ops để theo dõi escalation, quản
              trị vai trò, kiểm soát rule nhạy cảm và xử lý các vấn đề tích hợp
              hoặc mapping đa nguồn.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
              gridAutoRows: "1fr",
              gap: "var(--space-3)",
              flex: "1 1 460px",
              maxWidth: 660,
            }}
          >
            {SURFACE_CARDS.map((item) => (
              <SurfaceCard
                key={item.label}
                label={item.label}
                note={item.note}
                color={item.color}
                bg={item.bg}
              />
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Input
              icon={<Search size={16} />}
              placeholder="Tìm escalation, user, rule, connector hoặc canonical key..."
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              style={{ flex: "1 1 420px", minWidth: 280 }}
            />
            <Button type="submit">
              <Search size={16} /> Tra cứu
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            <SearchHint
              title="Quyền và vai trò"
              text="Tra cứu user scope, role matrix và các profile cần rà soát thêm."
            />
            <SearchHint
              title="Workflow và escalation"
              text="Theo dõi ticket đang mở, SLA xử lý và fallback queue khi cần."
            />
            <SearchHint
              title="Tích hợp và mapping"
              text="Xem connector health, retry queue và các conflict cần đối soát."
            />
          </div>

          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
          >
            {OPERATIONS_QUICK_QUERIES.map((item) => (
              <Button
                key={item.label}
                type="button"
                variant="secondary"
                onClick={() => {
                  setDraftQuery(item.query);
                  setFilter("q", item.query);
                }}
                style={{ padding: "8px 14px", fontSize: "12px" }}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <FilterChipGroup
              label="Trạng thái"
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={(value) => setFilter("status", value)}
            />
            <FilterChipGroup
              label="Domain"
              options={DOMAIN_OPTIONS}
              value={filters.domain}
              onChange={(value) => setFilter("domain", value)}
            />
          </div>
        </form>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <Eyebrow>{metric.label}</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-2)",
                fontSize: "24px",
                fontWeight: 700,
                ...METRIC_TONES[metric.tone],
              }}
            >
              {metric.value}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {PAGE_TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) => ({
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "10px 16px",
              borderRadius: "var(--radius-pill)",
              textDecoration: "none",
              color: isActive ? "#fff" : "var(--color-text-secondary)",
              background: isActive
                ? "linear-gradient(135deg, #C2410C, #EA580C)"
                : "var(--color-bg-surface)",
              boxShadow: isActive
                ? "0 12px 22px rgba(194, 65, 12, 0.2)"
                : "none",
              fontWeight: 500,
              fontSize: "13px",
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      <ResultSummary pathname={location.pathname} filters={filters} />

      <Outlet context={{ filters }} />
    </div>
  );
}
