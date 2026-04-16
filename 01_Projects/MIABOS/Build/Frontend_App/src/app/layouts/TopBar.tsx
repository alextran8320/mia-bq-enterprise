import { Search } from "lucide-react";
import { Avatar } from "@/shared/ui";

export function TopBar() {
  return (
    <header
      style={{
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-8)",
        background: "rgba(246, 249, 255, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          background: "var(--color-bg-card)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 14px",
          boxShadow: "var(--shadow-ambient)",
          width: 320,
        }}
      >
        <Search size={16} style={{ color: "var(--color-text-tertiary)" }} />
        <input
          placeholder="Tìm kiếm nhanh..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            font: "inherit",
            color: "var(--color-text-primary)",
            width: "100%",
            fontSize: "13px",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>Admin</span>
        <Avatar name="Admin User" size={32} />
      </div>
    </header>
  );
}
