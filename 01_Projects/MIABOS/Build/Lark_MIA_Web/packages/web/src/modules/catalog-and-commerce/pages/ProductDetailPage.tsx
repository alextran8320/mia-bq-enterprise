import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  DollarSign,
  FileText,
  Palette,
  RefreshCw,
  Ruler,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Badge, Button, Card, DataTable } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { getCatalogRecordById } from "@/mocks/catalog/catalog";
import type { CatalogRecord, ProductRelatedOrder } from "@/mocks/catalog/catalog";

/* ── FilterSelect ── */

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
          display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
          borderRadius: 8, border: open ? "1.5px solid #212B36" : "1.5px solid transparent",
          background: "#fff", color: "#212B36", fontSize: 13, fontFamily: "var(--font-primary)",
          fontWeight: 400, cursor: "pointer", boxShadow: "var(--shadow-ambient)", whiteSpace: "nowrap",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>
          <span style={{ color: "#919EAB", fontWeight: 400 }}>{label}: </span>
          {selectedLabel}
        </span>
        {open ? <ChevronUp size={14} color="#919EAB" /> : <ChevronDown size={14} color="#919EAB" />}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 10, background: "#fff", borderRadius: 10, boxShadow: "0 12px 28px -4px rgba(145,158,171,0.2)", minWidth: "100%", padding: 4 }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", borderRadius: 6, background: opt.value === value ? "rgba(47,100,246,0.08)" : "transparent", color: opt.value === value ? "#2F64F6" : "#212B36", fontSize: 13, fontFamily: "var(--font-primary)", fontWeight: opt.value === value ? 600 : 400, textAlign: "left", cursor: "pointer" }}
              onMouseEnter={(e) => { if (opt.value !== value) e.currentTarget.style.background = "rgba(145,158,171,0.08)"; }}
              onMouseLeave={(e) => { if (opt.value !== value) e.currentTarget.style.background = "transparent"; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Inventory table ── */

interface VariantRow {
  key: string;
  variantSku: string;
  location: string;
  color: string;
  size: string;
  available: number;
  status: string;
}

function buildVariantRows(record: CatalogRecord): VariantRow[] {
  const rows: VariantRow[] = [];
  for (const variant of record.variants) {
    for (const loc of record.inventoryLocations) {
      const hash = (variant.sku + loc.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const available = hash % 12;
      const status = available === 0 ? "Hết hàng" : available <= 2 ? "Sắp hết" : "Còn hàng";
      rows.push({ key: `${variant.sku}-${loc.id}`, variantSku: variant.sku, location: loc.name, color: variant.color, size: variant.size, available, status });
    }
  }
  return rows;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "Còn hàng": { color: "#118D57", bg: "#DCFCE7" },
  "Sắp hết": { color: "#B76E00", bg: "#FEF3C7" },
  "Hết hàng": { color: "#B71D18", bg: "#FFE4E6" },
};

const ORDER_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "Đã giao": { color: "#118D57", bg: "#DCFCE7" },
  "Đang giao": { color: "#2F64F6", bg: "#EEF4FF" },
  "Đã hủy": { color: "#B71D18", bg: "#FFE4E6" },
  "Chờ xác nhận": { color: "#B76E00", bg: "#FEF3C7" },
};

const variantColumns: Column<VariantRow>[] = [
  { key: "variantSku", header: "SKU biến thể", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500 }}>{r.variantSku}</span>, width: "22%" },
  { key: "location", header: "Cửa hàng / Kho", render: (r) => <span style={{ fontSize: 13 }}>{r.location}</span> },
  { key: "color", header: "Màu", render: (r) => <span style={{ fontSize: 13 }}>{r.color}</span> },
  { key: "size", header: "Size", render: (r) => <span style={{ fontSize: 13, fontWeight: 500 }}>{r.size}</span> },
  { key: "available", header: "Tồn khả dụng", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>{r.available}</span> },
  {
    key: "status", header: "Trạng thái", render: (r) => {
      const s = STATUS_COLORS[r.status] ?? { color: "#637381", bg: "#F4F6F8" };
      return <Badge label={r.status} color={s.color} bg={s.bg} />;
    },
  },
];

/* ── KPI card ── */

function KpiCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color ? `${color}18` : "var(--color-bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", color: color ?? "var(--color-primary)" }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, color: "#919EAB", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-mono)", color: color ?? "#212B36" }}>{value}</div>
    </Card>
  );
}

/* ── Tab: Chi tiết ── */

function TabDetail({ record }: { record: CatalogRecord }) {
  const allRows = useMemo(() => buildVariantRows(record), [record]);
  const [colorFilter, setColorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const uniqueColors = useMemo(() => new Set(record.variants.map((v) => v.color)), [record]);
  const uniqueSizes = useMemo(() => new Set(record.variants.map((v) => v.size)), [record]);

  const colors = useMemo(() => [{ value: "all", label: "Tất cả" }, ...Array.from(uniqueColors).map((c) => ({ value: c, label: c }))], [uniqueColors]);
  const sizes = useMemo(() => [{ value: "all", label: "Tất cả" }, ...Array.from(uniqueSizes).map((s) => ({ value: s, label: s }))], [uniqueSizes]);
  const locations = useMemo(() => {
    const set = new Set(allRows.map((r) => r.location));
    return [{ value: "all", label: "Tất cả" }, ...Array.from(set).map((l) => ({ value: l, label: l }))];
  }, [allRows]);
  const statuses = [
    { value: "all", label: "Tất cả" },
    { value: "Còn hàng", label: "Còn hàng" },
    { value: "Sắp hết", label: "Sắp hết" },
    { value: "Hết hàng", label: "Hết hàng" },
  ];

  const filteredRows = allRows.filter((r) => {
    if (colorFilter !== "all" && r.color !== colorFilter) return false;
    if (sizeFilter !== "all" && r.size !== sizeFilter) return false;
    if (locationFilter !== "all" && r.location !== locationFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Thống kê bán hàng */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#637381", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>Thống kê</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <KpiCard
            icon={<ShoppingBag size={18} />}
            label="Đã bán ra"
            value={record.unitsSold.toLocaleString("vi-VN")}
            color="#2F64F6"
          />
          <KpiCard
            icon={<TrendingUp size={18} />}
            label="Doanh thu"
            value={`${(record.revenue / 1_000_000).toFixed(1)}M đ`}
            color="#118D57"
          />
          <KpiCard
            icon={<Palette size={18} />}
            label="Màu bán chạy"
            value={record.topSellingColor}
            color="#7C3AED"
          />
          <KpiCard
            icon={<Ruler size={18} />}
            label="Size bán chạy"
            value={record.topSellingSize}
            color="#B76E00"
          />
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#637381", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>Thông tin chi tiết</h3>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
            <div style={{ borderRadius: 12, background: "#F4F6F8", aspectRatio: "1", overflow: "hidden" }}>
              <img src={record.imageUrl} alt={record.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InfoLine label="Tên" value={record.name} />
              <InfoLine label="SKU" value={record.sku} />
              <InfoLine label="Nhóm" value={`${record.industry} / ${record.category}`} />
              <InfoLine label="Chất liệu" value={record.material} />
              <InfoLine label="Bộ sưu tập" value={record.collection} />
              <InfoLine label="Mùa" value={record.season} />
              <InfoLine label="Size range" value={Array.from(uniqueSizes).sort().join(", ")} />
              <InfoLine label="Màu" value={Array.from(uniqueColors).join(", ")} />
              <InfoLine label="Biến thể" value={`${record.variants.length} SKU`} />
              <InfoLine label="Nguồn" value={record.source} />
              <InfoLine label="Cập nhật" value={record.syncedAt} />
              {record.attributes.map((attr) => (
                <InfoLine key={attr.label} label={attr.label} value={attr.value} />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tồn kho */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#637381", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>Tồn kho theo biến thể × cửa hàng</h3>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <FilterSelect label="Màu" value={colorFilter} options={colors} onChange={setColorFilter} />
              <FilterSelect label="Size" value={sizeFilter} options={sizes} onChange={setSizeFilter} />
              <FilterSelect label="Cửa hàng" value={locationFilter} options={locations} onChange={setLocationFilter} />
              <FilterSelect label="Trạng thái" value={statusFilter} options={statuses} onChange={setStatusFilter} />
            </div>
          </div>
          <DataTable columns={variantColumns} data={filteredRows} rowKey={(r) => r.key} />
        </Card>
      </div>
    </div>
  );
}

/* ── Tab: Đơn hàng ── */

const orderColumns: Column<ProductRelatedOrder>[] = [
  { key: "orderCode", header: "Mã ĐH", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "#2F64F6", fontSize: 13 }}>{r.orderCode}</span> },
  { key: "customer", header: "Khách hàng", render: (r) => <span style={{ fontWeight: 500, fontSize: 13 }}>{r.customer}</span> },
  { key: "phone", header: "SĐT", render: (r) => <span style={{ fontSize: 13, color: "#637381" }}>{r.phone}</span> },
  { key: "color", header: "Màu", render: (r) => <span style={{ fontSize: 13 }}>{r.color}</span> },
  { key: "size", header: "Size", render: (r) => <span style={{ fontSize: 13, fontWeight: 500 }}>{r.size}</span> },
  { key: "qty", header: "SL", align: "center", render: (r) => <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{r.qty}</span> },
  { key: "value", header: "Giá trị", align: "right", render: (r) => <span style={{ fontSize: 13, fontWeight: 600 }}>{r.value.toLocaleString("vi-VN")} đ</span> },
  { key: "channel", header: "Kênh", render: (r) => <span style={{ fontSize: 12, color: "#637381" }}>{r.channel}</span> },
  {
    key: "status", header: "Trạng thái", render: (r) => {
      const s = ORDER_STATUS_COLORS[r.status] ?? { color: "#637381", bg: "#F4F6F8" };
      return <Badge label={r.status} color={s.color} bg={s.bg} />;
    },
  },
  { key: "createdAt", header: "Ngày tạo", render: (r) => <span style={{ fontSize: 12, color: "#919EAB" }}>{r.createdAt}</span> },
];

function TabOrders({ record }: { record: CatalogRecord }) {
  const totalRevenue = record.relatedOrders.reduce((s, o) => s + o.value, 0);
  const totalQty = record.relatedOrders.reduce((s, o) => s + o.qty, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ padding: "16px 20px", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <div style={{ fontSize: 12, color: "#919EAB", marginBottom: 4 }}>Số đơn liên quan</div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{record.relatedOrders.length}</div>
        </div>
        <div style={{ padding: "16px 20px", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <div style={{ fontSize: 12, color: "#919EAB", marginBottom: 4 }}>Tổng số lượng</div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{totalQty}</div>
        </div>
        <div style={{ padding: "16px 20px", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <div style={{ fontSize: 12, color: "#919EAB", marginBottom: 4 }}>Giá trị đơn hàng</div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#2F64F6" }}>{(totalRevenue / 1_000_000).toFixed(1)}M đ</div>
        </div>
      </div>

      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <DataTable columns={orderColumns} data={record.relatedOrders} rowKey={(r) => r.id} pageSize={10} />
      </div>
    </div>
  );
}

/* ── Tab: Bảng giá ── */

function TabPricing({ record }: { record: CatalogRecord }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date();
      setLastSync(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`);
    }, 1500);
  }

  const WARNING_BADGE: Record<string, { label: string; color: string; bg: string }> = {
    none: { label: "Cập nhật", color: "#118D57", bg: "#DCFCE7" },
    stale: { label: "Cần đối soát", color: "#B76E00", bg: "#FEF3C7" },
    conflict: { label: "Xung đột", color: "#B71D18", bg: "#FFE4E6" },
    restricted: { label: "Hạn chế", color: "#7C3AED", bg: "#F3E8FF" },
    needs_review: { label: "Cần review", color: "#B76E00", bg: "#FEF3C7" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header with sync button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Bảng giá đang áp dụng</h3>
          {lastSync && <p style={{ fontSize: 12, color: "#919EAB", margin: "4px 0 0" }}>Đồng bộ lúc {lastSync}</p>}
          {!lastSync && <p style={{ fontSize: 12, color: "#919EAB", margin: "4px 0 0" }}>Thông tin bảng giá được đồng bộ từ SAP B1 theo kênh bán hàng</p>}
        </div>
        <Button
          variant="secondary"
          onClick={handleSync}
          style={{ gap: 6, minWidth: 160 }}
        >
          <RefreshCw size={14} style={{ animation: syncing ? "spin 1s linear infinite" : "none" }} />
          {syncing ? "Đang đồng bộ..." : "Đồng bộ bảng giá"}
        </Button>
      </div>

      {/* Pricing cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {record.pricingContexts.map((ctx) => {
          const badge = WARNING_BADGE[ctx.warningState] ?? WARNING_BADGE["none"]!;
          return (
            <div
              key={ctx.id}
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "20px 24px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ctx.contextLabel}</div>
                  <div style={{ fontSize: 12, color: "#919EAB", marginTop: 2 }}>Nguồn: {ctx.source} • Đồng bộ: {ctx.syncedAt}</div>
                </div>
                <Badge label={badge.label} color={badge.color} bg={badge.bg} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div style={{ padding: "12px 16px", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: "#919EAB", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Giá gốc</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#637381", textDecoration: "line-through" }}>{ctx.basePrice}</div>
                </div>
                <div style={{ padding: "12px 16px", background: "rgba(47,100,246,0.06)", borderRadius: "var(--radius-md)", border: "1px solid rgba(47,100,246,0.15)" }}>
                  <div style={{ fontSize: 11, color: "#2F64F6", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Giá cuối</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#2F64F6" }}>{ctx.finalPrice}</div>
                </div>
                <div style={{ padding: "12px 16px", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: "#919EAB", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>CTKM áp dụng</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: ctx.promotionLabel ? "#118D57" : "#919EAB" }}>
                    {ctx.promotionLabel ?? "Không có"}
                  </div>
                </div>
              </div>

              {ctx.traceNote && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(145,158,171,0.06)", borderRadius: "var(--radius-md)", fontSize: 12, color: "#637381", lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 600 }}>Ghi chú: </span>{ctx.traceNote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tabs config ── */

type ProductTab = "detail" | "orders" | "pricing";

const PRODUCT_TABS: { key: ProductTab; label: string; icon: React.ReactNode }[] = [
  { key: "detail", label: "Chi tiết", icon: <FileText size={14} /> },
  { key: "orders", label: "Đơn hàng", icon: <ShoppingBag size={14} /> },
  { key: "pricing", label: "Bảng giá", icon: <DollarSign size={14} /> },
];

/* ── Page ── */

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getCatalogRecordById(id) : null;
  const [activeTab, setActiveTab] = useState<ProductTab>("detail");

  const uniqueColors = useMemo(() => new Set(record?.variants.map((v) => v.color) ?? []), [record]);
  const uniqueSizes = useMemo(() => new Set(record?.variants.map((v) => v.size) ?? []), [record]);

  if (!record) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 64 }}>
        <CircleAlert size={42} style={{ color: "#919EAB" }} />
        <h2 style={{ margin: 0 }}>Không tìm thấy sản phẩm</h2>
        <p style={{ color: "#637381" }}>Sản phẩm với mã "{id}" không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => navigate("/catalog/products")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Back */}
      <button
        onClick={() => navigate("/catalog/products")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#2F64F6", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-primary)", padding: 0 }}
      >
        <ArrowLeft size={16} />
        Quay lại danh sách sản phẩm
      </button>

      {/* Header card */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#212B36" }}>{record.name}</h1>
            <div style={{ fontSize: 13, color: "#637381", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{record.sku}</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{record.category}</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{record.season}</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{uniqueColors.size} màu × {uniqueSizes.size} size</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{record.variants.length} SKU</span>
            </div>
          </div>
          <Badge label="Đang bán" color="#118D57" bg="#DCFCE7" />
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", padding: "0 20px" }}>
          {PRODUCT_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 4px", marginRight: 20, fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--color-primary)" : "#637381", background: "transparent", border: "none", borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent", marginBottom: -1, cursor: "pointer", fontFamily: "var(--font-primary)" }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === "detail" && <TabDetail record={record} />}
          {activeTab === "orders" && <TabOrders record={record} />}
          {activeTab === "pricing" && <TabPricing record={record} />}
        </div>
      </div>
    </div>
  );
}

/* ── InfoLine ── */

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
      <span style={{ color: "#919EAB", fontWeight: 500, minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#212B36", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
