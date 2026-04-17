import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, Search, Settings, Store } from "lucide-react";
import { Avatar } from "@/shared/ui";

const STORES = [
  { id: "bq-hcm", label: "Giày BQ – TP.HCM" },
  { id: "bq-hn", label: "Giày BQ – Hà Nội" },
  { id: "bq-dn", label: "Giày BQ – Đà Nẵng" },
];

const NOTIFICATIONS = [
  { id: "n1", text: "Đơn #HD-2051 chờ xác nhận giao hàng", time: "2 phút trước", unread: true },
  { id: "n2", text: "Khách Nguyễn Văn A để lại thông tin tư vấn", time: "15 phút trước", unread: true },
  { id: "n3", text: "Báo cáo ROI tháng 4 đã sẵn sàng", time: "1 giờ trước", unread: false },
];

const BREADCRUMB_MAP: Record<string, string> = {
  "/crm": "Quản lý khách hàng",
  "/crm/customers": "Khách hàng",
  "/crm/leads": "Đầu mối",
  "/orders": "Đơn hàng",
  "/catalog": "Danh mục",
  "/catalog/products": "Sản phẩm",
  "/catalog/pricing": "Giá bán",
  "/catalog/promotions": "Khuyến mãi",
  "/operations": "Vận hành",
  "/operations/escalations": "Hàng đợi xử lý",
  "/operations/users-roles": "Người dùng & Vai trò",
  "/operations/scope-rules": "Quy tắc phạm vi",
  "/operations/integration-ops": "Tích hợp hệ thống",
  "/operations/source-mapping": "Nguồn & Mapping",
  "/inbox": "Hội thoại",
  "/ai/chat": "Chat nội bộ",
  "/sales-advisor": "Tư vấn bán hàng",
  "/analytics": "Phân tích",
  "/analytics/executive": "Bảng điều khiển",
  "/knowledge": "Kiến thức",
};

function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [];

  let built = "";
  for (const seg of segments) {
    built += `/${seg}`;
    const label = BREADCRUMB_MAP[built];
    if (label) {
      crumbs.push({ label, path: built });
    }
  }

  return crumbs.length > 0 ? crumbs : [{ label: "Trang chủ", path: "/" }];
}

export function TopBar() {
  const location = useLocation();
  const [selectedStore, setSelectedStore] = useState<(typeof STORES)[number]>(STORES[0]!);
  const [storeOpen, setStoreOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const storeRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const breadcrumbs = getBreadcrumbs(location.pathname);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function handleStoreSelect(store: (typeof STORES)[number]) {
    setSelectedStore(store);
    setStoreOpen(false);
  }

  return (
    <header
      className="topbar"
      style={{
        height: 72,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 24px 0 28px",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderBottom: "1px dashed rgba(145,158,171,0.2)",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && (
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#C4CDD5",
                  display: "inline-block",
                }}
              />
            )}
            <span
              style={{
                fontSize: 14,
                fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
                color: i === breadcrumbs.length - 1 ? "#212B36" : "#919EAB",
              }}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search */}
      <div
        className="topbar__search"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(145,158,171,0.08)",
          borderRadius: 10,
          padding: "8px 14px",
          width: 260,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(145,158,171,0.16)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(145,158,171,0.08)";
        }}
      >
        <Search size={16} style={{ color: "#919EAB", flexShrink: 0 }} />
        <span style={{ fontSize: 14, color: "#919EAB", flex: 1 }}>
          Tìm kiếm...
        </span>
        <kbd
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 6px",
            borderRadius: 6,
            background: "rgba(145,158,171,0.12)",
            color: "#919EAB",
            fontSize: 11,
            fontFamily: "var(--font-primary)",
            border: "1px solid rgba(145,158,171,0.16)",
            flexShrink: 0,
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Store selector */}
      <div ref={storeRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => {
            setStoreOpen((v) => !v);
            setNotiOpen(false);
          }}
          aria-label="Chọn cửa hàng"
          aria-expanded={storeOpen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            border: "none",
            borderRadius: 10,
            background: storeOpen ? "rgba(47,100,246,0.08)" : "rgba(145,158,171,0.08)",
            color: storeOpen ? "#2F64F6" : "#637381",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            transition: "all 0.2s",
            fontFamily: "var(--font-primary)",
          }}
          onMouseEnter={(e) => {
            if (!storeOpen) e.currentTarget.style.background = "rgba(145,158,171,0.16)";
          }}
          onMouseLeave={(e) => {
            if (!storeOpen) e.currentTarget.style.background = "rgba(145,158,171,0.08)";
          }}
        >
          <Store size={16} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedStore.label}
          </span>
          <ChevronDown
            size={14}
            style={{
              transition: "transform 0.2s",
              transform: storeOpen ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
              opacity: 0.6,
            }}
          />
        </button>

        {storeOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 220,
              background: "#FFFFFF",
              borderRadius: 12,
              boxShadow: "0 12px 28px -4px rgba(145,158,171,0.2), 0 0 2px rgba(145,158,171,0.1)",
              zIndex: 100,
              padding: 4,
              border: "none",
            }}
          >
            {STORES.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => handleStoreSelect(store)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: 8,
                  background:
                    selectedStore.id === store.id ? "rgba(47,100,246,0.08)" : "transparent",
                  color:
                    selectedStore.id === store.id ? "#2F64F6" : "#212B36",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: selectedStore.id === store.id ? 600 : 400,
                  textAlign: "left",
                  fontFamily: "var(--font-primary)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (selectedStore.id !== store.id)
                    e.currentTarget.style.background = "rgba(145,158,171,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (selectedStore.id !== store.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <Store size={16} style={{ flexShrink: 0, opacity: 0.5 }} />
                {store.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div ref={notiRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => {
            setNotiOpen((v) => !v);
            setStoreOpen(false);
          }}
          aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""}`}
          aria-expanded={notiOpen}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            border: "none",
            borderRadius: 10,
            background: notiOpen ? "rgba(47,100,246,0.08)" : "transparent",
            color: notiOpen ? "#2F64F6" : "#637381",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!notiOpen) e.currentTarget.style.background = "rgba(145,158,171,0.08)";
          }}
          onMouseLeave={(e) => {
            if (!notiOpen) e.currentTarget.style.background = "transparent";
          }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                background: "#FF5630",
                color: "#FFFFFF",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {notiOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 360,
              background: "#FFFFFF",
              borderRadius: 12,
              boxShadow: "0 12px 28px -4px rgba(145,158,171,0.2), 0 0 2px rgba(145,158,171,0.1)",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px 12px",
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#212B36" }}>
                  Thông báo
                </div>
                {unreadCount > 0 && (
                  <div style={{ fontSize: 13, color: "#919EAB", marginTop: 2 }}>
                    Bạn có {unreadCount} thông báo chưa đọc
                  </div>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#2F64F6",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-primary)",
                    padding: 0,
                  }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
            <div
              style={{
                height: 1,
                background: "rgba(145,158,171,0.12)",
              }}
            />
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "14px 20px",
                    background: n.unread ? "rgba(47,100,246,0.04)" : "transparent",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(145,158,171,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = n.unread
                      ? "rgba(47,100,246,0.04)"
                      : "transparent";
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: n.unread ? "#2F64F6" : "transparent",
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#212B36",
                        lineHeight: 1.5,
                        fontWeight: n.unread ? 600 : 400,
                      }}
                    >
                      {n.text}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#919EAB", marginTop: 4 }}
                    >
                      {n.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <button
        type="button"
        aria-label="Cài đặt"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          border: "none",
          borderRadius: 10,
          background: "transparent",
          color: "#637381",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(145,158,171,0.08)";
          e.currentTarget.style.color = "#212B36";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#637381";
        }}
      >
        <Settings size={20} />
      </button>

      {/* Avatar */}
      <div
        className="topbar__profile"
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: 4,
          borderRadius: "50%",
          transition: "box-shadow 0.2s",
          border: "2px solid transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "2px solid rgba(47,100,246,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "2px solid transparent";
        }}
      >
        <Avatar
          name="Admin User"
          size={36}
          src="https://api.dicebear.com/9.x/notionists/svg?seed=AdminUser&backgroundColor=b6e3f4"
        />
      </div>
    </header>
  );
}
