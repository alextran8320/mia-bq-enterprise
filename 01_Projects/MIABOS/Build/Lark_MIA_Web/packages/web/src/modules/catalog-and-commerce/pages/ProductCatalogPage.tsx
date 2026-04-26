import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, RefreshCw, Search, PackageSearch, X } from "lucide-react";
import { Badge, Button, Card, DataTable, Input } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import {
  searchCatalog,
  type CatalogRecord,
  type CatalogSearchResult,
  type SyncStatus,
} from "@/mocks/catalog/catalog";

const SYNC_STATUS_STYLES: Record<
  SyncStatus,
  { label: string; color: string; bg: string }
> = {
  success: { label: "Thành công", color: "var(--color-success)", bg: "#DCFCE7" },
  failed: { label: "Thất bại", color: "var(--color-error)", bg: "#FFE4E6" },
  syncing: { label: "Đang đồng bộ", color: "var(--color-warning)", bg: "#FEF3C7" },
};

const initialResult = searchCatalog({
  query: "",
  channel: "all",
  storeType: "all",
  branch: "all",
});

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

type IndustryFilter = "all" | "giay_dep_nu" | "giay_dep_nam" | "phu_kien";
type SyncFilter = "all" | SyncStatus;

const INDUSTRY_FILTERS: { value: IndustryFilter; label: string }[] = [
  { value: "all", label: "Tất cả ngành hàng" },
  { value: "giay_dep_nu", label: "Giày dép nữ" },
  { value: "giay_dep_nam", label: "Giày dép nam" },
  { value: "phu_kien", label: "Phụ kiện" },
];

const INDUSTRY_FILTER_MAP: Record<IndustryFilter, string | null> = {
  all: null,
  giay_dep_nu: "Giày dép nữ",
  giay_dep_nam: "Giày dép nam",
  phu_kien: "Phụ kiện",
};

const SYNC_FILTERS: { value: SyncFilter; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "success", label: "Thành công" },
  { value: "failed", label: "Thất bại" },
  { value: "syncing", label: "Đang đồng bộ" },
];

const columns: Column<CatalogRecord>[] = [
  {
    key: "sku",
    header: "Mã SP",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-tertiary)" }}>{r.sku}</span>
    ),
    width: "8%",
  },
  {
    key: "name",
    header: "Tên sản phẩm",
    render: (r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={r.imageUrl}
          alt={r.name}
          style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0, background: "#F4F6F8" }}
        />
        <span style={{ fontWeight: 500, fontSize: "13px" }}>{r.name}</span>
      </div>
    ),
    width: "20%",
  },
  {
    key: "industry",
    header: "Phân loại",
    render: (r) => <span style={{ fontSize: "12px" }}>{r.industry}</span>,
    width: "9%",
  },
  {
    key: "category",
    header: "Danh mục",
    render: (r) => <span style={{ fontSize: "12px" }}>{r.category}</span>,
    width: "9%",
  },
  {
    key: "description",
    header: "Mô tả",
    render: (r) => (
      <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
        {r.description.length > 40 ? r.description.slice(0, 40) + "..." : r.description}
      </span>
    ),
    width: "14%",
  },
  {
    key: "stockAvailable",
    header: "Tồn kho",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: r.stockAvailable > 0 ? "var(--color-success)" : "var(--color-error)" }}>
        {r.stockAvailable}
      </span>
    ),
    width: "6%",
  },
  {
    key: "syncStatus",
    header: "Trạng thái",
    render: (r) => {
      const s = SYNC_STATUS_STYLES[r.syncStatus];
      return <Badge label={s.label} color={s.color} bg={s.bg} />;
    },
    width: "8%",
  },
  {
    key: "source",
    header: "Nguồn",
    render: (r) => (
      <Badge label={r.source} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
    ),
    width: "8%",
  },
  {
    key: "ownerTeam",
    header: "Giao cho",
    render: (r) => <span style={{ fontSize: "12px" }}>{r.ownerTeam}</span>,
    width: "9%",
  },
  {
    key: "syncedAt",
    header: "Updated At",
    render: (r) => <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{r.syncedAt}</span>,
    width: "9%",
  },
];

/* ── Inventory check mock data ── */

interface InventoryRow {
  id: string;
  productCode: string;
  productName: string;
  warehouse: string;
  sku: string;
  lot: string;
  color: string;
  size: string;
  actual: number;
  pending: number;
  available: number;
  status: string;
}

const INVENTORY_DATA: InventoryRow[] = [
  { id: "inv-1", productCode: "PRD-000184", productName: "Sneaker Velocity", warehouse: "Kho Tân Bình", sku: "BQ-SNE-184-37-CRM", lot: "LOT-2026-001", color: "Kem", size: "37", actual: 18, pending: 3, available: 15, status: "Còn hàng" },
  { id: "inv-2", productCode: "PRD-000184", productName: "Sneaker Velocity", warehouse: "Kho Tân Bình", sku: "BQ-SNE-184-38-CRM", lot: "LOT-2026-001", color: "Kem", size: "38", actual: 24, pending: 5, available: 19, status: "Còn hàng" },
  { id: "inv-3", productCode: "PRD-000184", productName: "Sneaker Velocity", warehouse: "Kho Tân Bình", sku: "BQ-SNE-184-37-PNK", lot: "LOT-2026-002", color: "Hồng", size: "37", actual: 4, pending: 2, available: 2, status: "Sắp hết" },
  { id: "inv-4", productCode: "PRD-000184", productName: "Sneaker Velocity", warehouse: "Flagship Q1", sku: "BQ-SNE-184-38-CRM", lot: "LOT-2026-001", color: "Kem", size: "38", actual: 12, pending: 0, available: 12, status: "Còn hàng" },
  { id: "inv-5", productCode: "PRD-000184", productName: "Sneaker Velocity", warehouse: "Flagship Q1", sku: "BQ-SNE-184-39-CRM", lot: "LOT-2026-001", color: "Kem", size: "39", actual: 7, pending: 1, available: 6, status: "Còn hàng" },
  { id: "inv-6", productCode: "PRD-000205", productName: "Sandal Luna", warehouse: "Kho Tân Bình", sku: "BQ-SDL-205-36-BE", lot: "LOT-2026-003", color: "Be", size: "36", actual: 31, pending: 4, available: 27, status: "Còn hàng" },
  { id: "inv-7", productCode: "PRD-000205", productName: "Sandal Luna", warehouse: "Kho Tân Bình", sku: "BQ-SDL-205-37-BE", lot: "LOT-2026-003", color: "Be", size: "37", actual: 22, pending: 2, available: 20, status: "Còn hàng" },
  { id: "inv-8", productCode: "PRD-000205", productName: "Sandal Luna", warehouse: "Vincom Thủ Đức", sku: "BQ-SDL-205-37-WHT", lot: "LOT-2026-004", color: "Trắng", size: "37", actual: 3, pending: 0, available: 3, status: "Sắp hết" },
  { id: "inv-9", productCode: "PRD-000229", productName: "Loafer Heritage", warehouse: "Flagship Q1", sku: "BQ-LOA-229-40-BLK", lot: "LOT-2026-005", color: "Đen", size: "40", actual: 9, pending: 1, available: 8, status: "Còn hàng" },
  { id: "inv-10", productCode: "PRD-000229", productName: "Loafer Heritage", warehouse: "Kho Tân Bình", sku: "BQ-LOA-229-41-BRN", lot: "LOT-2026-005", color: "Nâu", size: "41", actual: 6, pending: 0, available: 6, status: "Còn hàng" },
  { id: "inv-11", productCode: "PRD-000229", productName: "Loafer Heritage", warehouse: "Showroom Đà Nẵng", sku: "BQ-LOA-229-42-BLK", lot: "LOT-2026-006", color: "Đen", size: "42", actual: 0, pending: 0, available: 0, status: "Hết hàng" },
  { id: "inv-12", productCode: "PRD-000241", productName: "Heels Elegance", warehouse: "Flagship Q1", sku: "BQ-HEL-241-36-BLK", lot: "LOT-2026-007", color: "Đen", size: "36", actual: 5, pending: 2, available: 3, status: "Sắp hết" },
  { id: "inv-13", productCode: "PRD-000241", productName: "Heels Elegance", warehouse: "Showroom Đà Nẵng", sku: "BQ-HEL-241-37-NUD", lot: "LOT-2026-007", color: "Nude", size: "37", actual: 14, pending: 0, available: 14, status: "Còn hàng" },
  { id: "inv-14", productCode: "PRD-000312", productName: "Signature Crossbody", warehouse: "Flagship Q1", sku: "BQ-BAG-312-BLK", lot: "LOT-2026-008", color: "Đen", size: "—", actual: 20, pending: 3, available: 17, status: "Còn hàng" },
  { id: "inv-15", productCode: "PRD-000312", productName: "Signature Crossbody", warehouse: "Kho Tân Bình", sku: "BQ-BAG-312-CRM", lot: "LOT-2026-008", color: "Kem", size: "—", actual: 8, pending: 1, available: 7, status: "Còn hàng" },
];

const TINH_TP = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"];
const PHUONG_XA: Record<string, string[]> = {
  "TP. Hồ Chí Minh": ["Tân Bình", "Quận 1", "Thủ Đức", "Bình Thạnh", "Quận 7"],
  "Hà Nội": ["Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Tây Hồ"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Ngũ Hành Sơn"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy"],
};
const KHO_OPTIONS = ["Kho Tân Bình", "Flagship Q1", "Vincom Thủ Đức", "Showroom Đà Nẵng"];
const COLOR_OPTIONS = ["Kem", "Hồng", "Be", "Trắng", "Đen", "Nâu", "Nude", "Đỏ đô"];
const SIZE_OPTIONS = ["36", "37", "38", "39", "40", "41", "42", "—"];

const INV_STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "Còn hàng": { color: "#118D57", bg: "#DCFCE7" },
  "Sắp hết": { color: "#B76E00", bg: "#FEF3C7" },
  "Hết hàng": { color: "#B71D18", bg: "#FFE4E6" },
};

const invColumns: Column<InventoryRow>[] = [
  { key: "productCode", header: "Mã SP", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500 }}>{r.productCode}</span>, width: "9%" },
  { key: "productName", header: "Tên SP", render: (r) => <span style={{ fontSize: 13, fontWeight: 500 }}>{r.productName}</span>, width: "15%" },
  { key: "warehouse", header: "Kho", render: (r) => <span style={{ fontSize: 13 }}>{r.warehouse}</span>, width: "12%" },
  { key: "sku", header: "SKU", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.sku}</span>, width: "16%" },
  { key: "lot", header: "Lô", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#637381" }}>{r.lot}</span>, width: "10%" },
  { key: "actual", header: "Tồn thực tế", align: "center", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13 }}>{r.actual}</span>, width: "8%" },
  { key: "pending", header: "Tồn treo", align: "center", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#B76E00" }}>{r.pending}</span>, width: "7%" },
  { key: "available", header: "Tồn khả dụng", align: "center", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: r.available > 0 ? "#118D57" : "#B71D18" }}>{r.available}</span>, width: "9%" },
  { key: "status", header: "Trạng thái", render: (r) => { const s = INV_STATUS_STYLE[r.status] ?? { color: "#637381", bg: "#F4F6F8" }; return <Badge label={r.status} color={s.color} bg={s.bg} />; }, width: "8%" },
];

function InventoryCheckModal({ onClose }: { onClose: () => void }) {
  const [tinhTp, setTinhTp] = useState("");
  const [phuongXa, setPhuongXa] = useState("");
  const [kho, setKho] = useState("");
  const [skuSearch, setSkuSearch] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<InventoryRow[]>([]);

  const phuongXaOptions = tinhTp ? (PHUONG_XA[tinhTp] ?? []) : [];

  function handleCheck() {
    const filtered = INVENTORY_DATA.filter((r) => {
      if (kho && r.warehouse !== kho) return false;
      if (skuSearch && !r.sku.toLowerCase().includes(skuSearch.toLowerCase()) && !r.productCode.toLowerCase().includes(skuSearch.toLowerCase()) && !r.productName.toLowerCase().includes(skuSearch.toLowerCase())) return false;
      if (color && r.color !== color) return false;
      if (size && r.size !== size) return false;
      return true;
    });
    setResults(filtered);
    setHasSearched(true);
  }

  function handleReset() {
    setTinhTp(""); setPhuongXa(""); setKho(""); setSkuSearch(""); setColor(""); setSize("");
    setHasSearched(false); setResults([]);
  }

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 10px", border: "1px solid var(--color-border)", borderRadius: 8,
    fontSize: 13, fontFamily: "var(--font-primary)", background: "var(--color-bg-card)",
    cursor: "pointer", color: "var(--color-text-primary)", width: "100%",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", boxShadow: "0 24px 48px -12px rgba(0,0,0,0.25)", width: "min(1100px, 96vw)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid var(--color-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PackageSearch size={18} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Kiểm tra tồn kho</div>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Tra cứu số lượng tồn theo kho và biến thể sản phẩm</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-text-secondary)", display: "flex", padding: 6, borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Filter form */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Tỉnh/TP</label>
              <select value={tinhTp} onChange={(e) => { setTinhTp(e.target.value); setPhuongXa(""); }} style={selectStyle}>
                <option value="">Tất cả</option>
                {TINH_TP.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Phường/Xã</label>
              <select value={phuongXa} onChange={(e) => setPhuongXa(e.target.value)} style={{ ...selectStyle, opacity: phuongXaOptions.length === 0 ? 0.5 : 1 }} disabled={phuongXaOptions.length === 0}>
                <option value="">Tất cả</option>
                {phuongXaOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Kho</label>
              <select value={kho} onChange={(e) => setKho(e.target.value)} style={selectStyle}>
                <option value="">Tất cả kho</option>
                {KHO_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>SP / SKU / Mã SP / Lô</label>
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
                <input
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value)}
                  placeholder="Nhập mã hoặc tên..."
                  style={{ ...selectStyle, paddingLeft: 28 }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Màu sắc</label>
              <select value={color} onChange={(e) => setColor(e.target.value)} style={selectStyle}>
                <option value="">Tất cả màu</option>
                {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} style={selectStyle}>
                <option value="">Tất cả size</option>
                {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={handleReset}
                style={{ height: 38, padding: "0 12px", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, background: "var(--color-bg-card)", cursor: "pointer", fontFamily: "var(--font-primary)", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}
              >
                Xoá lọc
              </button>
              <button
                onClick={handleCheck}
                style={{ height: 38, padding: "0 16px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "var(--color-primary)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-primary)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                <PackageSearch size={14} /> Kiểm tra
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {!hasSearched ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, gap: 12, color: "var(--color-text-tertiary)" }}>
              <PackageSearch size={40} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>Chọn điều kiện và nhấn "Kiểm tra" để tra cứu tồn kho</div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, gap: 12, color: "var(--color-text-tertiary)" }}>
              <PackageSearch size={40} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>Không tìm thấy tồn kho theo điều kiện đã chọn</div>
            </div>
          ) : (
            <div>
              <div style={{ padding: "12px 24px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 12 }}>
                <span>Kết quả: <strong style={{ color: "var(--color-text-primary)" }}>{results.length}</strong> bản ghi</span>
                <span style={{ color: "var(--color-text-tertiary)" }}>•</span>
                <span>Tổng tồn thực tế: <strong style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}>{results.reduce((s, r) => s + r.actual, 0)}</strong></span>
                <span style={{ color: "var(--color-text-tertiary)" }}>•</span>
                <span>Tổng khả dụng: <strong style={{ color: "#118D57", fontFamily: "var(--font-mono)" }}>{results.reduce((s, r) => s + r.available, 0)}</strong></span>
              </div>
              <DataTable columns={invColumns} data={results} rowKey={(r) => r.id} pageSize={10} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SyncConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)" as unknown as number,
        background: "rgba(15,23,42,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-dropdown)",
          padding: "var(--space-6)",
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "var(--radius-sm)",
              background: "var(--color-primary-light)",
              border: "1px solid var(--color-primary-muted)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <RefreshCw size={16} color="var(--color-primary)" />
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            Đồng bộ tất cả sản phẩm?
          </h3>
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
            margin: "0 0 var(--space-5)",
          }}
        >
          Hệ thống sẽ đồng bộ lại dữ liệu tất cả sản phẩm từ các nguồn. Quá
          trình có thể mất vài phút.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-card)",
              color: "var(--color-text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-primary)",
            }}
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--color-primary)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-primary)",
            }}
          >
            <RefreshCw size={14} />
            Xác nhận đồng bộ
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<CatalogSearchResult>(initialResult);
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>("all");
  const [syncFilter, setSyncFilter] = useState<SyncFilter>("all");
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allRecords = result.kind === "found" ? result.records : [];

  const records = allRecords.filter((r) => {
    if (industryFilter !== "all") {
      const expected = INDUSTRY_FILTER_MAP[industryFilter];
      if (expected && r.industry !== expected) return false;
    }
    if (syncFilter !== "all" && r.syncStatus !== syncFilter) return false;
    return true;
  });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResult(
        searchCatalog({
          query: search,
          channel: "all",
          storeType: "all",
          branch: "all",
        }),
      );
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
      <div style={{ marginBottom: "var(--space-2)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Eyebrow>Catalog</Eyebrow>
          <h1 style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>
            Sản phẩm
          </h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button
            variant="secondary"
            style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => setShowInventoryModal(true)}
          >
            <PackageSearch size={14} /> Kiểm tra tồn kho
          </Button>
          <Button
            variant="secondary"
            style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => setShowSyncModal(true)}
          >
            <RefreshCw size={14} /> Đồng bộ
          </Button>
        </div>
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
          placeholder="Tìm SKU, tên sản phẩm, barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />

        <FilterSelect
          value={industryFilter}
          options={INDUSTRY_FILTERS}
          onChange={setIndustryFilter}
        />

        <FilterSelect
          value={syncFilter}
          options={SYNC_FILTERS}
          onChange={setSyncFilter}
        />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={records}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/catalog/products/${r.id}`)}
        />
      </Card>

      {showSyncModal && (
        <SyncConfirmModal
          onConfirm={() => setShowSyncModal(false)}
          onCancel={() => setShowSyncModal(false)}
        />
      )}

      {showInventoryModal && (
        <InventoryCheckModal onClose={() => setShowInventoryModal(false)} />
      )}
    </div>
  );
}
