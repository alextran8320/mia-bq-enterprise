import { useState, type CSSProperties, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CircleAlert,
  Clock3,
  CreditCard,
  MapPin,
  PackageSearch,
  Search,
  ShieldAlert,
  Sparkles,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/shared/ui";
import {
  ORDER_QUICK_QUERIES,
  getOrderById,
  getOrderOverviewMetrics,
  searchOrders,
  type OrderLineItem,
  type OrderRecord,
  type OrderSearchResult,
  type OrderSummaryTone,
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

const SUMMARY_TONES: Record<OrderSummaryTone, CSSProperties> = {
  default: { color: "var(--color-text-primary)" },
  success: { color: "var(--color-success)" },
  warning: { color: "var(--color-warning)" },
  danger: { color: "var(--color-error)" },
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

const initialResult = searchOrders("");
const initialSelectedId =
  initialResult.kind === "found"
    ? (initialResult.records[0]?.id ?? null)
    : null;

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
  if (warningState === "none") {
    return null;
  }

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

function OverviewMetrics({ result }: { result: OrderSearchResult }) {
  const records = result.kind === "found" ? result.records : [];
  const metrics = getOrderOverviewMetrics(records);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "var(--space-4)",
      }}
    >
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <Eyebrow>{metric.label}</Eyebrow>
          <div
            style={{
              marginTop: "var(--space-2)",
              fontSize: "24px",
              fontWeight: 700,
              ...SUMMARY_TONES[metric.tone],
            }}
          >
            {metric.value}
          </div>
        </Card>
      ))}
    </div>
  );
}

function SearchPanel({
  draftQuery,
  setDraftQuery,
  onSubmit,
  onQuickQuery,
}: {
  draftQuery: string;
  setDraftQuery: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuickQuery: (query: string) => void;
}) {
  return (
    <Card
      style={{
        background:
          "linear-gradient(135deg, rgba(47, 100, 246, 0.08) 0%, rgba(255, 255, 255, 1) 46%, rgba(236, 244, 255, 1) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-4)",
          flexWrap: "wrap",
          marginBottom: "var(--space-5)",
        }}
      >
        <div>
          <Eyebrow>Điểm vào tra cứu</Eyebrow>
          <h2
            style={{
              marginTop: "var(--space-2)",
              marginBottom: "var(--space-2)",
            }}
          >
            Tìm nhanh theo mã đơn, SĐT hoặc tên khách
          </h2>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: 560 }}>
            Dữ liệu được tổng hợp theo góc nhìn vận hành để CSKH, cửa hàng và
            logistics có thể phản hồi nhanh cùng một ngữ cảnh.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            flexWrap: "wrap",
            alignContent: "flex-start",
          }}
        >
          <Badge
            label="Haravan"
            color="var(--color-primary)"
            bg="var(--color-primary-light)"
          />
          <Badge label="KiotViet" color="#7C3AED" bg="#F3E8FF" />
          <Badge label="SAP B1" color="#0F766E" bg="#CCFBF1" />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Input
            icon={<Search size={16} />}
            placeholder="Nhập mã đơn, SĐT, tên khách..."
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            style={{ flex: "1 1 360px", minWidth: 280 }}
          />
          <Button type="submit">
            <Search size={16} /> Tra cứu
          </Button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          <SearchHint
            icon={<PackageSearch size={16} />}
            title="Mã đơn / mã tham chiếu"
            text="Ví dụ: BQ-ONLINE-2048, SAP-SO-1172"
          />
          <SearchHint
            icon={<UserRound size={16} />}
            title="Khách hàng"
            text="Tìm theo tên hoặc SĐT để đối chiếu lịch sử xử lý"
          />
          <SearchHint
            icon={<Sparkles size={16} />}
            title="Truy vấn nhanh"
            text="Dùng các preset bên dưới để mở nhanh nhóm đơn cần xử lý"
          />
        </div>

        <div
          style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
        >
          {ORDER_QUICK_QUERIES.map((item) => (
            <Button
              key={item.query}
              type="button"
              variant="secondary"
              onClick={() => onQuickQuery(item.query)}
              style={{ padding: "8px 14px", fontSize: "12px" }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </form>
    </Card>
  );
}

function SearchHint({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-3)",
        alignItems: "flex-start",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "rgba(255,255,255,0.72)",
      }}
    >
      <div
        style={{ display: "flex", color: "var(--color-primary)", marginTop: 2 }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
          {title}
        </div>
        <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
          {text}
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  selected,
  onSelect,
}: {
  order: OrderRecord;
  selected: boolean;
  onSelect: (orderId: string) => void;
}) {
  const typeStyle = ORDER_TYPE_STYLES[order.orderType];
  const warningStyle =
    order.warningState === "none" ? null : WARNING_STYLES[order.warningState];

  return (
    <Card
      style={{
        cursor: "pointer",
        background: selected
          ? "var(--color-primary-light)"
          : "var(--color-bg-card)",
        boxShadow: selected
          ? "0 18px 30px rgba(47, 100, 246, 0.14)"
          : "var(--shadow-ambient)",
      }}
    >
      <button
        onClick={() => onSelect(order.id)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          fontFamily: "var(--font-primary)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: "13px",
                marginBottom: "var(--space-1)",
              }}
            >
              {order.orderCode}
            </div>
            <h3 style={{ marginBottom: "var(--space-1)" }}>
              {order.customerName}
            </h3>
            <div
              style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}
            >
              {order.customerTier} • {order.salesChannel}
            </div>
          </div>
          <StatusChip label={order.statusLabel} />
        </div>

        <div
          style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}
        >
          <Badge
            label={typeStyle.label}
            color={typeStyle.color}
            bg={typeStyle.bg}
          />
          <Badge
            label={order.source}
            color="var(--color-text-secondary)"
            bg="var(--color-bg-surface)"
          />
          <Badge
            label={order.ownerTeam}
            color="var(--color-text-secondary)"
            bg="#F8FBFF"
          />
          {warningStyle ? (
            <Badge
              label={warningStyle.label}
              color={warningStyle.color}
              bg={warningStyle.bg}
            />
          ) : null}
          {order.escalationAvailable ? (
            <Badge
              label="Cần xử lý thêm"
              color="var(--color-error)"
              bg="#FFF1F2"
            />
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "var(--space-3) var(--space-5)",
          }}
        >
          {order.summaryItems.map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  marginTop: "var(--space-1)",
                  fontWeight: 500,
                  ...SUMMARY_TONES[item.tone ?? "default"],
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          <InfoStrip
            icon={<Store size={15} />}
            label="Điểm xử lý"
            value={order.branchName}
          />
          <InfoStrip
            icon={<Truck size={15} />}
            label="Giao vận"
            value={order.deliveryPartner ?? order.fulfillmentStatus}
          />
        </div>

        <WarningBanner warningState={order.warningState} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Hướng xử lý
            </div>
            <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>
              {order.nextActionLabel}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "11px",
                color: "var(--color-text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Đồng bộ nguồn
            </div>
            <div
              style={{
                marginTop: "var(--space-1)",
                color: "var(--color-text-secondary)",
              }}
            >
              {order.sourceSyncedAt}
            </div>
          </div>
        </div>
      </button>
    </Card>
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

function DetailPanel({ order }: { order: OrderRecord | null }) {
  if (!order) {
    return (
      <Card>
        <Eyebrow>Chi tiết đơn hàng</Eyebrow>
        <h2
          style={{
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-3)",
          }}
        >
          Chọn 1 đơn để xem chi tiết
        </h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Chọn một thẻ đơn hàng để xem trạng thái hiện tại, nguồn dữ liệu, sản
          phẩm trong đơn và hướng xử lý tiếp theo.
        </p>
      </Card>
    );
  }

  return (
    <Card style={{ position: "sticky", top: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          alignItems: "flex-start",
          marginBottom: "var(--space-5)",
        }}
      >
        <div>
          <Eyebrow>Chi tiết đơn hàng</Eyebrow>
          <h2
            style={{
              marginTop: "var(--space-2)",
              marginBottom: "var(--space-1)",
            }}
          >
            {order.orderCode}
          </h2>
          <div style={{ color: "var(--color-text-secondary)" }}>
            {order.customerName} • {order.customerTier}
          </div>
        </div>
        <StatusChip label={order.statusLabel} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <WarningBanner warningState={order.warningState} />

        <section>
          <Eyebrow>Thông tin tổng quan</Eyebrow>
          <div
            style={{
              display: "grid",
              gap: "var(--space-3)",
              marginTop: "var(--space-3)",
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
        </section>

        <section>
          <Eyebrow>Sản phẩm trong đơn</Eyebrow>
          <div
            style={{
              marginTop: "var(--space-3)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {order.lineItems.map((item) => (
              <LineItemCard key={`${item.sku}-${item.variant}`} item={item} />
            ))}
          </div>
        </section>

        <section>
          <Eyebrow>Ngữ cảnh chăm sóc</Eyebrow>
          <div
            style={{
              marginTop: "var(--space-3)",
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
                }}
              >
                {order.serviceNote}
              </div>
            </div>

            {order.deliveryPartner ||
            order.trackingCode ||
            order.promisedDate ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "var(--space-3)",
                }}
              >
                {order.deliveryPartner ? (
                  <InfoStrip
                    icon={<Truck size={15} />}
                    label="Đơn vị vận chuyển"
                    value={order.deliveryPartner}
                  />
                ) : null}
                {order.trackingCode ? (
                  <InfoStrip
                    icon={<PackageSearch size={15} />}
                    label="Mã vận đơn"
                    value={order.trackingCode}
                  />
                ) : null}
                {order.promisedDate ? (
                  <InfoStrip
                    icon={<Clock3 size={15} />}
                    label="Ngày hẹn"
                    value={order.promisedDate}
                  />
                ) : null}
                <InfoStrip
                  icon={<CreditCard size={15} />}
                  label="Giá trị đơn"
                  value={order.orderValue + " đ"}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <Eyebrow>Hướng xử lý</Eyebrow>
          <div
            style={{
              marginTop: "var(--space-3)",
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

            {order.policyLinkLabel ? (
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
            ) : null}

            {order.escalationAvailable ? (
              <Button variant="primary" style={{ justifyContent: "center" }}>
                <CircleAlert size={16} /> Tạo yêu cầu xử lý
              </Button>
            ) : null}
          </div>
        </section>

        <section>
          <Eyebrow>Diễn tiến xử lý</Eyebrow>
          <div
            style={{
              marginTop: "var(--space-3)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {order.timelineItems.map((item) => (
              <div
                key={`${item.title}-${item.timestamp}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "84px 1fr",
                  gap: "var(--space-3)",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.timestamp}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "13px",
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Card>
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
        gridTemplateColumns: "132px 1fr",
        gap: "var(--space-3)",
        alignItems: "start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "12px",
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

function ResultSummary({
  result,
  appliedQuery,
}: {
  result: OrderSearchResult;
  appliedQuery: string;
}) {
  if (result.kind === "not_found") {
    return (
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-md)",
              background: "#FFF1F2",
              color: "var(--color-error)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CircleAlert size={18} />
          </div>
          <div>
            <Eyebrow>Không tìm thấy</Eyebrow>
            <h2
              style={{
                marginTop: "var(--space-2)",
                marginBottom: "var(--space-2)",
              }}
            >
              Không tìm thấy đơn phù hợp
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-4)",
              }}
            >
              Từ khóa{" "}
              <span style={{ fontFamily: "var(--font-mono)" }}>
                {appliedQuery || "(trống)"}
              </span>{" "}
              chưa khớp với dữ liệu hiện có.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              {result.suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  label={suggestion}
                  color="var(--color-text-secondary)"
                  bg="var(--color-bg-surface)"
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        flexWrap: "wrap",
      }}
    >
      <div>
        <Eyebrow>Tổng quan kết quả</Eyebrow>
        <h3
          style={{
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-1)",
          }}
        >
          Tra cứu đơn hàng
        </h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
          {appliedQuery.trim().length === 0
            ? "Đang hiển thị các đơn hàng nổi bật gần đây để thuận tiện tra cứu nhanh."
            : `Tìm thấy ${result.records.length} kết quả cho truy vấn "${appliedQuery}".`}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          justifyContent: "flex-end",
        }}
      >
        <Badge
          label={`${result.records.length} đơn hàng`}
          color="var(--color-primary)"
          bg="var(--color-primary-light)"
        />
        <Badge
          label="Đa nguồn dữ liệu"
          color="var(--color-text-secondary)"
          bg="var(--color-bg-surface)"
        />
        <Badge
          label="Sẵn sàng xử lý"
          color="var(--color-warning)"
          bg="#FFF7ED"
        />
      </div>
    </Card>
  );
}

export function OrderSummaryPage() {
  const [draftQuery, setDraftQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [result, setResult] = useState<OrderSearchResult>(initialResult);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId,
  );

  const selectedOrder = selectedId ? getOrderById(selectedId) : null;

  function commitSearch(query: string) {
    const nextResult = searchOrders(query);
    setAppliedQuery(query);
    setResult(nextResult);

    if (nextResult.kind === "found") {
      setSelectedId(nextResult.records[0]?.id ?? null);
      return;
    }

    setSelectedId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitSearch(draftQuery);
  }

  function applyQuickQuery(query: string) {
    setDraftQuery(query);
    commitSearch(query);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div>
        <Eyebrow>Đơn hàng và dịch vụ</Eyebrow>
        <h1
          style={{
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-3)",
          }}
        >
          Tra cứu đơn hàng
        </h1>
        <p style={{ color: "var(--color-text-secondary)", maxWidth: 820 }}>
          Theo dõi trạng thái đơn hàng, nguồn dữ liệu, giao vận và hướng xử lý
          tiếp theo để phản hồi khách hoặc phối hợp nhanh giữa CSKH, cửa hàng và
          logistics.
        </p>
      </div>

      <OverviewMetrics result={result} />
      <SearchPanel
        draftQuery={draftQuery}
        setDraftQuery={setDraftQuery}
        onSubmit={handleSubmit}
        onQuickQuery={applyQuickQuery}
      />
      <ResultSummary result={result} appliedQuery={appliedQuery} />

      <div
        style={{
          display: "flex",
          gap: "var(--space-6)",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 1 700px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {result.kind === "found"
            ? result.records.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  selected={order.id === selectedId}
                  onSelect={setSelectedId}
                />
              ))
            : null}
        </div>
        <div style={{ flex: "0 1 420px", minWidth: 340 }}>
          <DetailPanel order={selectedOrder} />
        </div>
      </div>
    </div>
  );
}
