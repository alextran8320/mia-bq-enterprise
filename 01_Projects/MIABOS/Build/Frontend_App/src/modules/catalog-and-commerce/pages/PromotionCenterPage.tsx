import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Badge, Card, DataTable, Input } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import {
  searchCatalog,
  getVisiblePromotions,
  type CatalogRecord,
  type CatalogSearchResult,
} from "@/mocks/catalog/catalog";

const DEFAULT_FILTERS = {
  query: "",
  channel: "all" as const,
  storeType: "all" as const,
  branch: "all" as const,
};

const initialResult = searchCatalog(DEFAULT_FILTERS);

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

type ChannelFilter = "all" | "ecommerce" | "store" | "dealer";

const CHANNEL_FILTERS: { value: ChannelFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "store", label: "Cửa hàng" },
  { value: "dealer", label: "Đại lý" },
];

const columns: Column<CatalogRecord>[] = [
  {
    key: "sku",
    header: "SKU",
    render: (r) => (
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          {r.sku}
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
    key: "variants",
    header: "Số CTKM",
    render: (r) => {
      const promos = getVisiblePromotions(r, DEFAULT_FILTERS);
      return (
        <span style={{ fontSize: "13px", fontWeight: 600 }}>
          {promos.length}
        </span>
      );
    },
  },
  {
    key: "collection",
    header: "CTKM chính",
    render: (r) => {
      const promos = getVisiblePromotions(r, DEFAULT_FILTERS);
      const primary = promos[0];
      if (!primary) return <span style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>--</span>;
      return <span style={{ fontSize: "13px" }}>{primary.name}</span>;
    },
  },
  {
    key: "category",
    header: "Giảm giá",
    render: (r) => {
      const promos = getVisiblePromotions(r, DEFAULT_FILTERS);
      const primary = promos[0];
      if (!primary) return null;
      return (
        <Badge
          label={primary.discountLabel}
          color="#C2410C"
          bg="#FFEDD5"
        />
      );
    },
  },
  {
    key: "season",
    header: "Hiệu lực",
    render: (r) => {
      const promos = getVisiblePromotions(r, DEFAULT_FILTERS);
      const primary = promos[0];
      if (!primary) return <span style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>--</span>;
      return (
        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
          {primary.validRange}
        </span>
      );
    },
  },
  {
    key: "source",
    header: "Nguồn",
    render: (r) => (
      <Badge
        label={r.source}
        color="var(--color-text-secondary)"
        bg="var(--color-bg-surface)"
      />
    ),
  },
];

export function PromotionCenterPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<CatalogSearchResult>(initialResult);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allRecords = result.kind === "found" ? result.records : [];

  const records = allRecords.filter((r) => {
    if (channelFilter !== "all") {
      const hasChannel = r.promotions.some((p) => p.channel === channelFilter);
      if (!hasChannel) return false;
    }
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
      <div style={{ marginBottom: "var(--space-2)" }}>
        <Eyebrow>Catalog</Eyebrow>
        <h1 style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>
          Khuyến mãi
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
          placeholder="Tìm SKU, tên sản phẩm, CTKM..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />

        <FilterSelect
          value={channelFilter}
          options={CHANNEL_FILTERS}
          onChange={setChannelFilter}
        />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={records}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/catalog/promotions/${r.id}`)}
        />
      </Card>
    </div>
  );
}
