import { useRef, useState } from "react";
import { Bell, ChevronDown, Search, Store } from "lucide-react";
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

export function TopBar() {
  const [selectedStore, setSelectedStore] = useState<(typeof STORES)[number]>(STORES[0]!);
  const [storeOpen, setStoreOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const storeRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

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
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "0 var(--space-6)",
        background: "rgba(246,249,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Store dropdown */}
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
            gap: "var(--space-2)",
            padding: "7px 12px",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "var(--radius-sm)",
            background: storeOpen ? "var(--color-primary-light)" : "white",
            color: "var(--color-text-primary)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            transition: "background 0.15s",
            fontFamily: "var(--font-primary)",
          }}
        >
          <Store size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
          <span
            style={{
              whiteSpace: "nowrap",
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedStore.label}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: "var(--color-text-tertiary)",
              transition: "transform 0.15s",
              transform: storeOpen ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          />
        </button>

        {storeOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              minWidth: 220,
              background: "white",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 8px 24px rgba(1,54,82,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
              zIndex: 100,
              padding: "var(--space-1)",
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
                  gap: "var(--space-2)",
                  width: "100%",
                  padding: "9px 12px",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background:
                    selectedStore.id === store.id ? "var(--color-primary-light)" : "transparent",
                  color:
                    selectedStore.id === store.id
                      ? "var(--color-primary)"
                      : "var(--color-text-primary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: selectedStore.id === store.id ? 600 : 400,
                  textAlign: "left",
                  fontFamily: "var(--font-primary)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (selectedStore.id !== store.id)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--color-bg-surface)";
                }}
                onMouseLeave={(e) => {
                  if (selectedStore.id !== store.id)
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <Store size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
                {store.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div
        className="topbar__search"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          background: "white",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 14px",
          maxWidth: 440,
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-primary)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 0 3px var(--color-primary-muted)";
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,0,0,0.07)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <Search size={15} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
        <input
          placeholder="Tìm kiếm khách hàng, đơn hàng, sản phẩm..."
          aria-label="Tìm kiếm toàn hệ thống"
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
        <kbd
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 6px",
            borderRadius: 4,
            background: "var(--color-bg-surface)",
            color: "var(--color-text-tertiary)",
            fontSize: "11px",
            fontFamily: "var(--font-primary)",
            border: "1px solid rgba(0,0,0,0.08)",
            flexShrink: 0,
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

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
            width: 36,
            height: 36,
            border: "none",
            borderRadius: "var(--radius-sm)",
            background: notiOpen ? "var(--color-primary-light)" : "transparent",
            color: notiOpen ? "var(--color-primary)" : "var(--color-text-secondary)",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!notiOpen) {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-surface)";
            }
          }}
          onMouseLeave={(e) => {
            if (!notiOpen) {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#E11D48",
                border: "2px solid #FFFFFF",
              }}
            />
          )}
        </button>

        {notiOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              width: 320,
              background: "white",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 8px 24px rgba(1,54,82,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px 10px",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <strong style={{ fontSize: 13, color: "var(--color-text-primary)" }}>
                Thông báo
              </strong>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  style={{
                    border: "none",
                    background: "none",
                    color: "var(--color-primary)",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "var(--font-primary)",
                    padding: 0,
                  }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    padding: "11px 16px",
                    background: n.unread ? "rgba(47,100,246,0.04)" : "transparent",
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "var(--color-bg-surface)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = n.unread
                      ? "rgba(47,100,246,0.04)"
                      : "transparent";
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: n.unread ? "var(--color-primary)" : "transparent",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.5,
                        fontWeight: n.unread ? 500 : 400,
                      }}
                    >
                      {n.text}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}
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

      {/* Avatar */}
      <div
        className="topbar__profile"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          cursor: "pointer",
          padding: "4px 8px 4px 4px",
          borderRadius: "var(--radius-sm)",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "var(--color-bg-surface)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <Avatar
          name="Admin User"
          size={30}
          src="https://api.dicebear.com/9.x/notionists/svg?seed=AdminUser&backgroundColor=b6e3f4"
        />
        <span
          style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontWeight: 500 }}
        >
          Admin
        </span>
        <ChevronDown size={13} style={{ color: "var(--color-text-tertiary)" }} />
      </div>
    </header>
  );
}
