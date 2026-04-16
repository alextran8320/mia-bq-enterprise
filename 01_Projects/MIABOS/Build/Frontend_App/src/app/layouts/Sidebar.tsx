import { NavLink } from "react-router-dom";
import { Users, UserPlus, LayoutDashboard } from "lucide-react";

const NAV = [
  { to: "/crm", icon: LayoutDashboard, label: "Tổng quan" },
  { to: "/crm/customers", icon: Users, label: "Khách hàng" },
  { to: "/crm/leads", icon: UserPlus, label: "Leads" },
];

export function Sidebar() {
  return (
    <nav
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--color-bg-surface)",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-6) 0",
      }}
    >
      <div
        style={{
          padding: "0 var(--space-6) var(--space-8)",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--color-primary)",
        }}
      >
        MIA BOS
      </div>

      <div
        style={{
          padding: "0 var(--space-3)",
          fontSize: "11px",
          fontWeight: 500,
          color: "var(--color-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "var(--space-2)",
          paddingLeft: "var(--space-6)",
        }}
      >
        CRM Workspace
      </div>

      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/crm"}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "10px var(--space-6)",
            margin: "2px var(--space-3)",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            fontWeight: isActive ? 500 : 400,
            color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
            background: isActive ? "var(--color-primary-light)" : "transparent",
            textDecoration: "none",
            transition: "background 0.15s",
          })}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
