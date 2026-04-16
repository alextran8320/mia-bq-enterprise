import { Card } from "@/shared/ui";
import type { CustomerAttribute } from "@/mocks/crm/customers";

export function AttributePanel({ attributes }: { attributes: CustomerAttribute[] }) {
  if (attributes.length === 0) {
    return (
      <Card>
        <h3 style={{ marginBottom: "var(--space-3)" }}>Thuộc tính CRM</h3>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>
          Chưa có dữ liệu enrichment.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ marginBottom: "var(--space-4)" }}>Thuộc tính CRM</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        {attributes.map((attr) => (
          <div key={attr.key}>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>
              {attr.label}
            </div>
            <div style={{ fontWeight: 500 }}>{attr.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
