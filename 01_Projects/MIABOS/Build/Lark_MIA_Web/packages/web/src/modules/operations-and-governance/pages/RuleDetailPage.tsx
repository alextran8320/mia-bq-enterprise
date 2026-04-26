import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  CircleAlert,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getGovernanceRuleById,
  type GovernanceRuleRecord,
  type OperationsWarningState,
} from "@/mocks/operations/operations";

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  "Phạm vi": { color: "#0F766E", bg: "#CCFBF1" },
  "Nhạy cảm": { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  "Công khai an toàn": { color: "#C2410C", bg: "#FFEDD5" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang áp dụng": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần tinh chỉnh": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Đang chặn": { color: "var(--color-error)", bg: "#FFE4E6" },
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

function RuleDetailContent({ record }: { record: GovernanceRuleRecord }) {
  const navigate = useNavigate();
  const statusStyle = STATUS_STYLES[record.statusLabel] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };
  const categoryStyle = CATEGORY_STYLES[record.categoryLabel] ?? {
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
          onClick={() => navigate("/operations/scope-rules")}
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
          Quay lại danh sách quy tắc
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
            <Eyebrow>Chi tiết quy tắc</Eyebrow>
            <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              {record.title}
            </h1>
            <div style={{ color: "var(--color-text-secondary)" }}>
              {record.roleLabel} • {record.modeLabel}
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Badge label={record.categoryLabel} color={categoryStyle.color} bg={categoryStyle.bg} />
            <Badge label={record.statusLabel} color={statusStyle.color} bg={statusStyle.bg} />
          </div>
        </div>
      </div>

      <WarningBanner warningState={record.warningState} text={record.note} />

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
          {/* Thông tin quy tắc */}
          <Card>
            <Eyebrow>Thông tin quy tắc</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
              <DetailRow icon={<ShieldAlert size={15} />} label="Loại quy tắc" value={record.categoryLabel} />
              <DetailRow icon={<Users size={15} />} label="Vai trò" value={record.roleLabel} />
              <DetailRow icon={<Sparkles size={15} />} label="Người phụ trách" value={record.owner} />
              <DetailRow icon={<ArrowRightLeft size={15} />} label="Lĩnh vực ảnh hưởng" value={record.affectedAreas.join(", ")} />
            </div>
          </Card>

          {/* Xem trước câu trả lời */}
          <Card>
            <Eyebrow>Xem trước câu trả lời</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
              <div
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-surface)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Trước khi áp quy tắc
                </div>
                <div style={{ marginTop: "var(--space-1)", lineHeight: 1.6 }}>{record.previewBefore}</div>
              </div>
              <div
                style={{
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: categoryStyle.bg,
                }}
              >
                <div style={{ fontSize: "11px", color: categoryStyle.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Sau khi áp quy tắc
                </div>
                <div style={{ marginTop: "var(--space-1)", lineHeight: 1.6, color: categoryStyle.color }}>
                  {record.previewAfter}
                </div>
              </div>
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
          {/* Trường bị ẩn */}
          <Card>
            <Eyebrow>Trường bị ẩn</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {record.hiddenFields.map((item) => (
                <Badge key={item} label={item} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
              ))}
            </div>
          </Card>

          {/* Thao tác */}
          <Card>
            <Eyebrow>Thao tác</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ fontWeight: 600 }}>
                Cập nhật gần nhất: {record.updatedAt}
              </div>
              <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {record.note}
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <Button variant="secondary">Xem trước vai trò</Button>
                <Button variant="secondary">Kiểm tra quy tắc</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function RuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getGovernanceRuleById(id) : null;

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
        <h2>Không tìm thấy quy tắc</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Quy tắc với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/operations/scope-rules")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return <RuleDetailContent record={record} />;
}
