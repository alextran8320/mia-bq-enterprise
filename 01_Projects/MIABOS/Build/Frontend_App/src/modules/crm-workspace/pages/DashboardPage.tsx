import { Card } from "@/shared/ui";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { CUSTOMERS } from "@/mocks/crm/customers";

const stats = [
  { icon: Users, label: "Tổng khách", value: CUSTOMERS.length, color: "var(--color-primary)" },
  { icon: UserCheck, label: "Customer", value: CUSTOMERS.filter((c) => c.status === "Customer").length, color: "var(--color-success)" },
  { icon: UserPlus, label: "Leads", value: CUSTOMERS.filter((c) => c.status === "Lead").length, color: "var(--color-warning)" },
  { icon: UserX, label: "Inactive", value: CUSTOMERS.filter((c) => c.status === "Inactive" || c.status === "Blocked").length, color: "var(--color-text-tertiary)" },
];

export function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: "var(--space-2)" }}>
        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          CRM Workspace
        </span>
      </div>
      <h1 style={{ marginBottom: "var(--space-8)" }}>Tổng quan</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-6)" }}>
        {stats.map((s) => (
          <Card key={s.label}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginBottom: "2px" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{s.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
