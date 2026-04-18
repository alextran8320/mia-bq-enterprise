import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, MessageSquare, PhoneCall, Clock, LayoutDashboard } from "lucide-react";
import { CUSTOMERS } from "@/mocks/crm/customers";
import { Card } from "@/shared/ui";
import { ProfileSummary } from "../components/ProfileSummary";
import { AISummaryPanel } from "../components/AISummaryPanel";
import { AttributePanel } from "../components/AttributePanel";
import { IdentityMapPanel } from "../components/IdentityMapPanel";
import { OrderTimeline } from "../components/OrderTimeline";
import { ConversationHistory } from "../components/ConversationHistory";
import { CallHistory } from "../components/CallHistory";
import { CustomerTimeline } from "../components/CustomerTimeline";
import { ActionSuggestions } from "../components/ActionSuggestions";

type TabKey = "overview" | "timeline" | "orders" | "conversations" | "calls";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Tổng quan", icon: <LayoutDashboard size={14} /> },
  { key: "timeline", label: "Timeline", icon: <Clock size={14} /> },
  { key: "orders", label: "Đơn hàng", icon: <ShoppingBag size={14} /> },
  { key: "conversations", label: "Hội thoại", icon: <MessageSquare size={14} /> },
  { key: "calls", label: "Cuộc gọi", icon: <PhoneCall size={14} /> },
];

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

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
      default: return null;
    }
  };

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

      {/* Profile Header - Full width */}
      <ProfileSummary customer={customer} />

      {/* Tab navigation - right below profile header */}
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
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* Key Metrics Row */}
              {(customer.totalSpent || customer.orderCount) && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
                  <Card>
                    <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Tổng chi tiêu</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}>
                      {customer.totalSpent ? formatVND(customer.totalSpent) : "—"}
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Số đơn hàng</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {customer.orderCount ?? 0}
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>TB / đơn</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {customer.avgOrderValue ? formatVND(customer.avgOrderValue) : "—"}
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>Tương tác</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {customer.conversations.length + customer.calls.length}
                    </div>
                  </Card>
                </div>
              )}

              {/* AI Summary */}
              <AISummaryPanel data={customer.aiSummary} />

              {/* Action Suggestions */}
              <ActionSuggestions customer={customer} />
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <IdentityMapPanel identities={customer.identities} />
              <AttributePanel attributes={customer.attributes} />
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
            <CustomerTimeline events={customer.timeline} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <IdentityMapPanel identities={customer.identities} />
              <AttributePanel attributes={customer.attributes} />
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
            <OrderTimeline orders={customer.orders} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <IdentityMapPanel identities={customer.identities} />
              <AttributePanel attributes={customer.attributes} />
            </div>
          </div>
        )}

        {activeTab === "conversations" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
            <ConversationHistory conversations={customer.conversations} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <IdentityMapPanel identities={customer.identities} />
              <AttributePanel attributes={customer.attributes} />
            </div>
          </div>
        )}

        {activeTab === "calls" && (
          <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
            <CallHistory calls={customer.calls} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <IdentityMapPanel identities={customer.identities} />
              <AttributePanel attributes={customer.attributes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
