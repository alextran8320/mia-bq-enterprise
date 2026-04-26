import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, ShoppingBag, MessageSquare, PhoneCall, Clock,
  LayoutDashboard, FileText, Link2,
} from "lucide-react";
import { CUSTOMERS } from "@/mocks/crm/customers";
import { Card, DataTable, Badge, StatusBadge } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import type { OrderSummary, CallSummary } from "@/mocks/crm/customers";
import { ProfileSummary } from "../components/ProfileSummary";
import { AISummaryPanel } from "../components/AISummaryPanel";
import { IdentityMapPanel } from "../components/IdentityMapPanel";
import { ConversationHistory } from "../components/ConversationHistory";
import { CustomerTimeline } from "../components/CustomerTimeline";
import { ActionSuggestions } from "../components/ActionSuggestions";

type TabKey = "overview" | "detail" | "multichannel" | "timeline" | "orders" | "conversations" | "calls";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Tổng quan", icon: <LayoutDashboard size={14} /> },
  { key: "detail", label: "Chi tiết", icon: <FileText size={14} /> },
  { key: "multichannel", label: "Hồ sơ đa kênh", icon: <Link2 size={14} /> },
  { key: "timeline", label: "Timeline", icon: <Clock size={14} /> },
  { key: "orders", label: "Đơn hàng", icon: <ShoppingBag size={14} /> },
  { key: "conversations", label: "Hội thoại", icon: <MessageSquare size={14} /> },
  { key: "calls", label: "Cuộc gọi", icon: <PhoneCall size={14} /> },
];

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

// ── Order DataTable columns ──
const orderColumns: Column<OrderSummary>[] = [
  { key: "id", header: "Mã đơn", render: (o) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{o.id}</span>, width: "15%" },
  { key: "date", header: "Ngày", render: (o) => o.date, width: "15%" },
  { key: "channel", header: "Kênh", render: (o) => o.channel, width: "12%" },
  {
    key: "total", header: "Giá trị", width: "18%",
    render: (o) => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{formatVND(o.total)}</span>,
  },
  {
    key: "status", header: "Trạng thái", width: "15%",
    render: (o) => (
      <Badge
        label={o.status}
        color={o.status === "Returned" ? "var(--color-error)" : "var(--color-success)"}
        bg={o.status === "Returned" ? "#FFE4E6" : "#DCFCE7"}
      />
    ),
  },
];

// ── Call DataTable columns ──
const callColumns: Column<CallSummary>[] = [
  { key: "id", header: "Mã", render: (c) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{c.id}</span>, width: "10%" },
  { key: "date", header: "Ngày", render: (c) => c.date, width: "12%" },
  {
    key: "direction", header: "Chiều", width: "10%",
    render: (c) => <Badge label={c.direction === "Inbound" ? "Gọi đến" : "Gọi đi"} color={c.direction === "Inbound" ? "#2563EB" : "#16A34A"} bg={c.direction === "Inbound" ? "#EFF6FF" : "#DCFCE7"} />,
  },
  { key: "duration", header: "Thời lượng", render: (c) => <span style={{ fontFamily: "var(--font-mono)" }}>{c.duration}</span>, width: "10%" },
  {
    key: "outcome", header: "Kết quả", width: "10%",
    render: (c) => <Badge label={c.outcome} color={c.outcome === "Answered" ? "#16A34A" : c.outcome === "Missed" ? "#DC2626" : "#D97706"} bg={c.outcome === "Answered" ? "#DCFCE7" : c.outcome === "Missed" ? "#FFE4E6" : "#FEF3C7"} />,
  },
  { key: "agent", header: "Agent", render: (c) => c.agent, width: "14%" },
  { key: "note", header: "Ghi chú", render: (c) => <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{c.note.length > 60 ? c.note.slice(0, 60) + "..." : c.note}</span>, width: "34%" },
];

export function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const customer = CUSTOMERS.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  if (!customer) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <h2>Không tìm thấy khách hàng</h2>
        <Link to="/crm/customers">Quay lại danh sách</Link>
      </div>
    );
  }

  const getTabCount = (key: TabKey): number | null => {
    switch (key) {
      case "orders": return customer.orders.length;
      case "conversations": return customer.conversations.length;
      case "calls": return customer.calls.length;
      case "timeline": return customer.timeline.length;
      case "multichannel": return customer.identities.length;
      default: return null;
    }
  };

  // Insight fields for Overview
  const insightFields = [
    { label: "Tên", value: customer.name },
    { label: "SĐT", value: customer.phone },
    { label: "Email", value: customer.email || "—" },
    { label: "Giới tính", value: customer.gender ?? "—" },
    { label: "Ngày sinh", value: customer.birthday ?? "—" },
    { label: "Khu vực", value: customer.region ?? "—" },
    { label: "Size giày", value: customer.attributes.find(a => a.key === "shoe_size")?.value ?? "—" },
    { label: "Phong cách", value: customer.attributes.find(a => a.key === "preferred_style")?.value ?? "—" },
    { label: "Kênh ưu tiên", value: customer.preferredChannel ?? "—" },
    { label: "Cửa hàng", value: customer.preferredStore ?? "—" },
  ];

  // All detail fields
  const detailFields = [
    { label: "Mã KH", value: customer.id },
    { label: "Tên đầy đủ", value: customer.name },
    { label: "SĐT", value: customer.phone },
    { label: "Email", value: customer.email || "—" },
    { label: "Giới tính", value: customer.gender ?? "—" },
    { label: "Ngày sinh", value: customer.birthday ?? "—" },
    { label: "Khu vực", value: customer.region ?? "—" },
    { label: "Kênh ưu tiên", value: customer.preferredChannel ?? "—" },
    { label: "Cửa hàng ưu tiên", value: customer.preferredStore ?? "—" },
    { label: "Nguồn", value: customer.source },
    { label: "Nguồn đồng bộ", value: customer.syncSource ?? "—" },
    { label: "Kênh", value: customer.channel ?? "—" },
    { label: "Nền tảng", value: customer.platform ?? "—" },
    { label: "Trạng thái", value: customer.status },
    { label: "Consent", value: customer.consentGiven ? "Đã đồng ý" : "Chưa đồng ý" },
    { label: "Assignee", value: customer.assignee ?? "—" },
    { label: "Ngày tạo", value: customer.createdAt },
    { label: "Cập nhật", value: customer.updatedAt ?? customer.lastContact },
    { label: "Liên hệ gần nhất", value: customer.lastContact },
    { label: "Tổng chi tiêu", value: customer.totalSpent ? formatVND(customer.totalSpent) : "—" },
    { label: "Số đơn hàng", value: String(customer.orderCount ?? 0) },
    { label: "TB / đơn", value: customer.avgOrderValue ? formatVND(customer.avgOrderValue) : "—" },
    ...customer.attributes.map(a => ({ label: a.label, value: a.value })),
  ];

  return (
    <div>
      {/* Back link */}
      <Link
        to="/crm/customers"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-4)",
        }}
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      {/* Profile Header */}
      <ProfileSummary customer={customer} />

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-1)",
          borderBottom: "2px solid var(--color-border)",
          marginTop: "var(--space-4)",
          paddingBottom: 0,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getTabCount(tab.key);

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-1)",
                padding: "var(--space-2) var(--space-4)",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                marginBottom: "-2px",
                cursor: "pointer",
              }}
            >
              {tab.icon}
              {tab.label}
              {count !== null && count > 0 && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                    background: isActive ? "var(--color-primary-light)" : "var(--color-bg-surface)",
                    color: isActive ? "var(--color-primary)" : "var(--color-text-tertiary)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: "var(--space-4)" }}>

        {/* ── Tab: Tổng quan ── */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* KPI Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
                <Card>
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Tổng chi tiêu</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}>
                    {customer.totalSpent ? formatVND(customer.totalSpent) : "—"}
                  </div>
                </Card>
                <Card>
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Đơn hàng</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{customer.orderCount ?? 0}</div>
                </Card>
                <Card>
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Tin nhắn</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{customer.conversations.length}</div>
                </Card>
                <Card>
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Cuộc gọi</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{customer.calls.length}</div>
                </Card>
              </div>

              {/* Insight KH */}
              <Card>
                <h3 style={{ margin: "0 0 var(--space-4)" }}>Insight khách hàng</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-4)" }}>
                  {insightFields.map((f) => (
                    <div key={f.label}>
                      <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>{f.label}</div>
                      <div style={{ fontSize: "13px", fontWeight: 500 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Summary */}
              <AISummaryPanel data={customer.aiSummary} />

              {/* Action Suggestions */}
              <ActionSuggestions customer={customer} />
            </div>

            {/* Right sidebar - just status info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <Card>
                <h3 style={{ margin: "0 0 var(--space-3)" }}>Trạng thái</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Lifecycle</span>
                    <StatusBadge status={customer.status} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Consent</span>
                    <Badge label={customer.consentGiven ? "OK" : "Chưa"} color={customer.consentGiven ? "#16A34A" : "#D97706"} bg={customer.consentGiven ? "#DCFCE7" : "#FEF3C7"} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Nguồn</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{customer.source}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Assignee</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{customer.assignee ?? "—"}</span>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 style={{ margin: "0 0 var(--space-3)" }}>Tags</h3>
                {customer.tags.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {customer.tags.map((t) => <Badge key={t} label={t} />)}
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Chưa có tag</span>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* ── Tab: Chi tiết ── */}
        {activeTab === "detail" && (
          <Card>
            <h3 style={{ margin: "0 0 var(--space-5)" }}>Thông tin chi tiết khách hàng</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-5)" }}>
              {detailFields.map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>{f.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Tab: Hồ sơ đa kênh ── */}
        {activeTab === "multichannel" && (
          <IdentityMapPanel identities={customer.identities} />
        )}

        {/* ── Tab: Timeline ── */}
        {activeTab === "timeline" && (
          <CustomerTimeline events={customer.timeline} />
        )}

        {/* ── Tab: Đơn hàng (DataTable) ── */}
        {activeTab === "orders" && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "var(--space-4) var(--space-4) 0" }}>
              <h3 style={{ margin: 0 }}>Lịch sử đơn hàng</h3>
            </div>
            {customer.orders.length === 0 ? (
              <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13 }}>
                Chưa có đơn hàng.
              </div>
            ) : (
              <DataTable columns={orderColumns} data={customer.orders} rowKey={(o) => o.id} />
            )}
          </Card>
        )}

        {/* ── Tab: Hội thoại ── */}
        {activeTab === "conversations" && (
          <ConversationHistory conversations={customer.conversations} />
        )}

        {/* ── Tab: Cuộc gọi (DataTable) ── */}
        {activeTab === "calls" && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "var(--space-4) var(--space-4) 0" }}>
              <h3 style={{ margin: 0 }}>Lịch sử cuộc gọi</h3>
            </div>
            {customer.calls.length === 0 ? (
              <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13 }}>
                Chưa có cuộc gọi.
              </div>
            ) : (
              <DataTable columns={callColumns} data={customer.calls} rowKey={(c) => c.id} />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
