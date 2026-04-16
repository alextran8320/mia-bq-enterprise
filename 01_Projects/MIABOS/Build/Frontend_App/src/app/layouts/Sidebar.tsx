import { NavLink } from "react-router-dom";
import {
  Users,
  UserPlus,
  LayoutDashboard,
  MessageSquareText,
  ShoppingBag,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const GROUPS = [
  {
    label: "CRM Workspace",
    items: [
      { to: "/crm", icon: LayoutDashboard, label: "Tổng quan" },
      { to: "/crm/customers", icon: Users, label: "Khách hàng" },
      { to: "/crm/leads", icon: UserPlus, label: "Leads" },
    ],
  },
  {
    label: "AI Workspace",
    items: [
      { to: "/ai/chat", icon: MessageSquareText, label: "Chat nội bộ" },
      { to: "/sales-advisor", icon: ShoppingBag, label: "Tư vấn bán hàng" },
    ],
  },
  {
    label: "Insights",
    items: [{ to: "/analytics/executive", icon: BarChart3, label: "Dashboard ROI" }],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <nav
      className="app-sidebar"
      style={{
        width: collapsed ? 60 : 240,
        flexShrink: 0,
        background: "var(--color-bg-surface)",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-4) 0",
        transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        borderRight: "1px solid rgba(0,0,0,0.04)",
        position: "relative",
      }}
    >
      {/* Logo row */}
      <div
        style={{
          padding: collapsed ? "0 10px var(--space-6)" : "0 var(--space-6) var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "var(--space-2)",
          minHeight: 36,
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            MIA BOS
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          title={collapsed ? "Mở rộng" : "Thu gọn"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "none",
            borderRadius: "var(--radius-sm)",
            background: "transparent",
            color: "var(--color-text-tertiary)",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-light)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)";
          }}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: "var(--space-5)" }}>
            {!collapsed && (
              <div
                style={{
                  padding: "0 var(--space-6)",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "var(--space-1)",
                }}
              >
                {group.label}
              </div>
            )}

            {collapsed && (
              <div
                style={{
                  height: 1,
                  margin: "0 10px var(--space-2)",
                  background: "rgba(0,0,0,0.06)",
                }}
              />
            )}

            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/crm" || to === "/ai/chat" || to === "/sales-advisor"}
                title={collapsed ? label : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? 0 : "var(--space-3)",
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "10px" : "10px var(--space-5)",
                  margin: collapsed ? "2px 8px" : "2px var(--space-3)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13.5px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  background: isActive ? "var(--color-primary-light)" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                })}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span
                    style={{
                      opacity: collapsed ? 0 : 1,
                      transition: "opacity 150ms",
                    }}
                  >
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
