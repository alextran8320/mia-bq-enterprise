import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CircleAlert,
  Clock3,
  MessageSquareText,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getEscalationById,
  searchEscalations,
  type EscalationRecord,
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
  "Đang xử lý": { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  "Chờ phân công": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đã giải quyết": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần đối soát": { color: "var(--color-error)", bg: "#FFE4E6" },
};

function StatusChip({ label }: { label: string }) {
  const style = STATUS_STYLES[label] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };

  return <Badge label={label} color={style.color} bg={style.bg} />;
}

export function EscalationQueuePage() {
  const { filters } = useOperationsContext();
  const records = searchEscalations(filters);
  const [selectedId, setSelectedId] = useState<string | null>(records[0]?.id ?? null);

  useEffect(() => {
    if (!records.some((item) => item.id === selectedId)) {
      setSelectedId(records[0]?.id ?? null);
    }
  }, [records, selectedId]);

  if (records.length === 0) {
    return (
      <EmptyResultCard
        title="Không có escalation phù hợp với bộ lọc hiện tại"
        description="Thử đổi domain hoặc trạng thái để xem các ticket đang mở, các case đã giải quyết hoặc các escalation đang được fallback sang queue nội bộ."
      />
    );
  }

  const selectedRecord = getEscalationById(selectedId ?? records[0]?.id ?? null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.08fr) minmax(340px, 0.92fr)",
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
                    ? "#FFF7ED"
                    : "var(--color-bg-card)",
                boxShadow:
                  record.id === selectedRecord?.id
                    ? "0 18px 32px rgba(194, 65, 12, 0.14)"
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
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      {record.id}
                    </div>
                    <h3 style={{ marginBottom: "var(--space-1)" }}>{record.subject}</h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {record.sourceModule} • {record.createdAt}
                    </div>
                  </div>
                  <StatusChip label={record.statusLabel} />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  <Badge label={record.domain} color="#9A3412" bg="#FFEDD5" />
                  <Badge label={record.assignee} color="#0F766E" bg="#CCFBF1" />
                  <Badge
                    label={record.destinationLabel}
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
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "var(--space-3)",
                  }}
                >
                  <InfoCell label="Người tạo" value={record.actor} />
                  <InfoCell label="Tuổi ticket" value={record.ageLabel} />
                  <InfoCell label="Điểm đến" value={record.destinationRef} />
                </div>

                <div style={{ color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
                  {record.summary}
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      <Card style={{ position: "sticky", top: 0 }}>
        {selectedRecord ? (
          <EscalationDetail record={selectedRecord} />
        ) : (
          <div>
            <Eyebrow>Escalation Queue</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 escalation để xem chi tiết
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một ticket bên trái để xem context đóng gói, assignee, timeline và bước xử lý tiếp theo.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function EscalationDetail({ record }: { record: EscalationRecord }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <Eyebrow>Escalation</Eyebrow>
        <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
          {record.subject}
        </h2>
        <div style={{ color: "var(--color-text-secondary)" }}>
          {record.id} • {record.destinationRef}
        </div>
      </div>

      <WarningBanner warningState={record.warningState} customText={record.blockedReason} />

      <section>
        <Eyebrow>Tóm tắt điều phối</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
          <DetailRow icon={<CircleAlert size={15} />} label="Trạng thái" value={record.statusLabel} />
          <DetailRow icon={<UserRound size={15} />} label="Người tạo" value={`${record.actor} • ${record.actorRole}`} />
          <DetailRow icon={<ShieldAlert size={15} />} label="Người xử lý" value={record.assignee} />
          <DetailRow icon={<ArrowUpRight size={15} />} label="Điểm đến" value={`${record.destinationLabel} • ${record.destinationRef}`} />
          <DetailRow icon={<Clock3 size={15} />} label="Tuổi ticket" value={record.ageLabel} />
        </div>
      </section>

      <section>
        <Eyebrow>Context đóng gói</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Card style={{ background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Câu hỏi gốc
            </div>
            <div style={{ marginTop: "var(--space-1)", lineHeight: 1.6 }}>{record.question}</div>
          </Card>
          <Card style={{ background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Answer snapshot
            </div>
            <div style={{ marginTop: "var(--space-1)", lineHeight: 1.6 }}>{record.answerSnapshot}</div>
          </Card>
        </div>
      </section>

      <section>
        <Eyebrow>Dòng thời gian xử lý</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {record.timeline.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-surface)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                    {item.owner}
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{item.time}</div>
              </div>
              <div style={{ marginTop: "var(--space-2)", color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Hướng xử lý tiếp theo</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>{record.nextAction}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            {record.tags.map((tag) => (
              <Badge key={tag} label={tag} color="var(--color-text-secondary)" bg="var(--color-bg-card)" />
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Button variant="secondary">
              <ArrowUpRight size={16} /> Mở điểm đến
            </Button>
            <Button variant="secondary">
              <MessageSquareText size={16} /> Chuyển người xử lý
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "var(--space-3)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
      }}
    >
      <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>{value}</div>
    </div>
  );
}
