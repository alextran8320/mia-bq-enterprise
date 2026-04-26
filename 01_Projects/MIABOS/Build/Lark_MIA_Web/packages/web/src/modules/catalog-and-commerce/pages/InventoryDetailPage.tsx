import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  Boxes,
  CircleAlert,
  Clock3,
  Package,
  ShieldAlert,
  Store,
  Truck,
  Warehouse,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { getCatalogRecordById } from "@/mocks/catalog/catalog";
import type { CatalogWarningState } from "@/mocks/catalog/catalog";
import {
  AvailabilityStatusBadge,
  FreshnessBadge,
} from "@/modules/catalog-and-commerce/components/CatalogSharedComponents";

// ── Local helpers (copied from CatalogModuleLayout) ─────────────────

const WARNING_STYLES: Record<
  Exclude<CatalogWarningState, "none">,
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
  needs_review: { label: "Cần review", color: "#C2410C", bg: "#FFEDD5" },
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

function WarningBanner({
  warningState,
}: {
  warningState: CatalogWarningState;
}) {
  if (warningState === "none") return null;

  const config = {
    stale: {
      icon: <Clock3 size={16} />,
      text: "Dữ liệu đang cũ hơn ngưỡng tin cậy. Nên xác nhận lại trước khi tư vấn hoặc chốt xử lý.",
    },
    conflict: {
      icon: <ArrowRightLeft size={16} />,
      text: "Các nguồn đang cho kết quả chưa đồng nhất. Không nên kết luận nếu chưa đối soát thêm.",
    },
    restricted: {
      icon: <ShieldAlert size={16} />,
      text: "Một phần thông tin đã bị ẩn theo vai trò hiện tại. Chỉ hiển thị các nội dung phù hợp để tư vấn.",
    },
    needs_review: {
      icon: <AlertTriangle size={16} />,
      text: "Trường hợp này nên review nhanh với bộ phận phụ trách trước khi phản hồi khách hoặc cửa hàng.",
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
        gridTemplateColumns: "144px 1fr",
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

function DetailCard({
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
        alignItems: "flex-start",
        gap: "var(--space-2)",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-card)",
      }}
    >
      <span style={{ display: "flex", color: "var(--color-primary)" }}>{icon}</span>
      <div>
        <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>{label}</div>
        <div style={{ fontSize: "13px", fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

// ── Page Component ──────────────────────────────────────────────────

export function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getCatalogRecordById(id) : null;

  if (!record) {
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
        <h2>Không tìm thấy sản phẩm</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Sản phẩm với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/catalog/inventory")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/catalog/inventory")}
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
        }}
      >
        <ArrowLeft size={16} />
        Quay lại danh sách tồn kho
      </button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <Eyebrow>Tồn kho</Eyebrow>
          <h1
            style={{
              marginTop: "var(--space-2)",
              marginBottom: "var(--space-1)",
            }}
          >
            {record.name}
          </h1>
          <div
            style={{
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            {record.sku} • {record.collection}
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          {record.inventoryLocations[0] ? (
            <AvailabilityStatusBadge label={record.inventoryLocations[0].availabilityLabel} />
          ) : null}
        </div>
      </div>

      <WarningBanner warningState={record.warningState} />

      {/* 2-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "var(--space-6)",
          alignItems: "start",
        }}
      >
        {/* Left column - Inventory by location */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <Card>
            <Eyebrow>Tồn theo điểm bán / kho</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {record.inventoryLocations.map((location) => {
                const locWarningStyle =
                  location.warningState === "none"
                    ? null
                    : WARNING_STYLES[location.warningState];

                return (
                  <div
                    key={location.id}
                    style={{
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-bg-surface)",
                      padding: "var(--space-4)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "var(--space-3)",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
                          {location.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                          {location.scopeLabel}
                        </div>
                      </div>
                      <AvailabilityStatusBadge label={location.availabilityLabel} />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      <Badge label={location.source} color="#0F766E" bg="#CCFBF1" />
                      <FreshnessBadge label={location.freshnessLabel} />
                      {locWarningStyle ? (
                        <Badge
                          label={locWarningStyle.label}
                          color={locWarningStyle.color}
                          bg={locWarningStyle.bg}
                        />
                      ) : null}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: "var(--space-3)",
                      }}
                    >
                      <DetailCard
                        icon={<Warehouse size={15} />}
                        label="Số lượng"
                        value={location.quantityLabel}
                      />
                      <DetailCard
                        icon={<Clock3 size={15} />}
                        label="Thời điểm sync"
                        value={location.syncedAt}
                      />
                    </div>

                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {location.nextAction}
                    </div>
                  </div>
                );
              })}
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
          {/* Current context */}
          <Card>
            <Eyebrow>Ngữ cảnh hiện tại</Eyebrow>
            <div
              style={{
                display: "grid",
                gap: "var(--space-3)",
                marginTop: "var(--space-4)",
              }}
            >
              <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={record.sku} />
              <DetailRow icon={<Boxes size={15} />} label="Danh mục" value={record.category} />
              <DetailRow icon={<Store size={15} />} label="Phạm vi hiển thị" value={record.projectionScope} />
              <DetailRow icon={<Clock3 size={15} />} label="Đồng bộ record" value={record.syncedAt} />
            </div>
          </Card>

          {/* Handling guidance */}
          <Card>
            <Eyebrow>Hướng xử lý</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-surface)",
                padding: "var(--space-4)",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>
                Gợi ý xử lý cho bán hàng và vận hành
              </div>
              <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Nếu dữ liệu đã cũ hoặc đang có chênh lệch giữa các nguồn, chỉ nên tư vấn theo hướng tham khảo và kiểm tra lại tồn thực tế trước khi giữ hàng hoặc điều chuyển.
              </div>
              <Button variant="secondary" style={{ marginTop: "var(--space-3)" }}>
                <Truck size={16} /> Đề xuất kiểm tra tức thời
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
