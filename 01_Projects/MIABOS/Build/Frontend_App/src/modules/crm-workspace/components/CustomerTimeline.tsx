import { useState } from "react";
import { Card, Badge } from "@/shared/ui";
import {
  ShoppingBag,
  MessageSquare,
  PhoneCall,
  StickyNote,
  Megaphone,
  Settings2,
} from "lucide-react";
import type { TimelineEvent } from "@/mocks/crm/customers";

const EVENT_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  order: {
    icon: <ShoppingBag size={14} />,
    color: "#2563EB",
    bg: "#EFF6FF",
    label: "Đơn hàng",
  },
  chat: {
    icon: <MessageSquare size={14} />,
    color: "#7C3AED",
    bg: "#F3EAFF",
    label: "Hội thoại",
  },
  call: {
    icon: <PhoneCall size={14} />,
    color: "#16A34A",
    bg: "#DCFCE7",
    label: "Cuộc gọi",
  },
  note: {
    icon: <StickyNote size={14} />,
    color: "#D97706",
    bg: "#FEF3C7",
    label: "Ghi chú",
  },
  campaign: {
    icon: <Megaphone size={14} />,
    color: "#EC4899",
    bg: "#FCE7F3",
    label: "Campaign",
  },
  system: {
    icon: <Settings2 size={14} />,
    color: "#94A3B8",
    bg: "#F1F5F9",
    label: "Hệ thống",
  },
};

const FILTER_TYPES = [
  "all",
  "order",
  "chat",
  "call",
  "note",
  "campaign",
  "system",
] as const;
const FILTER_LABELS: Record<string, string> = {
  all: "Tất cả",
  order: "Đơn hàng",
  chat: "Chat",
  call: "Gọi điện",
  note: "Ghi chú",
  campaign: "Campaign",
  system: "Hệ thống",
};

export function CustomerTimeline({ events }: { events: TimelineEvent[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  if (events.length === 0) {
    return (
      <Card>
        <h3 style={{ marginBottom: "var(--space-3)" }}>Timeline</h3>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>
          Chưa có sự kiện.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ marginBottom: "var(--space-4)" }}>Timeline</h3>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBottom: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        {FILTER_TYPES.map((type) => {
          const isActive = filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: isActive
                  ? "var(--color-primary)"
                  : "var(--color-border)",
                background: isActive ? "var(--color-primary)" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--color-text-secondary)",
                cursor: "pointer",
              }}
            >
              {FILTER_LABELS[type]}
            </button>
          );
        })}
      </div>

      {/* Timeline items */}
      <div style={{ position: "relative", paddingLeft: "var(--space-6)" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "8px",
            bottom: "8px",
            width: "2px",
            background: "var(--color-border)",
          }}
        />

        {filtered.map((event) => {
          const config = EVENT_CONFIG[event.type] ?? {
            icon: <Settings2 size={14} />,
            color: "#94A3B8",
            bg: "#F1F5F9",
            label: "Hệ thống",
          };

          return (
            <div
              key={event.id}
              style={{
                position: "relative",
                paddingBottom: "var(--space-4)",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "4px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: config.bg,
                  border: `2px solid ${config.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "var(--space-2)",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: "13px" }}>
                      {event.title}
                    </span>
                    <Badge
                      label={config.label}
                      color={config.color}
                      bg={config.bg}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {event.description}
                  </div>
                  {event.channel && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-tertiary)",
                        marginTop: "2px",
                      }}
                    >
                      Kênh: {event.channel}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    flexShrink: 0,
                  }}
                >
                  {event.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
