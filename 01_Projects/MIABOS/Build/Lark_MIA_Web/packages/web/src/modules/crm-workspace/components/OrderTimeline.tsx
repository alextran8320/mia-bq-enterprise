import { Card } from "@/shared/ui";
import { ShoppingBag } from "lucide-react";
import type { OrderSummary } from "@/mocks/crm/customers";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export function OrderTimeline({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <Card>
        <h3 style={{ marginBottom: "var(--space-3)" }}>Lịch sử đơn hàng</h3>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>
          Chưa có đơn hàng.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ marginBottom: "var(--space-4)" }}>Lịch sử đơn hàng</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              padding: "var(--space-3) 0",
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
                flexShrink: 0,
              }}
            >
              <ShoppingBag
                size={16}
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: "13px" }}>
                {o.id} — {o.channel}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-tertiary)",
                }}
              >
                {o.date}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                }}
              >
                {formatVND(o.total)}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color:
                    o.status === "Returned"
                      ? "var(--color-error)"
                      : "var(--color-success)",
                }}
              >
                {o.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
