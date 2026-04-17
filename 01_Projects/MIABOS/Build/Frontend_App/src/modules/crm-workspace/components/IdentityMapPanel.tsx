import { Card, Badge } from "@/shared/ui";
import { Link2, RefreshCw, ShoppingCart, Store, BarChart3, MessageCircle, BookOpen, Globe, LinkIcon } from "lucide-react";
import type { IdentityMapping } from "@/mocks/crm/customers";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Linked: { color: "#16A34A", bg: "#DCFCE7" },
  Suggested: { color: "#D97706", bg: "#FEF3C7" },
  Conflict: { color: "#DC2626", bg: "#FFE4E6" },
};

const SYSTEM_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  "Haravan": { icon: <ShoppingCart size={16} />, color: "#2563EB" },
  "KiotViet": { icon: <Store size={16} />, color: "#16A34A" },
  "SAP B1": { icon: <BarChart3 size={16} />, color: "#7C3AED" },
  "Zalo OA": { icon: <MessageCircle size={16} />, color: "#0068FF" },
  "Facebook": { icon: <BookOpen size={16} />, color: "#1877F2" },
  "Website": { icon: <Globe size={16} />, color: "#EC4899" },
};

const DEFAULT_SYSTEM = { icon: <LinkIcon size={16} />, color: "var(--color-text-tertiary)" };

export function IdentityMapPanel({ identities }: { identities: IdentityMapping[] }) {
  if (identities.length === 0) {
    return (
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          <Link2 size={16} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ margin: 0 }}>Định danh đa kênh</h3>
        </div>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>
          Chưa có identity mapping.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
        <Link2 size={16} style={{ color: "var(--color-primary)" }} />
        <h3 style={{ margin: 0 }}>Định danh đa kênh</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {identities.map((identity) => {
          const style = STATUS_STYLES[identity.status] ?? { color: "#16A34A", bg: "#DCFCE7" };
          const sys = SYSTEM_CONFIG[identity.system] ?? DEFAULT_SYSTEM;

          return (
            <div
              key={`${identity.system}-${identity.externalId}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3)",
                background: "var(--color-bg-page)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-sm)",
                  background: `${sys.color}14`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: sys.color,
                  flexShrink: 0,
                }}
              >
                {sys.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: "13px" }}>{identity.system}</div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-tertiary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {identity.externalId}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                <Badge label={identity.status} color={style.color} bg={style.bg} />
                <div style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "10px", color: "var(--color-text-tertiary)" }}>
                  <RefreshCw size={9} /> {identity.lastSynced}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
