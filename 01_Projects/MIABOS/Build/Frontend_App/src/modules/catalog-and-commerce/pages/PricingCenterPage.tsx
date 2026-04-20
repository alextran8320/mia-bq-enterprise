import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

// ─── Types & mock data ────────────────────────────────────────────────────────

type PricingStatus = "Đang áp dụng" | "Chờ hiệu lực" | "Hết hiệu lực";

interface PricingRecord {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string | null;
  targets: string[];
  regions: string[];
  status: PricingStatus;
}

const PRICING_RECORDS: PricingRecord[] = [
  {
    id: "bg-001",
    code: "BG-2026-001",
    name: "Bảng giá bán lẻ tiêu chuẩn 2026",
    startDate: "01/01/2026",
    endDate: null,
    targets: ["Khách lẻ"],
    regions: ["Toàn quốc"],
    status: "Đang áp dụng",
  },
  {
    id: "bg-002",
    code: "BG-2026-002",
    name: "Bảng giá đại lý cấp 1 — Q1/2026",
    startDate: "01/01/2026",
    endDate: "31/03/2026",
    targets: ["Đại lý cấp 1"],
    regions: ["Toàn quốc"],
    status: "Hết hiệu lực",
  },
  {
    id: "bg-003",
    code: "BG-2026-003",
    name: "Bảng giá đại lý cấp 1 — Q2/2026",
    startDate: "01/04/2026",
    endDate: "30/06/2026",
    targets: ["Đại lý cấp 1"],
    regions: ["Toàn quốc"],
    status: "Đang áp dụng",
  },
  {
    id: "bg-004",
    code: "BG-2026-004",
    name: "Bảng giá nhân viên nội bộ 2026",
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    targets: ["Nhân viên"],
    regions: ["Toàn quốc"],
    status: "Đang áp dụng",
  },
  {
    id: "bg-005",
    code: "BG-2026-005",
    name: "Bảng giá khuyến mãi Miền Bắc T5",
    startDate: "01/05/2026",
    endDate: "31/05/2026",
    targets: ["Khách lẻ"],
    regions: ["Miền Bắc"],
    status: "Chờ hiệu lực",
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PricingStatus, { color: string; bg: string }> = {
  "Đang áp dụng": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Chờ hiệu lực": { color: "#B45309", bg: "#FEF3C7" },
  "Hết hiệu lực": { color: "var(--color-text-tertiary)", bg: "var(--color-bg-surface)" },
};

const TARGET_STYLES: Record<string, { color: string; bg: string }> = {
  "Khách lẻ": { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  "Đại lý cấp 1": { color: "#7C3AED", bg: "#F3E8FF" },
  "Đại lý cấp 2": { color: "#0F766E", bg: "#CCFBF1" },
  "Nhân viên": { color: "#B45309", bg: "#FEF3C7" },
  "VIP": { color: "#C2410C", bg: "#FFEDD5" },
};

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns: Column<PricingRecord>[] = [
  {
    key: "code",
    header: "Mã bảng giá",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600 }}>
        {r.code}
      </span>
    ),
    width: "13%",
  },
  {
    key: "name",
    header: "Tên bảng giá",
    render: (r) => (
      <span style={{ fontSize: "13px", fontWeight: 500 }}>{r.name}</span>
    ),
    width: "28%",
  },
  {
    key: "startDate",
    header: "Ngày bắt đầu",
    render: (r) => (
      <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)" }}>{r.startDate}</span>
    ),
    width: "11%",
  },
  {
    key: "endDate",
    header: "Ngày kết thúc",
    render: (r) => (
      <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: r.endDate ? undefined : "var(--color-text-tertiary)" }}>
        {r.endDate ?? "—"}
      </span>
    ),
    width: "11%",
  },
  {
    key: "targets",
    header: "Đối tượng áp dụng",
    render: (r) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {r.targets.map((t) => {
          const s = TARGET_STYLES[t] ?? { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" };
          return <Badge key={t} label={t} color={s.color} bg={s.bg} />;
        })}
      </div>
    ),
    width: "16%",
  },
  {
    key: "regions",
    header: "Khu vực",
    render: (r) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {r.regions.map((reg) => (
          <Badge key={reg} label={reg} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
        ))}
      </div>
    ),
    width: "12%",
  },
  {
    key: "status",
    header: "Trạng thái",
    render: (r) => {
      const s = STATUS_STYLES[r.status];
      return <Badge label={r.status} color={s.color} bg={s.bg} />;
    },
    width: "13%",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: string }) {
  return (
    <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {children}
    </span>
  );
}

export function PricingCenterPage() {
  const [records] = useState<PricingRecord[]>(PRICING_RECORDS);

  const stats = {
    total: records.length,
    active: records.filter((r) => r.status === "Đang áp dụng").length,
    pending: records.filter((r) => r.status === "Chờ hiệu lực").length,
    expired: records.filter((r) => r.status === "Hết hiệu lực").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Eyebrow>Catalog</Eyebrow>
          <h1 style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>Chính sách giá</h1>
        </div>
        <Button variant="primary" style={{ gap: "var(--space-2)" }}>
          <Plus size={16} /> Tạo bảng giá mới
        </Button>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
        {[
          { label: "Tổng bảng giá", value: stats.total, color: "var(--color-text-primary)" },
          { label: "Đang áp dụng", value: stats.active, color: "var(--color-success)" },
          { label: "Chờ hiệu lực", value: stats.pending, color: "#B45309" },
          { label: "Hết hiệu lực", value: stats.expired, color: "var(--color-text-tertiary)" },
        ].map((kpi) => (
          <Card key={kpi.label} style={{ padding: "var(--space-4)" }}>
            <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "var(--space-2)" }}>{kpi.label}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={records}
          rowKey={(r) => r.id}
        />
      </Card>
    </div>
  );
}
