import { Card, Button } from "@/shared/ui";
import { MessageSquare, Gift, RefreshCw } from "lucide-react";
import type { Customer } from "@/mocks/crm/customers";

interface Suggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
}

function getSuggestions(customer: Customer): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (customer.status === "Lead") {
    suggestions.push({
      icon: <MessageSquare size={16} />,
      label: "Liên hệ tư vấn",
      description: "Lead mới — cần follow-up trong 24h",
    });
  }

  if (customer.status === "Qualified") {
    suggestions.push({
      icon: <Gift size={16} />,
      label: "Gửi ưu đãi",
      description: "Khách đã qualified — kích hoạt mua hàng lần đầu",
    });
  }

  if (customer.status === "Customer" && customer.orders.length > 0) {
    suggestions.push({
      icon: <RefreshCw size={16} />,
      label: "Remarketing",
      description: `Có ${customer.orders.length} đơn — gợi ý sản phẩm phù hợp`,
    });
  }

  if (customer.status === "Inactive") {
    suggestions.push({
      icon: <MessageSquare size={16} />,
      label: "Win-back",
      description: "Khách không hoạt động — cần chiến dịch win-back",
    });
  }

  return suggestions;
}

export function ActionSuggestions({ customer }: { customer: Customer }) {
  const suggestions = getSuggestions(customer);

  if (suggestions.length === 0) return null;

  return (
    <Card>
      <h3 style={{ marginBottom: "var(--space-4)" }}>Gợi ý hành động</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {suggestions.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-bg-page)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: "var(--color-primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: "13px" }}>{s.label}</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>{s.description}</div>
            </div>
            <Button variant="secondary" style={{ padding: "8px 16px", fontSize: "12px" }}>
              Thực hiện
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
