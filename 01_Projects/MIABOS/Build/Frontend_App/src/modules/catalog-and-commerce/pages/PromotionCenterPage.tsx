import { Badge, Card } from "@/shared/ui";
import {
  Package,
  ShieldAlert,
  Sparkles,
  Store,
} from "lucide-react";
import { getCatalogRecordById, getVisiblePromotions } from "@/mocks/catalog/catalog";
import {
  DetailRow,
  EmptyResultCard,
  Eyebrow,
  WARNING_STYLES,
  WarningBanner,
  useCatalogContext,
} from "@/modules/catalog-and-commerce/components/CatalogModuleLayout";

export function PromotionCenterPage() {
  const { result, filters, selectedId, setSelectedId } = useCatalogContext();

  if (result.kind === "not_found") {
    return <EmptyResultCard result={result} appliedQuery={filters.query} />;
  }

  const selectedRecord = getCatalogRecordById(selectedId ?? result.records[0]?.id ?? null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.05fr) minmax(340px, 0.95fr)",
        gap: "var(--space-6)",
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {result.records.map((record) => {
          const promotions = getVisiblePromotions(record, filters);
          const primaryPromotion = promotions[0];
          const warningStyle =
            primaryPromotion && primaryPromotion.warningState !== "none"
              ? WARNING_STYLES[primaryPromotion.warningState]
              : null;

          return (
            <Card
              key={record.id}
              style={{
                cursor: "pointer",
                background:
                  record.id === selectedRecord?.id
                    ? "var(--color-primary-light)"
                    : "var(--color-bg-card)",
                boxShadow:
                  record.id === selectedRecord?.id
                    ? "0 18px 30px rgba(47, 100, 246, 0.14)"
                    : "var(--shadow-ambient)",
              }}
            >
              <button
                onClick={() => setSelectedId(record.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                  cursor: "pointer",
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
                      {record.sku}
                    </div>
                    <h3 style={{ marginBottom: "var(--space-1)" }}>{record.name}</h3>
                    <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      {promotions.length} CTKM / voucher khả dụng
                    </div>
                  </div>
                  <Badge
                    label={primaryPromotion ? primaryPromotion.discountLabel : "Chưa có CTKM"}
                    color="var(--color-primary)"
                    bg="var(--color-primary-light)"
                  />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {primaryPromotion ? (
                    <>
                      <Badge label={primaryPromotion.source} color="#0F766E" bg="#CCFBF1" />
                      <Badge
                        label={primaryPromotion.publicSafeLabel}
                        color="var(--color-text-secondary)"
                        bg="var(--color-bg-surface)"
                      />
                      {warningStyle ? (
                        <Badge
                          label={warningStyle.label}
                          color={warningStyle.color}
                          bg={warningStyle.bg}
                        />
                      ) : null}
                    </>
                  ) : null}
                </div>

                {primaryPromotion ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "var(--space-3)",
                    }}
                  >
                    <PromoCell label="Điều kiện" value={primaryPromotion.conditionLabel} />
                    <PromoCell label="Hiệu lực" value={primaryPromotion.validRange} />
                  </div>
                ) : null}
              </button>
            </Card>
          );
        })}
      </div>

      <Card style={{ position: "sticky", top: 0 }}>
        {selectedRecord ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div>
              <Eyebrow>Khuyến mãi</Eyebrow>
              <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                {selectedRecord.name}
              </h2>
              <div style={{ color: "var(--color-text-secondary)" }}>
                {selectedRecord.sku} • {selectedRecord.collection}
              </div>
            </div>

            <WarningBanner warningState={selectedRecord.warningState} />

            <section>
              <Eyebrow>Phạm vi áp dụng</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
                <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={selectedRecord.sku} />
                <DetailRow icon={<Store size={15} />} label="Phạm vi hiển thị" value={selectedRecord.projectionScope} />
                <DetailRow icon={<Sparkles size={15} />} label="Đội phụ trách" value={selectedRecord.ownerTeam} />
              </div>
            </section>

            <section>
              <Eyebrow>Danh sách CTKM / voucher</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {getVisiblePromotions(selectedRecord, filters).map((promotion) => {
                  const warningStyle =
                    promotion.warningState === "none"
                      ? null
                      : WARNING_STYLES[promotion.warningState];

                  return (
                    <div
                      key={promotion.id}
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
                            {promotion.name}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                            {promotion.scopeLabel}
                          </div>
                        </div>
                        <Badge
                          label={promotion.discountLabel}
                          color="var(--color-primary)"
                          bg="var(--color-primary-light)"
                        />
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                        <Badge label={promotion.source} color="#0F766E" bg="#CCFBF1" />
                        <Badge
                          label={promotion.publicSafeLabel}
                          color="var(--color-text-secondary)"
                          bg="var(--color-bg-card)"
                        />
                        {warningStyle ? (
                          <Badge
                            label={warningStyle.label}
                            color={warningStyle.color}
                            bg={warningStyle.bg}
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
                        <PromoCell label="Điều kiện" value={promotion.conditionLabel} />
                        <PromoCell label="Hiệu lực" value={promotion.validRange} />
                      </div>

                      <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                        {promotion.note}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <Eyebrow>Quy định hiển thị</Eyebrow>
              <Card
                style={{
                  marginTop: "var(--space-3)",
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
              </Card>
            </section>
          </div>
        ) : (
          <div>
            <Eyebrow>Khuyến mãi</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 sản phẩm để xem CTKM
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một sản phẩm bên trái để xem ưu đãi đang áp dụng, điều kiện hưởng và phạm vi hiển thị.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function PromoCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-card)",
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
        {label}
      </div>
      <div style={{ marginTop: "var(--space-1)", fontWeight: 600 }}>{value}</div>
    </div>
  );
}
