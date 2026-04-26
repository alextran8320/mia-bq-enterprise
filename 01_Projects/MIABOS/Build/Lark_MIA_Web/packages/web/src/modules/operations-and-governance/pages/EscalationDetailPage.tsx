import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
  type EscalationRecord,
  type OperationsWarningState,
} from "@/mocks/operations/operations";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang xử lý": { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  "Chờ phân công": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đã giải quyết": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần đối soát": { color: "var(--color-error)", bg: "#FFE4E6" },
};

const WARNING_STYLES: Record<
  Exclude<OperationsWarningState, "none">,
  { label: string; color: string; bg: string }
> = {
  attention: { label: "Cần chú ý", color: "var(--color-warning)", bg: "#FFF7ED" },
  blocked: { label: "Đang chặn", color: "var(--color-error)", bg: "#FFE4E6" },
  restricted: { label: "Giới hạn quyền", color: "#7C3AED", bg: "#F3E8FF" },
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

function WarningBanner({ warningState, text }: { warningState: OperationsWarningState; text?: string }) {
  if (warningState === "none") return null;
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
      <div style={{ display: "flex", marginTop: 2 }}>
        <CircleAlert size={16} />
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>
          {style.label}
        </div>
        {text && (
          <div style={{ fontSize: "13px", lineHeight: 1.6 }}>{text}</div>
        )}
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
        gridTemplateColumns: "150px 1fr",
        gap: "var(--space-3)",
        alignItems: "start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "13px",
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

function EscalationDetailContent({ record }: { record: EscalationRecord }) {
  const navigate = useNavigate();
  const statusStyle = STATUS_STYLES[record.statusLabel] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/operations/escalations")}
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
            marginBottom: "var(--space-4)",
          }}
        >
          <ArrowLeft size={16} />
          Quay lại hàng đợi xử lý
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <Eyebrow>Chi tiết yêu cầu xử lý</Eyebrow>
            <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              {record.subject}
            </h1>
            <div style={{ color: "var(--color-text-secondary)" }}>
              {record.id} • {record.destinationRef}
            </div>
          </div>
          <Badge label={record.statusLabel} color={statusStyle.color} bg={statusStyle.bg} />
        </div>
      </div>

      <WarningBanner warningState={record.warningState} text={record.blockedReason} />

      {/* Main content: 2-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "var(--space-6)",
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {/* Tóm tắt điều phối */}
          <Card>
            <Eyebrow>Tóm tắt điều phối</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
              <DetailRow icon={<CircleAlert size={15} />} label="Trạng thái" value={record.statusLabel} />
              <DetailRow icon={<UserRound size={15} />} label="Người tạo" value={`${record.actor} • ${record.actorRole}`} />
              <DetailRow icon={<ShieldAlert size={15} />} label="Người xử lý" value={record.assignee} />
              <DetailRow icon={<ArrowUpRight size={15} />} label="Điểm đến" value={`${record.destinationLabel} • ${record.destinationRef}`} />
              <DetailRow icon={<Clock3 size={15} />} label="Tuổi ticket" value={record.ageLabel} />
            </div>
          </Card>

          {/* Câu hỏi gốc + Bản trả lời */}
          <Card>
            <Eyebrow>Câu hỏi gốc và bản trả lời</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-surface)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Câu hỏi gốc
                </div>
                <div style={{ marginTop: "var(--space-1)", lineHeight: 1.6 }}>{record.question}</div>
              </div>
              <div
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-surface)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Bản trả lời
                </div>
                <div style={{ marginTop: "var(--space-1)", lineHeight: 1.6 }}>{record.answerSnapshot}</div>
              </div>
            </div>
          </Card>

          {/* Diễn tiến xử lý (timeline) */}
          <Card>
            <Eyebrow>Diễn tiến xử lý</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
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
          {/* Hướng xử lý */}
          <Card>
            <Eyebrow>Hướng xử lý</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div
                style={{
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-surface)",
                  padding: "var(--space-4)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Hành động tiếp theo
                </div>
                <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>
                  {record.nextAction}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function EscalationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getEscalationById(id) : null;

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
        <CircleAlert size={42} style={{ color: "var(--color-text-tertiary)" }} />
        <h2>Không tìm thấy yêu cầu xử lý</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Yêu cầu xử lý với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/operations/escalations")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return <EscalationDetailContent record={record} />;
}
