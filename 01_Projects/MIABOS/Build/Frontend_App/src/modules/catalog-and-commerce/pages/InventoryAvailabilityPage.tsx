import { Badge, Button, Card } from "@/shared/ui";
import {
  Boxes,
  Clock3,
  Package,
  Store,
  Truck,
  Warehouse,
} from "lucide-react";
import { getCatalogRecordById, getPrimaryInventory } from "@/mocks/catalog/catalog";
import {
  DetailRow,
  EmptyResultCard,
  Eyebrow,
  WARNING_STYLES,
  WarningBanner,
  useCatalogContext,
} from "@/modules/catalog-and-commerce/components/CatalogModuleLayout";

export function InventoryAvailabilityPage() {
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
          const primaryInventory = getPrimaryInventory(record, filters);
          const warningStyle =
            primaryInventory && primaryInventory.warningState !== "none"
              ? WARNING_STYLES[primaryInventory.warningState]
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
                      {primaryInventory?.scopeLabel ?? "Chưa có scope"} • {record.category}
                    </div>
                  </div>
                  {primaryInventory ? (
                    <Badge
                      label={primaryInventory.availabilityLabel}
                      color="var(--color-primary)"
                      bg="var(--color-primary-light)"
                    />
                  ) : null}
                </div>

                {primaryInventory ? (
                  <>
                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                      <Badge label={primaryInventory.source} color="#0F766E" bg="#CCFBF1" />
                      <Badge
                        label={primaryInventory.freshnessLabel}
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
                        gap: "var(--space-3)",
                      }}
                    >
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
                          Khả dụng
                        </div>
                        <div style={{ marginTop: "var(--space-1)", fontWeight: 600 }}>
                          {primaryInventory.quantityLabel}
                        </div>
                      </div>
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
                          Đồng bộ
                        </div>
                        <div style={{ marginTop: "var(--space-1)", fontWeight: 600 }}>
                          {primaryInventory.syncedAt}
                        </div>
                      </div>
                    </div>

                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {primaryInventory.nextAction}
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
              <Eyebrow>Tồn kho</Eyebrow>
              <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                {selectedRecord.name}
              </h2>
              <div style={{ color: "var(--color-text-secondary)" }}>
                {selectedRecord.sku} • {selectedRecord.collection}
              </div>
            </div>

            <WarningBanner warningState={selectedRecord.warningState} />

            <section>
              <Eyebrow>Ngữ cảnh hiện tại</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
                <DetailRow icon={<Package size={15} />} label="SKU chuẩn" value={selectedRecord.sku} />
                <DetailRow icon={<Boxes size={15} />} label="Danh mục" value={selectedRecord.category} />
                <DetailRow icon={<Store size={15} />} label="Phạm vi hiển thị" value={selectedRecord.projectionScope} />
                <DetailRow icon={<Clock3 size={15} />} label="Đồng bộ record" value={selectedRecord.syncedAt} />
              </div>
            </section>

            <section>
              <Eyebrow>Tồn theo điểm bán / kho</Eyebrow>
              <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {selectedRecord.inventoryLocations.map((location) => {
                  const warningStyle =
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
                        <Badge
                          label={location.availabilityLabel}
                          color="var(--color-primary)"
                          bg="var(--color-primary-light)"
                        />
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                        <Badge label={location.source} color="#0F766E" bg="#CCFBF1" />
                        <Badge
                          label={location.freshnessLabel}
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
            </section>

            <section>
              <Eyebrow>Hướng xử lý</Eyebrow>
              <Card
                style={{
                  marginTop: "var(--space-3)",
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
              </Card>
            </section>
          </div>
        ) : (
          <div>
            <Eyebrow>Tồn kho</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 sản phẩm để xem tồn theo điểm bán
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một sản phẩm bên trái để xem tình trạng tồn, thời điểm cập nhật và hướng xử lý gợi ý.
            </p>
          </div>
        )}
      </Card>
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
