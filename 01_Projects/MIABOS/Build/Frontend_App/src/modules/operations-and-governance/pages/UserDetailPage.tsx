import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CircleAlert,
  ShieldAlert,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getUserScopeProfileById,
  type UserScopeProfile,
  type OperationsWarningState,
} from "@/mocks/operations/operations";

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Đang áp dụng": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần rà soát": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Giới hạn quyền": { color: "#7C3AED", bg: "#F3E8FF" },
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

function UserDetailContent({ record }: { record: UserScopeProfile }) {
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
          onClick={() => navigate("/operations/users-roles")}
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
          Quay lại danh sách người dùng
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
            <Eyebrow>Chi tiết người dùng</Eyebrow>
            <h1 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              {record.name}
            </h1>
            <div style={{ color: "var(--color-text-secondary)" }}>
              {record.role} • {record.ownerTeam}
            </div>
          </div>
          <Badge label={record.statusLabel} color={statusStyle.color} bg={statusStyle.bg} />
        </div>
      </div>

      <WarningBanner warningState={record.warningState} text={record.reviewNote} />

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
          {/* Thông tin hồ sơ */}
          <Card>
            <Eyebrow>Thông tin hồ sơ</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
              <DetailRow icon={<UserRound size={15} />} label="Vai trò" value={record.role} />
              <DetailRow icon={<Users size={15} />} label="Đội phụ trách" value={record.ownerTeam} />
              <DetailRow icon={<Store size={15} />} label="Tóm tắt phạm vi" value={record.branchSummary} />
              <DetailRow icon={<ShieldAlert size={15} />} label="Trạng thái" value={record.statusLabel} />
            </div>
          </Card>

          {/* Phạm vi áp dụng */}
          <Card>
            <Eyebrow>Phạm vi áp dụng</Eyebrow>
            <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {record.scopeAssignments.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-bg-surface)",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>
                    {item.label}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {item.values.map((value) => (
                      <Badge key={value} label={value} color="var(--color-text-secondary)" bg="var(--color-bg-card)" />
                    ))}
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
          {/* Chế độ vận hành */}
          <Card>
            <Eyebrow>Chế độ vận hành</Eyebrow>
            <div style={{ marginTop: "var(--space-4)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                {record.modes.map((mode) => (
                  <Badge key={mode} label={mode} color="#0F4C81" bg="rgba(47, 100, 246, 0.1)" />
                ))}
              </div>
              <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{record.note}</div>
            </div>
          </Card>

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
                <div style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>{record.reviewNote}</div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <Button variant="secondary">Mở ma trận vai trò</Button>
                <Button variant="secondary">Xem trước câu trả lời</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = id ? getUserScopeProfileById(id) : null;

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
        <h2>Không tìm thấy người dùng</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Người dùng với mã "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/operations/users-roles")}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return <UserDetailContent record={record} />;
}
