import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  CircleAlert,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getMappingConflictById,
  type MappingConflictRecord,
  type OperationsWarningState,
} from "@/mocks/operations/operations";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Chờ đánh giá": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đang áp dụng quy tắc tạm": { color: "#7C3AED", bg: "#F3E8FF" },
  "Đã chốt": { color: "var(--color-success)", bg: "#DCFCE7" },
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

function MappingDetailContent({ record }: { record: MappingConflictRecord }) {
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
          onClick={() => navigate("/operations/source-mapping")}
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
          Quay lại danh sách ánh xạ dữ liệu
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
            <Eyebrow>Chi tiết xung đột</Eyebrow>
            <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              {record.canonicalKey}
            </h1>
            <div style={{ color: "var(--color-text-secondary)" }}>
              {record.entityType} • {record.owner}
            </div>
          </div>
          <Badge label={record.statusLabel} color={statusStyle.color} bg={statusStyle.bg} />
        </div>
      </div>

      <WarningBanner warningState={record.warningState} text={record.conflictReason} />

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
          {/* Thông tin xung đột */}
          <Card>
            <Eyebrow>Thông tin xung đột</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
              <DetailRow icon={<ArrowRightLeft size={15} />} label="Loại thực thể" value={record.entityType} />
              <DetailRow icon={<Sparkles size={15} />} label="Người phụ trách" value={record.owner} />
              <DetailRow icon={<ShieldAlert size={15} />} label="Trạng thái" value={record.statusLabel} />
              <DetailRow icon={<ArrowRightLeft size={15} />} label="Quy tắc hiện tại" value={record.activeRule} />
            </div>
          </Card>

          {/* Giá trị theo nguồn */}
          <Card>
            <Eyebrow>Giá trị theo nguồn</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {record.sourceValues.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-bg-surface)",
                  }}
                >
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
          {/* Ghi chú đánh giá */}
          <Card>
            <Eyebrow>Ghi chú đánh giá</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {record.reviewNote}
              </div>
              <div style={{ fontWeight: 600 }}>{record.nextAction}</div>
            </div>
          </Card>

          {/* Thao tác */}
          <Card>
            <Eyebrow>Thao tác</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <Button variant="secondary">Giải quyết thủ công</Button>
              <Button variant="secondary">Xem quy tắc ưu tiên</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function MappingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getMappingConflictById(id) : null;

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
        <h2>Không tìm thấy xung đột ánh xạ dữ liệu</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Xung đột với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/operations/source-mapping")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return <MappingDetailContent record={record} />;
}
