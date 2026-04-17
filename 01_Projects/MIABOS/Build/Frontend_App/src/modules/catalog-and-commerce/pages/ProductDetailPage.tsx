import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, CircleAlert } from "lucide-react";
import { Badge, Button, Card, DataTable } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { getCatalogRecordById } from "@/mocks/catalog/catalog";
import type { CatalogRecord } from "@/mocks/catalog/catalog";

/* ── Helpers ── */

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
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 8,
          border: open ? "1.5px solid #212B36" : "1.5px solid transparent",
          background: "#fff",
          color: "#212B36",
          fontSize: 13,
          fontFamily: "var(--font-primary)",
          fontWeight: 400,
          cursor: "pointer",
          boxShadow: "var(--shadow-ambient)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>
          <span style={{ color: "#919EAB", fontWeight: 400 }}>{label}: </span>
          {selectedLabel}
        </span>
        {open ? <ChevronUp size={14} color="#919EAB" /> : <ChevronDown size={14} color="#919EAB" />}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 10,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 12px 28px -4px rgba(145,158,171,0.2)",
            minWidth: "100%",
            padding: 4,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 14px",
                border: "none",
                borderRadius: 6,
                background: opt.value === value ? "rgba(47,100,246,0.08)" : "transparent",
                color: opt.value === value ? "#2F64F6" : "#212B36",
                fontSize: 13,
                fontFamily: "var(--font-primary)",
                fontWeight: opt.value === value ? 600 : 400,
                textAlign: "left",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "rgba(145,158,171,0.08)";
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "transparent";
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

/* ── Build variant × location cross table ── */

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
      // Generate deterministic stock based on hash
      const hash = (variant.sku + loc.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const available = hash % 12;
      const status = available === 0 ? "Hết hàng" : available <= 2 ? "Sắp hết" : "Còn hàng";
      rows.push({
        key: `${variant.sku}-${loc.id}`,
        variantSku: variant.sku,
        location: loc.name,
        color: variant.color,
        size: variant.size,
        available,
        status,
      });
    }
  }
  return rows;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "Còn hàng": { color: "#118D57", bg: "#DCFCE7" },
  "Sắp hết": { color: "#B76E00", bg: "#FEF3C7" },
  "Hết hàng": { color: "#B71D18", bg: "#FFE4E6" },
};

const variantColumns: Column<VariantRow>[] = [
  {
    key: "variantSku",
    header: "SKU biến thể",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500 }}>
        {r.variantSku}
      </span>
    ),
    width: "22%",
  },
  {
    key: "location",
    header: "Cửa hàng / Kho",
    render: (r) => <span style={{ fontSize: 13 }}>{r.location}</span>,
  },
  {
    key: "color",
    header: "Màu",
    render: (r) => <span style={{ fontSize: 13 }}>{r.color}</span>,
  },
  {
    key: "size",
    header: "Size",
    render: (r) => <span style={{ fontSize: 13, fontWeight: 500 }}>{r.size}</span>,
  },
  {
    key: "available",
    header: "Tồn khả dụng",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>
        {r.available}
      </span>
    ),
  },
  {
    key: "status",
    header: "Trạng thái",
    render: (r) => {
      const s = STATUS_COLORS[r.status] ?? { color: "#637381", bg: "#F4F6F8" };
      return <Badge label={r.status} color={s.color} bg={s.bg} />;
    },
  },
];

/* ── Page ── */

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getCatalogRecordById(id) : null;

  const [colorFilter, setColorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const allRows = useMemo(() => (record ? buildVariantRows(record) : []), [record]);

  const colors = useMemo(() => {
    const set = new Set(allRows.map((r) => r.color));
    return [{ value: "all", label: "Tất cả" }, ...Array.from(set).map((c) => ({ value: c, label: c }))];
  }, [allRows]);

  const sizes = useMemo(() => {
    const set = new Set(allRows.map((r) => r.size));
    return [{ value: "all", label: "Tất cả" }, ...Array.from(set).map((s) => ({ value: s, label: s }))];
  }, [allRows]);

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

  const totalAvailable = allRows.reduce((sum, r) => sum + r.available, 0);
  const uniqueColors = new Set(record?.variants.map((v) => v.color) ?? []);
  const uniqueSizes = new Set(record?.variants.map((v) => v.size) ?? []);

  if (!record) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 64,
        }}
      >
        <CircleAlert size={42} style={{ color: "#919EAB" }} />
        <h2 style={{ margin: 0 }}>Không tìm thấy sản phẩm</h2>
        <p style={{ color: "#637381" }}>
          Sản phẩm với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
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
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#2F64F6",
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "var(--font-primary)",
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Quay lại danh sách sản phẩm
      </button>

      {/* Header card */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#212B36" }}>
              {record.name}
            </h1>
            <div
              style={{
                fontSize: 13,
                color: "#637381",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{record.sku}</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{record.category}</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{record.season}</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>Biến thể: {uniqueColors.size} màu × {uniqueSizes.size} size</span>
              <span style={{ color: "#C4CDD5" }}>·</span>
              <span>{record.variants.length} SKU</span>
            </div>
          </div>
          <Badge label="Đang bán" color="#118D57" bg="#DCFCE7" />
        </div>
      </Card>

      {/* Product info card */}
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
          {/* Product image */}
          <div
            style={{
              borderRadius: 12,
              background: "#F4F6F8",
              aspectRatio: "1",
              overflow: "hidden",
            }}
          >
            <img
              src={record.imageUrl}
              alt={record.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InfoLine label="Tên" value={record.name} />
            <InfoLine
              label="Nhóm"
              value={`${record.industry} / ${record.category}`}
            />
            <InfoLine label="Chất liệu" value={record.material} />
            <InfoLine
              label="Size range"
              value={Array.from(uniqueSizes).sort().join(", ")}
            />
            <InfoLine
              label="Màu"
              value={Array.from(uniqueColors).join(", ")}
            />
            <div style={{ display: "flex", gap: 24, marginTop: 4 }}>
              <div>
                <div style={{ fontSize: 11, color: "#919EAB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Tổng tồn khả dụng
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#212B36", marginTop: 2 }}>
                  {totalAvailable} <span style={{ fontSize: 13, fontWeight: 400, color: "#637381" }}>đôi</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#919EAB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Cập nhật
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#212B36", marginTop: 6 }}>
                  {record.syncedAt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 20px 16px" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#212B36" }}>
            Tồn kho theo biến thể × cửa hàng
          </h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <FilterSelect label="Màu" value={colorFilter} options={colors} onChange={setColorFilter} />
            <FilterSelect label="Size" value={sizeFilter} options={sizes} onChange={setSizeFilter} />
            <FilterSelect label="Cửa hàng" value={locationFilter} options={locations} onChange={setLocationFilter} />
            <FilterSelect label="Trạng thái" value={statusFilter} options={statuses} onChange={setStatusFilter} />
          </div>
        </div>
        <DataTable
          columns={variantColumns}
          data={filteredRows}
          rowKey={(r) => r.key}
        />
      </Card>
    </div>
  );
}

/* ── Small helper ── */

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
      <span style={{ color: "#919EAB", fontWeight: 500, minWidth: 100, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: "#212B36", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
