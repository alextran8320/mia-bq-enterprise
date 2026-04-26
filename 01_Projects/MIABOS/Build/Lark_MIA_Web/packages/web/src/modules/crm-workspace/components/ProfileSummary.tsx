import { Avatar, Badge, StatusBadge, Card } from "@/shared/ui";
import { Mail, Phone, Calendar, Shield, MapPin } from "lucide-react";
import type { Customer } from "@/mocks/crm/customers";

export function ProfileSummary({ customer }: { customer: Customer }) {
  return (
    <Card>
      <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "flex-start" }}>
        <Avatar name={customer.name} size={64} src={customer.avatarUrl} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-1)" }}>
            <h2 style={{ margin: 0 }}>{customer.name}</h2>
            <StatusBadge status={customer.status} />
          </div>

          <div
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--color-text-tertiary)",
              marginBottom: "var(--space-4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {customer.id}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-5)", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            {customer.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                <Phone size={14} /> {customer.phone}
              </span>
            )}
            {customer.email && (
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                <Mail size={14} /> {customer.email}
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
              <MapPin size={14} /> {customer.source}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
              <Calendar size={14} /> {customer.lastContact}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
              <Shield size={14} /> {customer.consentGiven ? "Consent OK" : "Chưa consent"}
            </span>
          </div>

          {customer.tags.length > 0 && (
            <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
              {customer.tags.map((t) => (
                <Badge key={t} label={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
