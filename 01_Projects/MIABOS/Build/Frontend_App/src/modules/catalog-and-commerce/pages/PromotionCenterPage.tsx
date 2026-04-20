import { useState } from "react";
import { Copy, Eye, Pause, Pencil, Plus, ThumbsUp } from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

// ─── Types & mock data ────────────────────────────────────────────────────────

type PromoStatus = "Đang chạy" | "Chờ duyệt" | "Đã kết thúc" | "Tạm dừng";

interface PromotionRecord {
  id: string;
  code: string;
  name: string;
  storeScope: string[];
  status: PromoStatus;
  startDate: string;
  endDate: string;
}

const PROMOTIONS: PromotionRecord[] = [
  {
    id: "promo-001",
    code: "CTKM-2026-001",
    name: "Giảm 20% Cửa Hàng Chính Hãng Tháng 4",
    storeScope: ["Cửa hàng chính hãng"],
    status: "Đang chạy",
    startDate: "01/04/2026",
    endDate: "30/04/2026",
  },
  {
    id: "promo-002",
    code: "CTKM-2026-002",
    name: "Back-to-School — Giảm 15% Giày Học Sinh",
    storeScope: ["Tất cả"],
    status: "Chờ duyệt",
    startDate: "01/08/2026",
    endDate: "15/09/2026",
  },
  {
    id: "promo-003",
    code: "CTKM-2026-003",
    name: "Tết Nguyên Đán 2026 — Ưu Đãi Đặc Biệt",
    storeScope: ["Tất cả"],
    status: "Đã kết thúc",
    startDate: "15/01/2026",
    endDate: "10/02/2026",
  },
  {
    id: "promo-004",
    code: "CTKM-2026-004",
    name: "Flash Sale Cuối Tuần — Giảm 10%",
    storeScope: ["Online"],
    status: "Tạm dừng",
    startDate: "01/04/2026",
    endDate: "30/06/2026",
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PromoStatus, { color: string; bg: string }> = {
  "Đang chạy": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Chờ duyệt": { color: "#B45309", bg: "#FEF3C7" },
  "Đã kết thúc": { color: "var(--color-text-tertiary)", bg: "var(--color-bg-surface)" },
  "Tạm dừng": { color: "var(--color-error)", bg: "#FFE4E6" },
};

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionCell({ record }: { record: PromotionRecord }) {
  const isEditDisabled = record.status === "Đang chạy" || record.status === "Đã kết thúc";

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {/* Xem — luôn hiển thị */}
      <button
        title="Xem"
        style={{
          border: "none",
          background: "var(--color-bg-surface)",
          borderRadius: "var(--radius-sm)",
          padding: "5px 8px",
          cursor: "pointer",
          color: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Eye size={14} />
      </button>

      {/* Sửa — disabled khi Đang chạy hoặc Đã kết thúc */}
      <button
        title="Sửa"
        disabled={isEditDisabled}
        style={{
          border: "none",
          background: isEditDisabled ? "transparent" : "var(--color-bg-surface)",
          borderRadius: "var(--radius-sm)",
          padding: "5px 8px",
          cursor: isEditDisabled ? "not-allowed" : "pointer",
          color: isEditDisabled ? "var(--color-text-tertiary)" : "var(--color-text-secondary)",
          display: "flex",
          alignItems: "center",
          opacity: isEditDisabled ? 0.4 : 1,
        }}
      >
        <Pencil size={14} />
      </button>

      {/* Duyệt — chỉ khi Chờ duyệt */}
      {record.status === "Chờ duyệt" && (
        <button
          title="Duyệt"
          style={{
            border: "none",
            background: "#DCFCE7",
            borderRadius: "var(--radius-sm)",
            padding: "5px 8px",
            cursor: "pointer",
            color: "var(--color-success)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ThumbsUp size={14} />
        </button>
      )}

      {/* Tạm dừng — chỉ khi Đang chạy */}
      {record.status === "Đang chạy" && (
        <button
          title="Tạm dừng"
          style={{
            border: "none",
            background: "#FFE4E6",
            borderRadius: "var(--radius-sm)",
            padding: "5px 8px",
            cursor: "pointer",
            color: "var(--color-error)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Pause size={14} />
        </button>
      )}

      {/* Nhân bản — luôn hiển thị */}
      <button
        title="Nhân bản"
        style={{
          border: "none",
          background: "var(--color-bg-surface)",
          borderRadius: "var(--radius-sm)",
          padding: "5px 8px",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns: Column<PromotionRecord>[] = [
  {
    key: "code",
    header: "Mã CTKM",
    render: (r) => (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600 }}>
        {r.code}
      </span>
    ),
    width: "14%",
  },
  {
    key: "name",
    header: "Tên CTKM",
    render: (r) => (
      <span style={{ fontSize: "13px", fontWeight: 500 }}>{r.name}</span>
    ),
    width: "30%",
  },
  {
    key: "storeScope",
    header: "Áp dụng tại",
    render: (r) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {r.storeScope.map((s) => (
          <Badge key={s} label={s} color="var(--color-primary)" bg="var(--color-primary-light)" />
        ))}
      </div>
    ),
    width: "16%",
  },
  {
    key: "status",
    header: "Trạng thái",
    render: (r) => {
      const s = STATUS_STYLES[r.status];
      return <Badge label={r.status} color={s.color} bg={s.bg} />;
    },
    width: "12%",
  },
  {
    key: "startDate",
    header: "Ngày bắt đầu",
    render: (r) => (
      <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)" }}>{r.startDate}</span>
    ),
    width: "12%",
  },
  {
    key: "endDate",
    header: "Ngày kết thúc",
    render: (r) => {
      // Highlight đỏ nếu sắp hết hạn (< 7 ngày) — check đơn giản bằng so sánh date
      const parts = r.endDate.split("/");
      const endMs = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
      const diffDays = (endMs - Date.now()) / 86400000;
      const isExpiringSoon = diffDays >= 0 && diffDays < 7;
      return (
        <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: isExpiringSoon ? "var(--color-error)" : undefined, fontWeight: isExpiringSoon ? 600 : undefined }}>
          {r.endDate}
        </span>
      );
    },
    width: "12%",
  },
  {
    key: "id",
    header: "Action",
    render: (r) => <ActionCell record={r} />,
    width: "14%",
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

export function PromotionCenterPage() {
  const [records] = useState<PromotionRecord[]>(PROMOTIONS);

  const stats = {
    total: records.length,
    running: records.filter((r) => r.status === "Đang chạy").length,
    pending: records.filter((r) => r.status === "Chờ duyệt").length,
    ended: records.filter((r) => r.status === "Đã kết thúc").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Eyebrow>Catalog</Eyebrow>
          <h1 style={{ marginTop: "var(--space-2)", marginBottom: 0 }}>Chương trình khuyến mãi</h1>
        </div>
        <Button variant="primary" style={{ gap: "var(--space-2)" }}>
          <Plus size={16} /> Tạo CTKM mới
        </Button>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
        {[
          { label: "Tổng CTKM", value: stats.total, color: "var(--color-text-primary)" },
          { label: "Đang chạy", value: stats.running, color: "var(--color-success)" },
          { label: "Chờ duyệt", value: stats.pending, color: "#B45309" },
          { label: "Đã kết thúc", value: stats.ended, color: "var(--color-text-tertiary)" },
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
