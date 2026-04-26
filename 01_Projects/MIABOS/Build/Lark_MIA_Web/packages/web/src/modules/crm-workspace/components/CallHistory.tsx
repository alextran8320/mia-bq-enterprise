import { Card, Badge } from "@/shared/ui";
import { PhoneCall, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import type { CallSummary } from "@/mocks/crm/customers";

const OUTCOME_STYLES: Record<string, { color: string; bg: string }> = {
  Answered: { color: "#16A34A", bg: "#DCFCE7" },
  Missed: { color: "#DC2626", bg: "#FFE4E6" },
  Voicemail: { color: "#D97706", bg: "#FEF3C7" },
  Callback: { color: "#2563EB", bg: "#EFF6FF" },
};

export function CallHistory({ calls }: { calls: CallSummary[] }) {
  if (calls.length === 0) {
    return (
      <Card>
        <h3 style={{ marginBottom: "var(--space-3)" }}>Lịch sử cuộc gọi</h3>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Chưa có cuộc gọi.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ marginBottom: "var(--space-4)" }}>Lịch sử cuộc gọi</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {calls.map((call) => {
          const outcomeStyle = OUTCOME_STYLES[call.outcome] ?? { color: "#16A34A", bg: "#DCFCE7" };
          const DirectionIcon = call.direction === "Inbound" ? PhoneIncoming : PhoneOutgoing;

          return (
            <div
              key={call.id}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                padding: "var(--space-3) 0",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  background: outcomeStyle.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <DirectionIcon size={16} style={{ color: outcomeStyle.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                  <span style={{ fontWeight: 500, fontSize: "13px" }}>{call.direction === "Inbound" ? "Gọi đến" : "Gọi đi"}</span>
                  <Badge label={call.outcome} color={outcomeStyle.color} bg={outcomeStyle.bg} />
                  <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>
                    {call.duration}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-1)" }}>
                  {call.note}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                  <span><PhoneCall size={10} /> {call.agent}</span>
                  <span>{call.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
