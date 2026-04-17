import { Badge, Card } from "@/shared/ui";
import {
  Barcode,
  Boxes,
  Package,
  Store,
  Tags,
  UserRound,
} from "lucide-react";
import { getCatalogRecordById } from "@/mocks/catalog/catalog";
import {
  DetailRow,
  EmptyResultCard,
  Eyebrow,
  SUMMARY_TONES,
  WARNING_STYLES,
  WarningBanner,
  useCatalogContext,
} from "@/modules/catalog-and-commerce/components/CatalogModuleLayout";

export function ProductCatalogPage() {
  const { result, filters, selectedId, setSelectedId } = useCatalogContext();

  if (result.kind === "not_found") {
    return <EmptyResultCard result={result} appliedQuery={filters.query} />;
  }

  const selectedRecord = getCatalogRecordById(selectedId ?? result.records[0]?.id ?? null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
        gap: "var(--space-6)",
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {result.records.map((record) => {
          const warningStyle =
            record.warningState === "none" ? null : WARNING_STYLES[record.warningState];

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
                      {record.category} • {record.collection}
                    </div>
                  </div>
                  <Badge
                    label={record.projectionScope}
                    color="var(--color-primary)"
                    bg="var(--color-primary-light)"
                  />
                </div>

                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  <Badge label={record.source} color="#0F766E" bg="#CCFBF1" />
                  <Badge
                    label={record.ownerTeam}
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
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "var(--space-3) var(--space-5)",
                  }}
                >
                  {record.summaryItems.map((item) => (
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
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {record.description}
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      <Card style={{ position: "sticky", top: 0 }}>
        {selectedRecord ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div>
              <Eyebrow>Sản phẩm</Eyebrow>
              <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                {selectedRecord.name}
              </h2>
              <div style={{ color: "var(--color-text-secondary)" }}>
                {selectedRecord.sku} • {selectedRecord.collection}
              </div>
            </div>

            <WarningBanner warningState={selectedRecord.warningState} />

            <section>
              <Eyebrow>Thông tin tổng quan</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
                <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={selectedRecord.sku} />
                <DetailRow icon={<Barcode size={15} />} label="Barcode chính" value={selectedRecord.barcode} />
                <DetailRow icon={<Tags size={15} />} label="Danh mục" value={selectedRecord.category} />
                <DetailRow icon={<Boxes size={15} />} label="Bộ sưu tập" value={selectedRecord.collection} />
                <DetailRow icon={<Store size={15} />} label="Nguồn" value={selectedRecord.source} />
                <DetailRow icon={<UserRound size={15} />} label="Đội phụ trách" value={selectedRecord.ownerTeam} />
              </div>
            </section>

            <section>
              <Eyebrow>Thuộc tính & biến thể</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
                <Card style={{ background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "var(--space-3)",
                    }}
                  >
                    {selectedRecord.attributes.map((attribute) => (
                      <div key={attribute.label}>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--color-text-tertiary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {attribute.label}
                        </div>
                        <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>
                          {attribute.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedRecord.variants.map((variant) => (
                  <div
                    key={variant.id}
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
                        {variant.color} • Size {variant.size}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                        {variant.sku} • {variant.barcode}
                      </div>
                    </div>
                    <Badge
                      label={variant.availabilityLabel}
                      color="var(--color-text-secondary)"
                      bg="var(--color-bg-card)"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Eyebrow>Ngữ cảnh bán hàng</Eyebrow>
              <Card
                style={{
                  marginTop: "var(--space-3)",
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
                  Phạm vi hiển thị hiện tại
                </div>
                <div style={{ marginTop: "var(--space-1)", fontWeight: 600 }}>
                  {selectedRecord.projectionScope}
                </div>
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedRecord.serviceNote}
                </div>
              </Card>
            </section>

            <section>
              <Eyebrow>Nguồn đối chiếu</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
                {selectedRecord.sourceTrace.map((item) => (
                  <div
                    key={`${item.system}-${item.field}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr",
                      gap: "var(--space-3)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {item.system}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
                        {item.field}
                      </div>
                      <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                        {item.value} • {item.syncedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div>
            <Eyebrow>Sản phẩm</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 sản phẩm để xem chi tiết
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một sản phẩm bên trái để xem thông tin chuẩn, biến thể, phạm vi hiển thị và nguồn đối chiếu.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
