import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleAlert,
  Clock3,
  CreditCard,
  MapPin,
  PackageSearch,
  ShieldAlert,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getOrderById,
  type OrderLineItem,
  type OrderRecord,
  type OrderType,
  type OrderWarningState,
} from "@/mocks/orders/orders";

const ORDER_TYPE_STYLES: Record<
  OrderType,
  { label: string; color: string; bg: string }
> = {
  online: {
    label: "Online",
    color: "var(--color-primary)",
    bg: "var(--color-primary-light)",
  },
  pos: { label: "POS", color: "#7C3AED", bg: "#F3E8FF" },
  erp: { label: "ERP / Logistics", color: "#0F766E", bg: "#CCFBF1" },
  returned: { label: "Đổi trả", color: "var(--color-warning)", bg: "#FEF3C7" },
};

const WARNING_STYLES: Record<
  Exclude<OrderWarningState, "none">,
  { label: string; color: string; bg: string }
> = {
  stale: {
    label: "Cần cập nhật",
    color: "var(--color-warning)",
    bg: "#FFF7ED",
  },
  conflict: {
    label: "Cần đối soát",
    color: "var(--color-error)",
    bg: "#FFE4E6",
  },
  restricted: { label: "Giới hạn quyền", color: "#7C3AED", bg: "#F3E8FF" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang giao": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Đã xuất hóa đơn": {
    color: "var(--color-primary)",
    bg: "var(--color-primary-light)",
  },
  "Đang xử lý kho": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đang xử lý đổi trả": { color: "#7C3AED", bg: "#F3E8FF" },
  "Cần review": { color: "var(--color-error)", bg: "#FFE4E6" },
};

function Eyebrow({ children }: { children: string }) {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 500,
        color: "var(--color-text-tertiary)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </span>
  );
}

function StatusChip({ label }: { label: string }) {
  const style = STATUS_STYLES[label] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };
  return <Badge label={label} color={style.color} bg={style.bg} />;
}

function WarningBanner({ warningState }: { warningState: OrderWarningState }) {
  if (warningState === "none") return null;

  const config = {
    stale: {
      icon: <Clock3 size={16} />,
      text: "Dữ liệu đang có dấu hiệu chưa mới. Cần xác nhận lại trước khi phản hồi khách ngay.",
    },
    conflict: {
      icon: <AlertTriangle size={16} />,
      text: "Trạng thái giữa các nguồn đang xung đột. Không nên chốt thông tin với khách nếu chưa review.",
    },
    restricted: {
      icon: <ShieldAlert size={16} />,
      text: "Vai trò hiện tại chỉ được xem tóm tắt. Chi tiết giao dịch và thông tin nhạy cảm đã bị ẩn.",
    },
  }[warningState];

  const style = WARNING_STYLES[warningState];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "var(--radius-md)",
        background: style.bg,
        color: style.color,
      }}
    >
      <div style={{ display: "flex", marginTop: 2 }}>{config.icon}</div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
          {style.label}
        </div>
        <div style={{ fontSize: "13px", lineHeight: 1.6 }}>{config.text}</div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        gap: "var(--space-3)",
        alignItems: "start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "13px",
          color: "var(--color-text-tertiary)",
        }}
      >
        <span style={{ display: "flex" }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function InfoStrip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
      }}
    >
      <span style={{ display: "flex", color: "var(--color-primary)" }}>
        {icon}
      </span>
      <div>
        <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
          {label}
        </div>
        <div style={{ fontSize: "13px", fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

function LineItemCard({ item }: { item: OrderLineItem }) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
        padding: "var(--space-4)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "var(--space-3)",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
          {item.productName}
        </div>
        <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          {item.sku} • {item.variant}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 600 }}>
          {item.price.toLocaleString("vi-VN")} đ
        </div>
        <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
          SL {item.qty}
        </div>
      </div>
    </div>
  );
}

function PipelineChart({ items }: { items: OrderRecord["timelineItems"] }) {
  const lastIdx = items.length - 1;

  return (
    <Card>
      <Eyebrow>Diễn tiến xử lý</Eyebrow>

      <div
        style={{
          marginTop: "var(--space-5)",
          display: "grid",
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: 0,
        }}
      >
        {items.map((item, i) => {
          const isCompleted = i < lastIdx;
          const isCurrent = i === lastIdx;

          return (
            <div
              key={`${item.title}-${i}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Dot row with lines */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Left line */}
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background:
                      i === 0
                        ? "transparent"
                        : i <= lastIdx && items[i - 1] !== undefined && i - 1 < lastIdx
                          ? "var(--color-success)"
                          : "var(--color-border)",
                  }}
                />

                {/* Dot */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    ...(isCompleted
                      ? { background: "var(--color-success)", color: "#fff" }
                      : isCurrent
                        ? {
                            background: "var(--color-primary)",
                            color: "#fff",
                            boxShadow: "0 0 0 4px var(--color-primary-light)",
                          }
                        : {
                            background: "var(--color-bg-card)",
                            border: "2px solid var(--color-border)",
                            color: "var(--color-text-tertiary)",
                          }),
                  }}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span style={{ fontSize: "11px", fontWeight: 700 }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Right line */}
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background:
                      i === lastIdx
                        ? "transparent"
                        : isCompleted
                          ? "var(--color-success)"
                          : "var(--color-border)",
                  }}
                />
              </div>

              {/* Label */}
              <div
                style={{
                  marginTop: "var(--space-3)",
                  textAlign: "center",
                  padding: "0 var(--space-2)",
                }}
              >
                <div
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: isCurrent
                      ? "var(--color-primary)"
                      : isCompleted
                        ? "var(--color-text-primary)"
                        : "var(--color-text-tertiary)",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-mono)",
                    marginTop: 3,
                  }}
                >
                  {item.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function OrderDetailContent({ order }: { order: OrderRecord }) {
  const navigate = useNavigate();
  const typeStyle = ORDER_TYPE_STYLES[order.orderType];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/orders")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-primary)",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-primary)",
            padding: 0,
            marginBottom: "var(--space-4)",
          }}
        >
          <ArrowLeft size={16} />
          Quay lại danh sách đơn hàng
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <Eyebrow>Chi tiết đơn hàng</Eyebrow>
            <h1
              style={{
                marginTop: "var(--space-2)",
                marginBottom: "var(--space-1)",
              }}
            >
              {order.orderCode}
            </h1>
            <div
              style={{
                color: "var(--color-text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              {order.customerName} • {order.customerTier}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              alignItems: "center",
            }}
          >
            <Badge
              label={typeStyle.label}
              color={typeStyle.color}
              bg={typeStyle.bg}
            />
            <StatusChip label={order.statusLabel} />
          </div>
        </div>
      </div>

      <WarningBanner warningState={order.warningState} />

      <PipelineChart items={order.timelineItems} />

      {/* Main content: 2-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "var(--space-6)",
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {/* Thông tin tổng quan */}
          <Card>
            <Eyebrow>Thông tin tổng quan</Eyebrow>
            <div
              style={{
                display: "grid",
                gap: "var(--space-3)",
                marginTop: "var(--space-4)",
              }}
            >
              <DetailRow
                icon={<PackageSearch size={15} />}
                label="Loại đơn"
                value={ORDER_TYPE_STYLES[order.orderType].label}
              />
              <DetailRow
                icon={<MapPin size={15} />}
                label="Điểm xử lý"
                value={order.branchName}
              />
              <DetailRow
                icon={<Store size={15} />}
                label="Kênh bán"
                value={order.salesChannel}
              />
              <DetailRow
                icon={<UserRound size={15} />}
                label="Đội phụ trách"
                value={order.ownerTeam}
              />
              <DetailRow
                icon={<Truck size={15} />}
                label="Giao vận"
                value={order.fulfillmentStatus}
              />
              <DetailRow
                icon={<CreditCard size={15} />}
                label="Thanh toán"
                value={`${order.paymentStatus} • ${order.paymentMethod}`}
              />
              <DetailRow
                icon={<Clock3 size={15} />}
                label="Tạo đơn"
                value={order.createdAt}
              />
              <DetailRow
                icon={<Clock3 size={15} />}
                label="Đồng bộ nguồn"
                value={order.sourceSyncedAt}
              />
            </div>
          </Card>

          {/* Sản phẩm trong đơn */}
          <Card>
            <Eyebrow>Sản phẩm trong đơn</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {order.lineItems.map((item) => (
                <LineItemCard key={`${item.sku}-${item.variant}`} item={item} />
              ))}
            </div>
            <div
              style={{
                marginTop: "var(--space-4)",
                paddingTop: "var(--space-3)",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600 }}>Tổng giá trị đơn</span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                }}
              >
                {order.orderValue.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </Card>

        </div>

        {/* Right column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
            position: "sticky",
            top: 0,
          }}
        >
          {/* Ngữ cảnh chăm sóc */}
          <Card>
            <Eyebrow>Ngữ cảnh chăm sóc</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-surface)",
                  padding: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Ghi chú dịch vụ
                </div>
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    color: "var(--color-text-secondary)",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {order.serviceNote}
                </div>
              </div>

              {(order.deliveryPartner ||
                order.trackingCode ||
                order.promisedDate) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  {order.deliveryPartner && (
                    <InfoStrip
                      icon={<Truck size={15} />}
                      label="Đơn vị vận chuyển"
                      value={order.deliveryPartner}
                    />
                  )}
                  {order.trackingCode && (
                    <InfoStrip
                      icon={<PackageSearch size={15} />}
                      label="Mã vận đơn"
                      value={order.trackingCode}
                    />
                  )}
                  {order.promisedDate && (
                    <InfoStrip
                      icon={<Clock3 size={15} />}
                      label="Ngày hẹn"
                      value={order.promisedDate}
                    />
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Hướng xử lý */}
          <Card>
            <Eyebrow>Hướng xử lý</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-surface)",
                  padding: "var(--space-4)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Hành động gợi ý
                </div>
                <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>
                  {order.nextActionLabel}
                </div>
              </div>

              {order.policyLinkLabel && (
                <button
                  style={{
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                    padding: "var(--space-4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-3)",
                    fontFamily: "var(--font-primary)",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <span>{order.policyLinkLabel}</span>
                  <ArrowUpRight size={16} />
                </button>
              )}

              {order.escalationAvailable && (
                <Button
                  variant="primary"
                  style={{ justifyContent: "center" }}
                >
                  <CircleAlert size={16} /> Tạo yêu cầu xử lý
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = id ? getOrderById(id) : null;

  if (!order) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-4)",
          padding: "var(--space-8)",
        }}
      >
        <CircleAlert
          size={42}
          style={{ color: "var(--color-text-tertiary)" }}
        />
        <h2>Không tìm thấy đơn hàng</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Đơn hàng với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/orders")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return <OrderDetailContent order={order} />;
}
