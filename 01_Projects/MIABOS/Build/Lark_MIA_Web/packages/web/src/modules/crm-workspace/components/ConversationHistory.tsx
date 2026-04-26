import { Card, Badge } from "@/shared/ui";
import { MessageSquare } from "lucide-react";
import type { ConversationSummary } from "@/mocks/crm/customers";

const CHANNEL_COLORS: Record<string, { color: string; bg: string }> = {
  Facebook: { color: "#1877F2", bg: "#E7F0FF" },
  Zalo: { color: "#0068FF", bg: "#E6F2FF" },
  Website: { color: "#7C3AED", bg: "#F3EAFF" },
  Internal: { color: "#475569", bg: "#F1F5F9" },
};

const SENTIMENT_COLORS: Record<string, { color: string; bg: string }> = {
  Positive: { color: "#16A34A", bg: "#DCFCE7" },
  Neutral: { color: "#94A3B8", bg: "#F1F5F9" },
  Negative: { color: "#DC2626", bg: "#FFE4E6" },
};

export function ConversationHistory({ conversations }: { conversations: ConversationSummary[] }) {
  if (conversations.length === 0) {
    return (
      <Card>
        <h3 style={{ marginBottom: "var(--space-3)" }}>Lịch sử hội thoại</h3>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Chưa có hội thoại.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ marginBottom: "var(--space-4)" }}>Lịch sử hội thoại</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {conversations.map((conv) => {
          const channelStyle = CHANNEL_COLORS[conv.channel] ?? { color: "#475569", bg: "#F1F5F9" };
          const sentimentStyle = SENTIMENT_COLORS[conv.sentiment] ?? { color: "#94A3B8", bg: "#F1F5F9" };

          return (
            <div
              key={conv.id}
              style={{
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-bg-page)",
                borderRadius: "var(--radius-sm)",
                borderLeft: `3px solid ${channelStyle.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <MessageSquare size={14} style={{ color: channelStyle.color }} />
                  <Badge label={conv.channel} color={channelStyle.color} bg={channelStyle.bg} />
                  <Badge label={conv.sentiment} color={sentimentStyle.color} bg={sentimentStyle.bg} />
                  {!conv.resolved && (
                    <Badge label="Chưa xử lý" color="#D97706" bg="#FEF3C7" />
                  )}
                </div>
                <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>{conv.date}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: "13px", marginBottom: "var(--space-1)" }}>
                {conv.intent}
              </div>
              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                {conv.summary}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
