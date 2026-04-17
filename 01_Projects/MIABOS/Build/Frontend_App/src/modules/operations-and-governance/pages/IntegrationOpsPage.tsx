import { useEffect, useState } from "react";
import { ArrowRightLeft, Clock3, LayoutDashboard, ShieldAlert, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getConnectorHealthById,
  searchConnectorHealth,
  type ConnectorHealthRecord,
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
  "Ổn định": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Đang cảnh báo": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Gián đoạn cục bộ": { color: "var(--color-error)", bg: "#FFE4E6" },
};

function StatusChip({ label }: { label: string }) {
  const style = STATUS_STYLES[label] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };

  return <Badge label={label} color={style.color} bg={style.bg} />;
}

export function IntegrationOpsPage() {
  const { filters } = useOperationsContext();
  const records = searchConnectorHealth(filters);
  const [selectedId, setSelectedId] = useState<string | null>(records[0]?.id ?? null);

  useEffect(() => {
    if (!records.some((item) => item.id === selectedId)) {
      setSelectedId(records[0]?.id ?? null);
    }
  }, [records, selectedId]);

  if (records.length === 0) {
    return (
      <EmptyResultCard
        title="Không có connector nào phù hợp với bộ lọc hiện tại"
        description="Thử tìm theo tên connector hoặc bỏ lọc domain để xem health của SAP B1, KiotViet, Haravan và Lark Workflow."
      />
    );
  }

  const selectedRecord = getConnectorHealthById(selectedId ?? records[0]?.id ?? null);

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
                    ? "0 18px 30px rgba(15, 118, 110, 0.12)"
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
                    <h3 style={{ marginBottom: "var(--space-1)" }}>{record.name}</h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {record.owner} • Last run {record.lastRun}
                    </div>
                  </div>
                  <StatusChip label={record.statusLabel} />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  <Badge label={record.successRate} color="#0F766E" bg="#CCFBF1" />
                  <Badge label={`Retry ${record.retryQueue}`} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
                  <Badge label={`Dead-letter ${record.deadLetter}`} color="#9A3412" bg="#FFEDD5" />
                  {warningStyle ? (
                    <Badge label={warningStyle.label} color={warningStyle.color} bg={warningStyle.bg} />
                  ) : null}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--space-3)" }}>
                  <InfoCell label="Webhook" value={record.webhookBacklog} />
                  <InfoCell label="Retry queue" value={record.retryQueue} />
                  <InfoCell label="Dead-letter" value={record.deadLetter} />
                </div>

                <div style={{ color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
                  {record.note}
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      <Card style={{ position: "sticky", top: 0 }}>
        {selectedRecord ? (
          <ConnectorDetail record={selectedRecord} />
        ) : (
          <div>
            <Eyebrow>Integration Ops</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 connector để xem chi tiết
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một connector bên trái để xem health, backlog, recent runs và bước xử lý tiếp theo.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function ConnectorDetail({ record }: { record: ConnectorHealthRecord }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <Eyebrow>Integration Ops</Eyebrow>
        <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
          {record.name}
        </h2>
        <div style={{ color: "var(--color-text-secondary)" }}>
          {record.owner} • {record.lastRun}
        </div>
      </div>

      <WarningBanner warningState={record.warningState} customText={record.nextAction} />

      <section>
        <Eyebrow>Sức khỏe kết nối</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
          <DetailRow icon={<LayoutDashboard size={15} />} label="Trạng thái" value={record.statusLabel} />
          <DetailRow icon={<Sparkles size={15} />} label="Owner" value={record.owner} />
          <DetailRow icon={<Clock3 size={15} />} label="Lần chạy gần nhất" value={record.lastRun} />
          <DetailRow icon={<ArrowRightLeft size={15} />} label="Success rate" value={record.successRate} />
        </div>
      </section>

      <section>
        <Eyebrow>Queue và backlog</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--space-3)" }}>
          <InfoCell label="Retry" value={record.retryQueue} />
          <InfoCell label="Dead-letter" value={record.deadLetter} />
          <InfoCell label="Webhook" value={record.webhookBacklog} />
        </div>
      </section>

      <section>
        <Eyebrow>Domain phụ trách</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {record.sourceSystems.map((item) => (
              <Badge key={item} label={item} color="var(--color-text-secondary)" bg="var(--color-bg-card)" />
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Eyebrow>Recent runs</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {record.recentRuns.map((run) => (
            <div key={run.id} style={{ padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{run.label}</div>
                  <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                    {run.statusLabel} • {run.startedAt}
                  </div>
                </div>
                <Badge label={run.duration} color="var(--color-text-secondary)" bg="var(--color-bg-card)" />
              </div>
              <div style={{ marginTop: "var(--space-2)", color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
                {run.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Thao tác</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}>
            {record.nextAction}
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Button variant="secondary">Retry queue</Button>
            <Button variant="secondary">Mở dead-letter</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
      <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>{value}</div>
    </div>
  );
}
