import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, RefreshCw, Search } from "lucide-react";
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
    header: "Sản phẩm",
    render: (r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={r.imageUrl}
          alt={r.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
            background: "#F4F6F8",
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: "13px" }}>
            {r.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-text-tertiary)",
              marginTop: 2,
            }}
          >
            {r.sku}
          </div>
        </div>
      </div>
    ),
    width: "24%",
  },
  {
    key: "industry",
    header: "Ngành hàng",
    render: (r) => <span style={{ fontSize: "13px" }}>{r.industry}</span>,
  },
  {
    key: "stockPending",
    header: "Tồn treo",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: r.stockPending > 0 ? "var(--color-warning)" : "var(--color-text-secondary)" }}>
        {r.stockPending}
      </span>
    ),
  },
  {
    key: "stockAvailable",
    header: "Tồn có sẵn",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--color-success)" }}>
        {r.stockAvailable}
      </span>
    ),
  },
  {
    key: "stockActual",
    header: "Tồn thực tế",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 500 }}>
        {r.stockActual}
      </span>
    ),
  },
  {
    key: "vat",
    header: "VAT",
    render: (r) => (
      <span style={{ fontSize: "13px" }}>{r.vat}%</span>
    ),
  },
  {
    key: "syncStatus",
    header: "Đồng bộ",
    render: (r) => {
      const s = SYNC_STATUS_STYLES[r.syncStatus];
      return <Badge label={s.label} color={s.color} bg={s.bg} />;
    },
  },
];

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
        <Button
          variant="secondary"
          style={{ padding: "8px 16px", fontSize: "13px" }}
          onClick={() => setShowSyncModal(true)}
        >
          <RefreshCw size={14} /> Đồng bộ
        </Button>
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
    </div>
  );
}
