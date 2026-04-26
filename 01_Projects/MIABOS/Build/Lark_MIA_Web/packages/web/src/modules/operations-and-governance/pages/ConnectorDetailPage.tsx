import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  CircleAlert,
  Clock3,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getConnectorHealthById,
  type ConnectorHealthRecord,
  type OperationsWarningState,
} from "@/mocks/operations/operations";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Ổn định": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Đang cảnh báo": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Gián đoạn cục bộ": { color: "var(--color-error)", bg: "#FFE4E6" },
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
        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>{style.label}</div>
        {text && <div style={{ fontSize: "13px", lineHeight: 1.6 }}>{text}</div>}
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

function ConnectorDetailContent({ record }: { record: ConnectorHealthRecord }) {
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
          onClick={() => navigate("/operations/integration-ops")}
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
          Quay lại danh sách tích hợp
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
            <Eyebrow>Chi tiết kết nối</Eyebrow>
            <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              {record.name}
            </h1>
            <div style={{ color: "var(--color-text-secondary)" }}>
              {record.owner} • {record.lastRun}
            </div>
          </div>
          <Badge label={record.statusLabel} color={statusStyle.color} bg={statusStyle.bg} />
        </div>
      </div>

      <WarningBanner warningState={record.warningState} text={record.nextAction} />

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
          {/* Sức khỏe kết nối */}
          <Card>
            <Eyebrow>Sức khỏe kết nối</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
              <DetailRow icon={<LayoutDashboard size={15} />} label="Trạng thái" value={record.statusLabel} />
              <DetailRow icon={<Sparkles size={15} />} label="Người phụ trách" value={record.owner} />
              <DetailRow icon={<Clock3 size={15} />} label="Lần chạy gần nhất" value={record.lastRun} />
              <DetailRow icon={<ArrowRightLeft size={15} />} label="Tỷ lệ thành công" value={record.successRate} />
            </div>
          </Card>

          {/* Queue & backlog */}
          <Card>
            <Eyebrow>Hàng đợi & tồn đọng</Eyebrow>
            <div
              style={{
                marginTop: "var(--space-4)",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Thử lại</div>
                <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>{record.retryQueue}</div>
              </div>
              <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Thư chết</div>
                <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>{record.deadLetter}</div>
              </div>
              <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--color-bg-surface)" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tồn đọng Webhook</div>
                <div style={{ marginTop: "var(--space-1)", fontWeight: 500 }}>{record.webhookBacklog}</div>
              </div>
            </div>
          </Card>

          {/* Lịch sử chạy gần đây */}
          <Card>
            <Eyebrow>Lịch sử chạy gần đây</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {record.recentRuns.map((run) => (
                <div
                  key={run.id}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-bg-surface)",
                  }}
                >
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
          {/* Hệ thống nguồn */}
          <Card>
            <Eyebrow>Hệ thống nguồn</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {record.sourceSystems.map((item) => (
                <Badge key={item} label={item} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
              ))}
            </div>
          </Card>

          {/* Thao tác */}
          <Card>
            <Eyebrow>Thao tác</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {record.nextAction}
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <Button variant="secondary">Thử lại hàng đợi</Button>
                <Button variant="secondary">Mở thư chết</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ConnectorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getConnectorHealthById(id) : null;

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
        <h2>Không tìm thấy kết nối</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Kết nối với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/operations/integration-ops")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return <ConnectorDetailContent record={record} />;
}
