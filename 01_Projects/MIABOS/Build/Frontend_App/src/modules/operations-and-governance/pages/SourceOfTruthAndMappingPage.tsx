import { useEffect, useState } from "react";
import { ArrowRightLeft, ShieldAlert, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getMappingConflictById,
  searchMappingConflicts,
  type MappingConflictRecord,
} from "@/mocks/operations/operations";
import {
  DetailRow,
  EmptyResultCard,
  Eyebrow,
  WARNING_STYLES,
  WarningBanner,
  useOperationsContext,
} from "@/modules/operations-and-governance/components/OperationsModuleLayout";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Chờ review": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đang áp dụng rule tạm": { color: "#7C3AED", bg: "#F3E8FF" },
  "Đã chốt": { color: "var(--color-success)", bg: "#DCFCE7" },
};

function StatusChip({ label }: { label: string }) {
  const style = STATUS_STYLES[label] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };

  return <Badge label={label} color={style.color} bg={style.bg} />;
}

export function SourceOfTruthAndMappingPage() {
  const { filters } = useOperationsContext();
  const records = searchMappingConflicts(filters);
  const [selectedId, setSelectedId] = useState<string | null>(records[0]?.id ?? null);

  useEffect(() => {
    if (!records.some((item) => item.id === selectedId)) {
      setSelectedId(records[0]?.id ?? null);
    }
  }, [records, selectedId]);

  if (records.length === 0) {
    return (
      <EmptyResultCard
        title="Không có conflict hoặc mapping rule phù hợp"
        description="Thử tìm theo canonical key, mã đơn, SKU hoặc chuyển bộ lọc trạng thái để xem các conflict đang mở và các rule tạm đang được áp dụng."
      />
    );
  }

  const selectedRecord = getMappingConflictById(selectedId ?? records[0]?.id ?? null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.06fr) minmax(340px, 0.94fr)",
        gap: "var(--space-6)",
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {records.map((record) => {
          const warningStyle =
            record.warningState === "none" ? null : WARNING_STYLES[record.warningState];

          return (
            <Card
              key={record.id}
              style={{
                cursor: "pointer",
                background:
                  record.id === selectedRecord?.id
                    ? "#F8FAFC"
                    : "var(--color-bg-card)",
                boxShadow:
                  record.id === selectedRecord?.id
                    ? "0 18px 30px rgba(124, 58, 237, 0.12)"
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
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", marginBottom: "var(--space-1)" }}>
                      {record.id}
                    </div>
                    <h3 style={{ marginBottom: "var(--space-1)" }}>{record.canonicalKey}</h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {record.entityType} • {record.owner}
                    </div>
                  </div>
                  <StatusChip label={record.statusLabel} />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  <Badge label={record.entityType} color="#7C3AED" bg="#F3E8FF" />
                  <Badge label={record.domain} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
                  <Badge label={record.updatedAt} color="#0F766E" bg="#CCFBF1" />
                  {warningStyle ? (
                    <Badge label={warningStyle.label} color={warningStyle.color} bg={warningStyle.bg} />
                  ) : null}
                </div>

                <div style={{ color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
                  {record.conflictReason}
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      <Card style={{ position: "sticky", top: 0 }}>
        {selectedRecord ? (
          <MappingDetail record={selectedRecord} />
        ) : (
          <div>
            <Eyebrow>Source Mapping</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 conflict để xem chi tiết
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một conflict bên trái để xem giá trị từ từng nguồn, rule ưu tiên hiện tại và bước xử lý đề xuất.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function MappingDetail({ record }: { record: MappingConflictRecord }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <Eyebrow>Source Of Truth And Mapping</Eyebrow>
        <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
          {record.canonicalKey}
        </h2>
        <div style={{ color: "var(--color-text-secondary)" }}>
          {record.entityType} • {record.owner}
        </div>
      </div>

      <WarningBanner warningState={record.warningState} customText={record.conflictReason} />

      <section>
        <Eyebrow>Thông tin conflict</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
          <DetailRow icon={<ArrowRightLeft size={15} />} label="Loại entity" value={record.entityType} />
          <DetailRow icon={<Sparkles size={15} />} label="Owner" value={record.owner} />
          <DetailRow icon={<ShieldAlert size={15} />} label="Trạng thái" value={record.statusLabel} />
          <DetailRow icon={<ArrowRightLeft size={15} />} label="Rule hiện tại" value={record.activeRule} />
        </div>
      </section>

      <section>
        <Eyebrow>Giá trị theo từng nguồn</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {record.sourceValues.map((item) => (
            <div key={item.id} style={{ padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.system}</div>
                  <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                    {item.label}
                  </div>
                </div>
                <Badge label={item.syncedAt} color="var(--color-text-secondary)" bg="var(--color-bg-card)" />
              </div>
              <div style={{ marginTop: "var(--space-2)", lineHeight: 1.6 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Review note</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}>
            {record.reviewNote}
          </div>
          <div style={{ fontWeight: 600 }}>{record.nextAction}</div>
        </Card>
      </section>

      <section>
        <Eyebrow>Thao tác</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Button variant="secondary">Resolve thủ công</Button>
            <Button variant="secondary">Xem priority rules</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
