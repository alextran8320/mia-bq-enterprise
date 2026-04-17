import { Badge, Card } from "@/shared/ui";
import {
  Package,
  ScanText,
  ShieldAlert,
  Store,
} from "lucide-react";
import { getCatalogRecordById, getPrimaryPricing } from "@/mocks/catalog/catalog";
import {
  DetailRow,
  EmptyResultCard,
  Eyebrow,
  WARNING_STYLES,
  WarningBanner,
  useCatalogContext,
} from "@/modules/catalog-and-commerce/components/CatalogModuleLayout";
import {
  PriceAnswerCard,
  ConflictDetailBanner,
} from "@/modules/catalog-and-commerce/components/CatalogSharedComponents";

export function PricingCenterPage() {
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
          const primaryPricing = getPrimaryPricing(record, filters);
          const warningStyle =
            primaryPricing && primaryPricing.warningState !== "none"
              ? WARNING_STYLES[primaryPricing.warningState]
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
                      {primaryPricing?.contextLabel ?? "Chưa có ngữ cảnh giá phù hợp"}
                    </div>
                  </div>
                  {primaryPricing ? (
                    <Badge
                      label={primaryPricing.finalPrice}
                      color="var(--color-primary)"
                      bg="var(--color-primary-light)"
                    />
                  ) : null}
                </div>

                {primaryPricing ? (
                  <>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      <Badge label={primaryPricing.source} color="#0F766E" bg="#CCFBF1" />
                      {primaryPricing.promotionLabel ? (
                        <Badge
                          label="Có khuyến mãi áp dụng"
                          color="#C2410C"
                          bg="#FFEDD5"
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

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: "var(--space-3)",
                      }}
                    >
                      <PriceCell label="Giá cơ sở" value={primaryPricing.basePrice} />
                      <PriceCell label="Giá kết luận" value={primaryPricing.finalPrice} />
                    </div>

                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {primaryPricing.traceNote}
                    </div>
                  </>
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
              <Eyebrow>Giá bán</Eyebrow>
              <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                {selectedRecord.name}
              </h2>
              <div style={{ color: "var(--color-text-secondary)" }}>
                {selectedRecord.sku} • {selectedRecord.collection}
              </div>
            </div>

            <WarningBanner warningState={selectedRecord.warningState} />

            <section>
              <Eyebrow>Quyết định giá hiện tại</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
                <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={selectedRecord.sku} />
                <DetailRow icon={<Store size={15} />} label="Phạm vi hiển thị" value={selectedRecord.projectionScope} />
                <DetailRow icon={<ScanText size={15} />} label="Nguồn chính" value={selectedRecord.source} />
              </div>
            </section>

            {selectedRecord.pricingContexts.some((c) => c.warningState === "conflict") && (
              <ConflictDetailBanner
                sources={selectedRecord.sourceTrace
                  .filter((t) => t.field.toLowerCase().includes("price") || t.field.toLowerCase().includes("giá"))
                  .map((t) => ({ system: t.system, value: t.value }))}
                ctaLabel="Liên hệ Finance để xác nhận"
              />
            )}

            <section>
              <Eyebrow>Các mức giá hiện có</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {selectedRecord.pricingContexts.map((context) => (
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
            </section>

            <section>
              <Eyebrow>Lưu ý quyền xem</Eyebrow>
              <Card
                style={{
                  marginTop: "var(--space-3)",
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
              </Card>
            </section>
          </div>
        ) : (
          <div>
            <Eyebrow>Giá bán</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 sản phẩm để xem quyết định giá
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một sản phẩm bên trái để xem giá cơ sở, giá áp dụng, khuyến mãi đi kèm và nguồn tham chiếu.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function PriceCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
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
