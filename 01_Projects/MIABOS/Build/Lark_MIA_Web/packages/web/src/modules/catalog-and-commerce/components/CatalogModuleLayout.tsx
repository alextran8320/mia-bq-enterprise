import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
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
  Boxes,
  Box,
  CircleDollarSign,
  Clock3,
  Package,
  Search,
  ShieldAlert,
  Sparkles,
  TicketPercent,
  Warehouse,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/shared/ui";
import {
  CATALOG_QUICK_QUERIES,
  getCatalogOverviewMetrics,
  getCatalogRecordById,
  searchCatalog,
  type BranchFilter,
  type CatalogSearchFilters,
  type CatalogSearchResult,
  type CatalogSummaryTone,
  type CatalogWarningState,
  type ChannelFilter,
  type StoreTypeFilter,
} from "@/mocks/catalog/catalog";

const CHANNEL_OPTIONS: Array<{ value: ChannelFilter; label: string }> = [
  { value: "all", label: "Mọi kênh" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "store", label: "Cửa hàng" },
  { value: "dealer", label: "Đại lý" },
];

const STORE_TYPE_OPTIONS: Array<{ value: StoreTypeFilter; label: string }> = [
  { value: "all", label: "Mọi loại cửa hàng" },
  { value: "official", label: "Chính hãng" },
  { value: "dealer", label: "Đại lý / đối tác" },
];

const BRANCH_OPTIONS: Array<{ value: BranchFilter; label: string }> = [
  { value: "all", label: "Mọi điểm bán" },
  { value: "kho_tan_binh", label: "Kho Tân Bình" },
  { value: "flagship_q1", label: "Flagship Q1" },
  { value: "vincom_thu_duc", label: "Vincom Thủ Đức" },
  { value: "showroom_da_nang", label: "Showroom Đà Nẵng" },
];

const PAGE_TABS = [
  { to: "/catalog/products", label: "Sản phẩm", icon: Package },
  { to: "/catalog/inventory", label: "Tồn kho", icon: Warehouse },
  { to: "/catalog/pricing", label: "Giá bán", icon: CircleDollarSign },
  { to: "/catalog/promotions", label: "Khuyến mãi", icon: TicketPercent },
] as const;

const SOURCE_CARDS = [
  {
    label: "SAP B1",
    note: "Danh mục và dữ liệu tổng",
    color: "var(--color-primary)",
    bg: "rgba(47, 100, 246, 0.1)",
  },
  {
    label: "Haravan",
    note: "Kênh online và bán web",
    color: "#0F766E",
    bg: "#CCFBF1",
  },
  {
    label: "KiotViet",
    note: "Cửa hàng và POS",
    color: "#7C3AED",
    bg: "#F3E8FF",
  },
  {
    label: "Chính sách",
    note: "Điều kiện giá và ưu đãi",
    color: "#C2410C",
    bg: "#FFEDD5",
  },
] as const;

export const WARNING_STYLES: Record<
  Exclude<CatalogWarningState, "none">,
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
  needs_review: { label: "Cần review", color: "#C2410C", bg: "#FFEDD5" },
};

export const SUMMARY_TONES: Record<CatalogSummaryTone, CSSProperties> = {
  default: { color: "var(--color-text-primary)" },
  success: { color: "var(--color-success)" },
  warning: { color: "var(--color-warning)" },
  danger: { color: "var(--color-error)" },
};

export interface CatalogOutletContext {
  result: CatalogSearchResult;
  filters: CatalogSearchFilters;
  selectedId: string | null;
  setSelectedId: (value: string | null) => void;
  selectedRecordId: string | null;
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

export function WarningBanner({
  warningState,
  customText,
}: {
  warningState: CatalogWarningState;
  customText?: string;
}) {
  if (warningState === "none") {
    return null;
  }

  const config = {
    stale: {
      icon: <Clock3 size={16} />,
      text: "Dữ liệu đang cũ hơn ngưỡng tin cậy. Nên xác nhận lại trước khi tư vấn hoặc chốt xử lý.",
    },
    conflict: {
      icon: <ArrowRightLeft size={16} />,
      text: "Các nguồn đang cho kết quả chưa đồng nhất. Không nên kết luận nếu chưa đối soát thêm.",
    },
    restricted: {
      icon: <ShieldAlert size={16} />,
      text: "Một phần thông tin đã bị ẩn theo vai trò hiện tại. Chỉ hiển thị các nội dung phù hợp để tư vấn.",
    },
    needs_review: {
      icon: <AlertTriangle size={16} />,
      text: "Trường hợp này nên review nhanh với bộ phận phụ trách trước khi phản hồi khách hoặc cửa hàng.",
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

export function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "144px 1fr",
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

export function EmptyResultCard({
  result,
  appliedQuery,
}: {
  result: CatalogSearchResult;
  appliedQuery: string;
}) {
  if (result.kind !== "not_found") {
    return null;
  }

  return (
    <Card>
      <Eyebrow>Không tìm thấy</Eyebrow>
      <h2
        style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-2)" }}
      >
        Không có dữ liệu phù hợp với ngữ cảnh hiện tại
      </h2>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-4)",
        }}
      >
        Truy vấn{" "}
        <span style={{ fontFamily: "var(--font-mono)" }}>
          {appliedQuery || "(trống)"}
        </span>{" "}
        chưa khớp với dữ liệu hiện có hoặc đang bị giới hạn bởi bộ lọc.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        {result.suggestions.map((suggestion) => (
          <Badge
            key={suggestion}
            label={suggestion}
            color="var(--color-text-secondary)"
            bg="var(--color-bg-surface)"
          />
        ))}
      </div>
    </Card>
  );
}

export function useCatalogContext() {
  return useOutletContext<CatalogOutletContext>();
}

function SearchHint({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-3)",
        alignItems: "flex-start",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "rgba(255,255,255,0.78)",
      }}
    >
      <div
        style={{ display: "flex", color: "var(--color-primary)", marginTop: 2 }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
          {title}
        </div>
        <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
          {text}
        </div>
      </div>
    </div>
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

function ResultSummary({
  result,
  appliedQuery,
  pathname,
}: {
  result: CatalogSearchResult;
  appliedQuery: string;
  pathname: string;
}) {
  if (result.kind !== "found") {
    return null;
  }

  const currentPageLabel =
    PAGE_TABS.find((tab) => pathname.startsWith(tab.to))?.label ?? "Danh mục";

  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        flexWrap: "wrap",
      }}
    >
      <div>
        <Eyebrow>Tổng quan kết quả</Eyebrow>
        <h3
          style={{
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-1)",
          }}
        >
          {currentPageLabel}
        </h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
          {appliedQuery.trim().length === 0
            ? "Đang hiển thị danh mục nổi bật để đội ngũ bán hàng và vận hành tra cứu nhanh."
            : `Tìm thấy ${result.records.length} kết quả cho truy vấn "${appliedQuery}".`}
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        <Badge
          label={`${result.records.length} sản phẩm`}
          color="var(--color-primary)"
          bg="var(--color-primary-light)"
        />
        <Badge
          label="Đối chiếu nhiều nguồn"
          color="var(--color-text-secondary)"
          bg="var(--color-bg-surface)"
        />
        <Badge label="Có lịch sử cập nhật" color="#0F766E" bg="#CCFBF1" />
      </div>
    </Card>
  );
}

function SourceCard({
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
        minWidth: 128,
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

export function CatalogModuleLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const filters = useMemo<CatalogSearchFilters>(
    () => ({
      query: searchParams.get("q") ?? "",
      channel: (searchParams.get("channel") as ChannelFilter) ?? "all",
      storeType: (searchParams.get("storeType") as StoreTypeFilter) ?? "all",
      branch: (searchParams.get("branch") as BranchFilter) ?? "all",
    }),
    [searchParams],
  );

  const [draftQuery, setDraftQuery] = useState(filters.query);
  const result = useMemo(() => searchCatalog(filters), [filters]);
  const records = result.kind === "found" ? result.records : [];
  const metrics = useMemo(() => getCatalogOverviewMetrics(records), [records]);

  const [selectedId, setSelectedId] = useState<string | null>(
    records[0]?.id ?? null,
  );

  useEffect(() => {
    setDraftQuery(filters.query);
  }, [filters.query]);

  useEffect(() => {
    if (result.kind !== "found") {
      setSelectedId(null);
      return;
    }

    const stillExists = result.records.some(
      (record) => record.id === selectedId,
    );
    if (!stillExists) {
      setSelectedId(result.records[0]?.id ?? null);
    }
  }, [result, selectedId]);

  const selectedRecordId =
    result.kind === "found"
      ? (selectedId ?? result.records[0]?.id ?? null)
      : null;

  const selectedRecord = getCatalogRecordById(selectedRecordId);

  const setFilter = (
    key: "q" | "channel" | "storeType" | "branch",
    value: string,
  ) => {
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

  if (location.pathname === "/catalog") {
    return <Navigate to="/catalog/products" replace />;
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
            "linear-gradient(135deg, rgba(47, 100, 246, 0.09) 0%, rgba(255, 255, 255, 1) 46%, rgba(245, 251, 255, 1) 100%)",
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
            <Eyebrow>Danh mục & thương mại</Eyebrow>
            <h1
              style={{
                marginTop: "var(--space-2)",
                marginBottom: "var(--space-2)",
              }}
            >
              Tra cứu sản phẩm, tồn kho, giá bán và khuyến mãi
            </h1>
            <p style={{ color: "var(--color-text-secondary)", maxWidth: 700 }}>
              Tổng hợp thông tin cần thiết để tư vấn bán hàng, kiểm tra tồn tại
              điểm bán, xem giá áp dụng và theo dõi chương trình khuyến mãi theo
              từng kênh.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))",
              gridAutoRows: "1fr",
              gap: "var(--space-3)",
              flex: "1 1 420px",
              maxWidth: 620,
            }}
          >
            {SOURCE_CARDS.map((item) => (
              <SourceCard
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
              placeholder="Nhập SKU, barcode, tên sản phẩm, bộ sưu tập..."
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              style={{ flex: "1 1 380px", minWidth: 280 }}
            />
            <Button type="submit">
              <Search size={16} /> Tra cứu
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            <SearchHint
              icon={<Box size={16} />}
              title="SKU, barcode hoặc tên sản phẩm"
              text="Tra cứu nhanh theo mã chuẩn, barcode, tên sản phẩm hoặc biến thể size màu."
            />
            <SearchHint
              icon={<Boxes size={16} />}
              title="Lọc theo kênh và điểm bán"
              text="Dùng thêm bộ lọc kênh, loại cửa hàng và điểm bán để thu hẹp kết quả."
            />
            <SearchHint
              icon={<Sparkles size={16} />}
              title="Nguồn dữ liệu và cập nhật"
              text="Mỗi kết quả đều thể hiện nguồn tham chiếu, thời điểm cập nhật và lưu ý cần biết."
            />
          </div>

          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
          >
            {CATALOG_QUICK_QUERIES.map((item) => (
              <Button
                key={item.query}
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
              label="Kênh"
              options={CHANNEL_OPTIONS}
              value={filters.channel}
              onChange={(value) => setFilter("channel", value)}
            />
            <FilterChipGroup
              label="Loại cửa hàng"
              options={STORE_TYPE_OPTIONS}
              value={filters.storeType}
              onChange={(value) => setFilter("storeType", value)}
            />
            <FilterChipGroup
              label="Điểm bán / kho"
              options={BRANCH_OPTIONS}
              value={filters.branch}
              onChange={(value) => setFilter("branch", value)}
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
                ...SUMMARY_TONES[metric.tone],
              }}
            >
              {metric.value}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: "var(--space-3)" }}>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
        >
          {PAGE_TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={{
                pathname: to,
                search:
                  searchParams.toString().length > 0
                    ? `?${searchParams.toString()}`
                    : "",
              }}
              style={({ isActive }) => ({
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                borderRadius: "var(--radius-pill)",
                padding: "10px 16px",
                textDecoration: "none",
                fontWeight: 500,
                color: isActive
                  ? "var(--color-primary)"
                  : "var(--color-text-secondary)",
                background: isActive
                  ? "var(--color-primary-light)"
                  : "transparent",
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </Card>

      <ResultSummary
        result={result}
        appliedQuery={filters.query}
        pathname={location.pathname}
      />

      <Outlet
        context={{
          result,
          filters,
          selectedId,
          setSelectedId,
          selectedRecordId: selectedRecord?.id ?? null,
        }}
      />
    </div>
  );
}
