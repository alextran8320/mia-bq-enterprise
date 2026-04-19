import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Search, XCircle } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

interface IntegrationLog {
  id: string;
  system: string;
  eventType: string;
  direction: "inbound" | "outbound";
  timestamp: string;
  status: "success" | "error" | "warning" | "pending";
  message: string;
  duration: string;
  recordCount: number;
}

const LOGS: IntegrationLog[] = [
  { id: "log-001", system: "SAP B1", eventType: "Đồng bộ sản phẩm", direction: "inbound", timestamp: "19/04/2026 10:12:45", status: "success", message: "Đồng bộ thành công 142 sản phẩm từ SAP B1", duration: "3.2s", recordCount: 142 },
  { id: "log-002", system: "Haravan", eventType: "Đẩy đơn hàng", direction: "outbound", timestamp: "19/04/2026 10:08:30", status: "success", message: "Đẩy 8 đơn hàng mới lên Haravan thành công", duration: "1.8s", recordCount: 8 },
  { id: "log-003", system: "KiotViet", eventType: "Đồng bộ tồn kho", direction: "inbound", timestamp: "19/04/2026 09:55:12", status: "error", message: "Timeout khi kết nối KiotViet API - Connection refused after 30s", duration: "30.0s", recordCount: 0 },
  { id: "log-004", system: "SAP B1", eventType: "Cập nhật bảng giá", direction: "inbound", timestamp: "19/04/2026 09:30:00", status: "success", message: "Cập nhật bảng giá cho 5 sản phẩm từ SAP B1", duration: "0.9s", recordCount: 5 },
  { id: "log-005", system: "Haravan", eventType: "Đồng bộ khách hàng", direction: "inbound", timestamp: "19/04/2026 09:15:44", status: "warning", message: "Đồng bộ xong nhưng 3 bản ghi có dữ liệu thiếu SĐT", duration: "2.1s", recordCount: 47 },
  { id: "log-006", system: "Zalo OA", eventType: "Gửi thông báo", direction: "outbound", timestamp: "19/04/2026 08:50:22", status: "success", message: "Gửi 23 tin nhắn thông báo đơn hàng qua Zalo OA", duration: "5.4s", recordCount: 23 },
  { id: "log-007", system: "Facebook Ads", eventType: "Sync conversion", direction: "outbound", timestamp: "19/04/2026 08:30:00", status: "error", message: "Access token hết hạn - Vui lòng kết nối lại Facebook Ads", duration: "0.3s", recordCount: 0 },
  { id: "log-008", system: "KiotViet", eventType: "Đồng bộ tồn kho", direction: "inbound", timestamp: "19/04/2026 07:55:12", status: "success", message: "Đồng bộ tồn kho 312 biến thể từ KiotViet", duration: "4.7s", recordCount: 312 },
  { id: "log-009", system: "SAP B1", eventType: "Đồng bộ đơn hàng", direction: "outbound", timestamp: "18/04/2026 23:00:00", status: "success", message: "Đẩy 31 đơn hàng cuối ngày lên SAP B1", duration: "6.2s", recordCount: 31 },
  { id: "log-010", system: "Haravan", eventType: "Cập nhật giá", direction: "outbound", timestamp: "18/04/2026 20:15:00", status: "pending", message: "Đang chờ xác nhận cập nhật 12 mặt hàng lên Haravan", duration: "—", recordCount: 12 },
  { id: "log-011", system: "Google Analytics", eventType: "Push event", direction: "outbound", timestamp: "18/04/2026 18:00:00", status: "success", message: "Đẩy 1,204 sự kiện mua hàng lên GA4 thành công", duration: "8.1s", recordCount: 1204 },
  { id: "log-012", system: "SAP B1", eventType: "Đồng bộ sản phẩm", direction: "inbound", timestamp: "18/04/2026 10:05:00", status: "success", message: "Đồng bộ thành công 138 sản phẩm từ SAP B1", duration: "2.9s", recordCount: 138 },
];

const STATUS_CONFIG = {
  success: { label: "Thành công", color: "#118D57", bg: "#DCFCE7", icon: <CheckCircle2 size={14} /> },
  error: { label: "Lỗi", color: "#B71D18", bg: "#FFE4E6", icon: <XCircle size={14} /> },
  warning: { label: "Cảnh báo", color: "#B76E00", bg: "#FEF3C7", icon: <AlertCircle size={14} /> },
  pending: { label: "Đang xử lý", color: "#2F64F6", bg: "#EEF4FF", icon: <Clock size={14} /> },
};

const DIRECTION_LABEL = { inbound: "Nhận vào", outbound: "Đẩy ra" };

type StatusFilter = "all" | IntegrationLog["status"];
type SystemFilter = "all" | string;

export function IntegrationLogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [systemFilter, setSystemFilter] = useState<SystemFilter>("all");

  const systems = Array.from(new Set(LOGS.map((l) => l.system)));

  const filtered = LOGS.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (systemFilter !== "all" && l.system !== systemFilter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.system.toLowerCase().includes(search.toLowerCase()) && !l.eventType.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<IntegrationLog>[] = [
    {
      key: "timestamp",
      header: "Thời gian",
      render: (l) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#637381", whiteSpace: "nowrap" }}>{l.timestamp}</span>,
      width: "14%",
    },
    {
      key: "system",
      header: "Hệ thống",
      render: (l) => <span style={{ fontWeight: 600, fontSize: 13 }}>{l.system}</span>,
      width: "10%",
    },
    {
      key: "eventType",
      header: "Loại sự kiện",
      render: (l) => <span style={{ fontSize: 13 }}>{l.eventType}</span>,
      width: "14%",
    },
    {
      key: "direction",
      header: "Chiều",
      render: (l) => (
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: l.direction === "inbound" ? "#EEF4FF" : "#F0FDF4", color: l.direction === "inbound" ? "#2F64F6" : "#118D57", fontWeight: 500 }}>
          {DIRECTION_LABEL[l.direction]}
        </span>
      ),
      width: "8%",
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (l) => {
        const cfg = STATUS_CONFIG[l.status];
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: cfg.color }}>
            {cfg.icon}
            <Badge label={cfg.label} color={cfg.color} bg={cfg.bg} />
          </div>
        );
      },
      width: "10%",
    },
    {
      key: "message",
      header: "Thông điệp",
      render: (l) => (
        <span style={{ fontSize: 12, color: l.status === "error" ? "#B71D18" : "var(--color-text-secondary)", lineHeight: 1.5 }}>
          {l.message}
        </span>
      ),
    },
    {
      key: "recordCount",
      header: "Bản ghi",
      align: "center",
      render: (l) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>{l.recordCount > 0 ? l.recordCount.toLocaleString("vi-VN") : "—"}</span>,
      width: "7%",
    },
    {
      key: "duration",
      header: "Thời lượng",
      align: "right",
      render: (l) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#637381" }}>{l.duration}</span>,
      width: "8%",
    },
  ];

  const successCount = LOGS.filter((l) => l.status === "success").length;
  const errorCount = LOGS.filter((l) => l.status === "error").length;
  const warningCount = LOGS.filter((l) => l.status === "warning").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Log tích hợp</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Lịch sử kết nối và đồng bộ giữa các hệ thống tích hợp
          </p>
        </div>
        <Button variant="secondary" style={{ gap: 6 }}>
          <RefreshCw size={14} /> Làm mới
        </Button>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ padding: "16px 20px", background: "#DCFCE7", borderRadius: "var(--radius-md)", border: "1px solid #BBF7D0", display: "flex", gap: 12, alignItems: "center" }}>
          <CheckCircle2 size={22} color="#118D57" />
          <div>
            <div style={{ fontSize: 11, color: "#118D57", fontWeight: 500 }}>THÀNH CÔNG HÔM NAY</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#118D57", fontFamily: "var(--font-mono)" }}>{successCount}</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px", background: "#FFE4E6", borderRadius: "var(--radius-md)", border: "1px solid #FECDD3", display: "flex", gap: 12, alignItems: "center" }}>
          <XCircle size={22} color="#B71D18" />
          <div>
            <div style={{ fontSize: 11, color: "#B71D18", fontWeight: 500 }}>LỖI</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#B71D18", fontFamily: "var(--font-mono)" }}>{errorCount}</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px", background: "#FEF3C7", borderRadius: "var(--radius-md)", border: "1px solid #FDE68A", display: "flex", gap: 12, alignItems: "center" }}>
          <AlertCircle size={22} color="#B76E00" />
          <div>
            <div style={{ fontSize: 11, color: "#B76E00", fontWeight: 500 }}>CẢNH BÁO</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#B76E00", fontFamily: "var(--font-mono)" }}>{warningCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm log..."
            style={{ width: "100%", paddingLeft: 32, paddingRight: 12, height: 38, border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", background: "var(--color-bg-card)", outline: "none", color: "var(--color-text-primary)" }}
          />
        </div>

        <select
          value={systemFilter}
          onChange={(e) => setSystemFilter(e.target.value)}
          style={{ height: 38, padding: "0 12px", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", background: "var(--color-bg-card)", cursor: "pointer", color: "var(--color-text-primary)" }}
        >
          <option value="all">Tất cả hệ thống</option>
          {systems.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          style={{ height: 38, padding: "0 12px", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", background: "var(--color-bg-card)", cursor: "pointer", color: "var(--color-text-primary)" }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="success">Thành công</option>
          <option value="error">Lỗi</option>
          <option value="warning">Cảnh báo</option>
          <option value="pending">Đang xử lý</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(l) => l.id}
          pageSize={10}
        />
      </div>
    </div>
  );
}
