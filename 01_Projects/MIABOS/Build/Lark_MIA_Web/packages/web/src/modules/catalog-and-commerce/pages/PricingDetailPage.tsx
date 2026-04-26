import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  CircleAlert,
  Clock3,
  Package,
  ScanText,
  ShieldAlert,
  Store,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { getCatalogRecordById } from "@/mocks/catalog/catalog";
import type { CatalogWarningState } from "@/mocks/catalog/catalog";
import {
  PriceAnswerCard,
  ConflictDetailBanner,
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

// ── Page Component ──────────────────────────────────────────────────

export function PricingDetailPage() {
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
        <Button onClick={() => navigate("/catalog/pricing")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  const warningStyle =
    record.warningState === "none" ? null : WARNING_STYLES[record.warningState];

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
        onClick={() => navigate("/catalog/pricing")}
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
        Quay lại danh sách giá bán
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
          <Eyebrow>Giá bán</Eyebrow>
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
          {record.pricingContexts[0] ? (
            <Badge
              label={record.pricingContexts[0].finalPrice}
              color="var(--color-primary)"
              bg="var(--color-primary-light)"
            />
          ) : null}
          {warningStyle ? (
            <Badge
              label={warningStyle.label}
              color={warningStyle.color}
              bg={warningStyle.bg}
            />
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
        {/* Left column - Pricing contexts */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {/* Conflict banner */}
          {record.pricingContexts.some((c) => c.warningState === "conflict") && (
            <ConflictDetailBanner
              sources={record.sourceTrace
                .filter((t) => t.field.toLowerCase().includes("price") || t.field.toLowerCase().includes("giá"))
                .map((t) => ({ system: t.system, value: t.value }))}
              ctaLabel="Liên hệ Finance để xác nhận"
            />
          )}

          <Card>
            <Eyebrow>Các mức giá hiện có</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {record.pricingContexts.map((context) => (
                <div key={context.id}>
                  <PriceAnswerCard
                    basePrice={context.basePrice}
                    finalPrice={context.finalPrice}
                    promotionLabel={context.promotionLabel}
                    contextLabel={context.contextLabel}
                    source={context.source}
                    syncedAt={context.syncedAt}
                    freshnessLabel={context.syncedAt}
                    hasConflict={context.warningState === "conflict"}
                  />
                  {context.traceNote && (
                    <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "var(--space-2)", paddingLeft: "var(--space-3)" }}>
                      {context.traceNote}
                    </div>
                  )}
                </div>
              ))}
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
          {/* Pricing decision context */}
          <Card>
            <Eyebrow>Quyết định giá hiện tại</Eyebrow>
            <div
              style={{
                display: "grid",
                gap: "var(--space-3)",
                marginTop: "var(--space-4)",
              }}
            >
              <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={record.sku} />
              <DetailRow icon={<Store size={15} />} label="Phạm vi hiển thị" value={record.projectionScope} />
              <DetailRow icon={<ScanText size={15} />} label="Nguồn chính" value={record.source} />
            </div>
          </Card>

          {/* Sensitivity notes */}
          <Card>
            <Eyebrow>Lưu ý quyền xem</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-surface)",
                padding: "var(--space-4)",
              }}
            >
              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                <ShieldAlert size={16} color="#7C3AED" />
                <div style={{ fontWeight: 600 }}>Thứ tự ưu tiên nguồn và thông tin nhạy cảm</div>
              </div>
              <div
                style={{
                  marginTop: "var(--space-2)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Giá nhập, biên lợi nhuận và mức giá dành cho đại lý chỉ hiển thị theo đúng phạm vi được phép xem. Khi chưa đủ căn cứ giữa các nguồn, hệ thống sẽ giữ cảnh báo thay vì tự kết luận.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
