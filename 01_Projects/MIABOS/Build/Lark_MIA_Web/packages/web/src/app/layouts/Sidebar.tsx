import { NavLink } from "react-router-dom";
import {
  CircleDollarSign,
  Users,
  MessageSquareText,
  PackageSearch,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  TicketPercent,
  BookOpen,
  MessageSquare,
  RotateCcw,
  ScrollText,
} from "lucide-react";
import { usePermissions } from "@/shared/auth/permission";

type NavItem = {
  to: string;
  icon: React.ElementType;
  label: string;
  // Optional permission code(s) — item is hidden when the user has none.
  perm?: string | string[];
};

type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: "Phân tích",
    items: [
      { to: "/analytics/executive", icon: BarChart3, label: "Dashboard", perm: "analytics:read" },
    ],
  },
  {
    label: "Quản lý khách hàng",
    items: [
      { to: "/crm/customers", icon: Users, label: "Khách hàng", perm: "customer:read" },
    ],
  },
  {
    label: "Đơn hàng",
    items: [
      { to: "/orders", icon: PackageSearch, label: "Đơn bán", perm: "order:read" },
      { to: "/orders/returns", icon: RotateCcw, label: "Đơn đổi trả", perm: "order:read" },
    ],
  },
  {
    label: "Danh mục & Thương mại",
    items: [
      { to: "/catalog/products", icon: Package, label: "Sản phẩm", perm: "product:read" },
      { to: "/catalog/pricing", icon: CircleDollarSign, label: "Giá bán", perm: "pricing:read" },
      { to: "/catalog/promotions", icon: TicketPercent, label: "Khuyến mãi", perm: "promotion:read" },
    ],
  },
  {
    label: "Hộp thư đa kênh",
    items: [{ to: "/inbox", icon: MessageSquare, label: "Hội thoại", perm: "inbox:read" }],
  },
  {
    label: "AI Workspace",
    items: [{ to: "/ai/chat", icon: MessageSquareText, label: "Chat nội bộ" }],
  },
  {
    label: "Trung tâm kiến thức",
    items: [
      { to: "/knowledge", icon: BookOpen, label: "Kiến thức", perm: "knowledge:read" },
      { to: "/knowledge/rules", icon: ScrollText, label: "Quy tắc", perm: "knowledge:read" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const NAV_WIDTH = collapsed ? 88 : 280;
  const { hasAny } = usePermissions();
  const allow = (perm?: string | string[]) => {
    if (!perm) return true;
    return hasAny(Array.isArray(perm) ? perm : [perm]);
  };

  const visibleGroups = GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => allow(i.perm)) }))
    .filter((g) => g.items.length > 0);

  return (
    <nav
      className="app-sidebar"
      style={{
        width: NAV_WIDTH,
        flexShrink: 0,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        transition: "width 200ms cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        borderRight: "1px dashed rgba(145,158,171,0.2)",
        position: "relative",
      }}
    >
      {/* Logo row */}
      <div
        style={{
          padding: collapsed ? "24px 0 20px" : "24px 20px 20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
          minHeight: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "linear-gradient(135deg, #2F64F6 0%, #5B8DEF 100%)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(47,100,246,0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2h5v5H2V2zm7 0h5v5H9V2zm0 7h5v5H9V9zm-7 0h5v5H2V9z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#212B36",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              MIA BOS
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Thu gọn sidebar"
            title="Thu gọn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              border: "none",
              borderRadius: 8,
              background: "transparent",
              color: "#919EAB",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(145,158,171,0.08)";
              e.currentTarget.style.color = "#212B36";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#919EAB";
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Mở rộng sidebar"
            title="Mở rộng"
            style={{
              position: "absolute",
              top: 28,
              right: -14,
              width: 28,
              height: 28,
              border: "1px dashed rgba(145,158,171,0.2)",
              borderRadius: "50%",
              background: "#FFFFFF",
              color: "#919EAB",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#212B36";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#919EAB";
            }}
          >
            <PanelLeftOpen size={14} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: collapsed ? "0 12px" : "0 16px",
        }}
      >
        {visibleGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 24 }}>
            {!collapsed && (
              <div
                style={{
                  padding: "0 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#919EAB",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                  lineHeight: "18px",
                }}
              >
                {group.label}
              </div>
            )}

            {collapsed && (
              <div
                style={{
                  height: 1,
                  margin: "0 8px 8px",
                  background: "rgba(145,158,171,0.12)",
                  borderRadius: 1,
                }}
              />
            )}

            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={
                  to === "/crm" ||
                  to === "/inbox" ||
                  to === "/ai/chat" ||
                  to === "/sales-advisor" ||
                  to === "/knowledge"
                }
                title={collapsed ? label : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? 0 : 12,
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "10px 0" : "8px 12px",
                  margin: "2px 0",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#2F64F6" : "#637381",
                  background: isActive
                    ? "rgba(47,100,246,0.08)"
                    : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  minHeight: 40,
                })}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  const active =
                    el.getAttribute("aria-current") === "page" ||
                    el.classList.contains("active");
                  if (!active) {
                    el.style.background = "rgba(145,158,171,0.08)";
                    el.style.color = "#212B36";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  const active =
                    el.getAttribute("aria-current") === "page" ||
                    el.classList.contains("active");
                  if (!active) {
                    el.style.background = "transparent";
                    el.style.color = "#637381";
                  }
                }}
              >
                <Icon size={20} style={{ flexShrink: 0, strokeWidth: 1.5 }} />
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
