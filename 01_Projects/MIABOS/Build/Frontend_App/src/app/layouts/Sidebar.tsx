import { NavLink } from "react-router-dom";
import {
  CircleDollarSign,
  CircleAlert,
  Users,
  UserPlus,
  LayoutDashboard,
  MessageSquareText,
  PackageSearch,
  ShoppingBag,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  ShieldAlert,
  TicketPercent,
  Warehouse,
  ArrowRightLeft,
  BookOpen,
  MessageSquare,
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
    label: "Orders & Service",
    items: [{ to: "/orders", icon: PackageSearch, label: "Đơn hàng" }],
  },
  {
    label: "Danh mục & Thương mại",
    items: [
      { to: "/catalog/products", icon: Package, label: "Sản phẩm" },
      { to: "/catalog/inventory", icon: Warehouse, label: "Tồn kho" },
      { to: "/catalog/pricing", icon: CircleDollarSign, label: "Giá bán" },
      { to: "/catalog/promotions", icon: TicketPercent, label: "Khuyến mãi" },
    ],
  },
  {
    label: "Operations & Governance",
    items: [
      { to: "/operations/escalations", icon: CircleAlert, label: "Escalation Queue" },
      { to: "/operations/users-roles", icon: Users, label: "Users And Roles" },
      { to: "/operations/scope-rules", icon: ShieldAlert, label: "Scope Rules" },
      { to: "/operations/integration-ops", icon: LayoutDashboard, label: "Integration Ops" },
      { to: "/operations/source-mapping", icon: ArrowRightLeft, label: "Source Mapping" },
    ],
  },
  {
    label: "Omnichannel Inbox",
    items: [
      { to: "/inbox", icon: MessageSquare, label: "Hội thoại" },
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
    items: [
      { to: "/analytics/executive", icon: BarChart3, label: "Dashboard ROI" },
    ],
  },
  {
    label: "Knowledge Center",
    items: [
      { to: "/knowledge", icon: BookOpen, label: "Knowledge Center" },
    ],
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
          padding: collapsed ? "0 10px var(--space-5)" : "0 var(--space-5) var(--space-5)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "var(--space-2)",
          minHeight: 44,
        }}
      >
        {/* Logo mark — always visible */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              background: "var(--color-primary)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zm0 7h5v5H9V9zm-7 0h5v5H2V9z" fill="white" />
            </svg>
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--color-primary)",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              MIA BOS
            </span>
          )}
        </div>
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
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--color-primary-light)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-text-tertiary)";
          }}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
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
                end={
                  to === "/crm" || to === "/inbox" || to === "/ai/chat" || to === "/sales-advisor" || to === "/knowledge"
                }
                title={collapsed ? label : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? 0 : "var(--space-3)",
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "9px 0" : "9px var(--space-5)",
                  paddingLeft: collapsed ? 0 : isActive ? "calc(var(--space-5) - 3px)" : "var(--space-5)",
                  margin: "1px 0",
                  borderLeft: isActive
                    ? "3px solid var(--color-primary)"
                    : "3px solid transparent",
                  borderRadius: collapsed ? "var(--radius-sm)" : 0,
                  marginLeft: collapsed ? 8 : 0,
                  marginRight: collapsed ? 8 : 0,
                  fontSize: "13.5px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? "var(--color-primary-hover)"
                    : "var(--color-text-secondary)",
                  background: isActive
                    ? "var(--color-primary-light)"
                    : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                })}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  const isActiveEl = el.style.borderLeftColor === "var(--color-primary)" ||
                    el.style.background === "var(--color-primary-light)";
                  if (!isActiveEl) {
                    el.style.background = "var(--color-bg-surface)";
                    el.style.color = "var(--color-text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  const isActiveEl = el.style.background === "var(--color-bg-surface)";
                  if (isActiveEl) {
                    el.style.background = "transparent";
                    el.style.color = "var(--color-text-secondary)";
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ transition: "opacity 150ms" }}>{label}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
