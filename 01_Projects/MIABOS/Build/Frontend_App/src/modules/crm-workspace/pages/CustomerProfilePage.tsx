import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CUSTOMERS } from "@/mocks/crm/customers";
import { ProfileSummary } from "../components/ProfileSummary";
import { AttributePanel } from "../components/AttributePanel";
import { OrderTimeline } from "../components/OrderTimeline";
import { ActionSuggestions } from "../components/ActionSuggestions";

export function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const customer = CUSTOMERS.find((c) => c.id === id);

  if (!customer) {
    return (
      <div style={{ padding: "var(--space-8)" }}>
        <h2>Không tìm thấy khách hàng</h2>
        <Link to="/crm/customers">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/crm/customers"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-6)",
        }}
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-6)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <ProfileSummary customer={customer} />
          <OrderTimeline orders={customer.orders} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <AttributePanel attributes={customer.attributes} />
          <ActionSuggestions customer={customer} />
        </div>
      </div>
    </div>
  );
}
