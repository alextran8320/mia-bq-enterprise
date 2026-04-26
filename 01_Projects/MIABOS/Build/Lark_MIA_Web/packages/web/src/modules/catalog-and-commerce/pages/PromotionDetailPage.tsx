import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  CircleAlert,
  Clock3,
  Package,
  ShieldAlert,
  Sparkles,
  Store,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { getCatalogRecordById, getVisiblePromotions } from "@/mocks/catalog/catalog";
import type { CatalogWarningState, CatalogSearchFilters } from "@/mocks/catalog/catalog";
import {
  PromotionItemCard,
  NoPromotionState,
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

// ── Default filters for standalone detail page ──────────────────────

const DEFAULT_FILTERS: CatalogSearchFilters = {
  query: "",
  channel: "all",
  storeType: "all",
  branch: "all",
};

// ── Page Component ──────────────────────────────────────────────────

export function PromotionDetailPage() {
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
        <Button onClick={() => navigate("/catalog/promotions")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  const promos = getVisiblePromotions(record, DEFAULT_FILTERS);
  const hasConflict = promos.some((p) => p.warningState === "conflict");

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
        onClick={() => navigate("/catalog/promotions")}
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
        Quay lại danh sách khuyến mãi
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
          <Eyebrow>Khuyến mãi</Eyebrow>
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
          <Badge
            label={`${promos.length} CTKM`}
            color="var(--color-primary)"
            bg="var(--color-primary-light)"
          />
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
        {/* Left column - Promotions list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {/* Conflict banner */}
          {hasConflict && (
            <ConflictDetailBanner
              sources={promos
                .filter((p) => p.warningState !== "none")
                .map((p) => ({ system: p.source, value: `${p.name} — ${p.discountLabel}` }))}
              ctaLabel="Liên hệ Marketing"
            />
          )}

          <Card>
            <Eyebrow>Danh sách CTKM / voucher</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {promos.length === 0 ? (
                <NoPromotionState context={`${record.sku} · ${record.collection}`} />
              ) : (
                promos.map((promotion, index) => {
                  const promoWarningStyle =
                    promotion.warningState === "none"
                      ? null
                      : WARNING_STYLES[promotion.warningState];

                  return (
                    <div
                      key={promotion.id}
                      style={{
                        animation: `fadeIn 200ms ease-out ${Math.min(index, 7) * 50}ms both`,
                      }}
                    >
                      <PromotionItemCard
                        name={promotion.name}
                        discountLabel={promotion.discountLabel}
                        conditionLabel={promotion.conditionLabel}
                        scopeLabel={promotion.scopeLabel}
                        validRange={promotion.validRange}
                        source={promotion.source}
                        publicSafeLabel={promotion.publicSafeLabel}
                        note={promotion.note}
                        warningLabel={promoWarningStyle?.label}
                      />
                    </div>
                  );
                })
              )}
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
          {/* Promotion scope */}
          <Card>
            <Eyebrow>Phạm vi áp dụng</Eyebrow>
            <div
              style={{
                display: "grid",
                gap: "var(--space-3)",
                marginTop: "var(--space-4)",
              }}
            >
              <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={record.sku} />
              <DetailRow icon={<Store size={15} />} label="Phạm vi hiển thị" value={record.projectionScope} />
              <DetailRow icon={<Sparkles size={15} />} label="Đội phụ trách" value={record.ownerTeam} />
            </div>
          </Card>

          {/* Display control regulations */}
          <Card>
            <Eyebrow>Quy định hiển thị</Eyebrow>
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
                <div style={{ fontWeight: 600 }}>Kiểm soát phạm vi hiển thị</div>
              </div>
              <div
                style={{
                  marginTop: "var(--space-2)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Chỉ những chương trình đủ điều kiện tư vấn rộng mới được hiển thị đầy đủ cho toàn bộ đội ngũ. Các ưu đãi nội bộ hoặc điều kiện đặc biệt sẽ được giới hạn theo vai trò truy cập.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
