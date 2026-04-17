import { useEffect, useState } from "react";
import { ShieldAlert, Store, UserRound, Users } from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import {
  getUserScopeProfileById,
  searchUserScopeProfiles,
  type UserScopeProfile,
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
  "Đang áp dụng": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Cần rà soát": { color: "var(--color-warning)", bg: "#FEF3C7" },
  "Giới hạn quyền": { color: "#7C3AED", bg: "#F3E8FF" },
};

function StatusChip({ label }: { label: string }) {
  const style = STATUS_STYLES[label] ?? {
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-surface)",
  };

  return <Badge label={label} color={style.color} bg={style.bg} />;
}

export function UsersAndRolesPage() {
  const { filters } = useOperationsContext();
  const records = searchUserScopeProfiles(filters);
  const [selectedId, setSelectedId] = useState<string | null>(records[0]?.id ?? null);

  useEffect(() => {
    if (!records.some((item) => item.id === selectedId)) {
      setSelectedId(records[0]?.id ?? null);
    }
  }, [records, selectedId]);

  if (records.length === 0) {
    return (
      <EmptyResultCard
        title="Không có hồ sơ quyền nào khớp với bộ lọc"
        description="Thử tìm theo tên người dùng, vai trò hoặc chuyển domain về `Quyền truy cập` để xem các profile đang hoạt động và các profile cần rà soát thêm."
      />
    );
  }

  const selectedRecord = getUserScopeProfileById(selectedId ?? records[0]?.id ?? null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.04fr) minmax(340px, 0.96fr)",
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
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", marginBottom: "var(--space-1)" }}>
                      {record.id}
                    </div>
                    <h3 style={{ marginBottom: "var(--space-1)" }}>{record.name}</h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {record.role} • {record.ownerTeam}
                    </div>
                  </div>
                  <StatusChip label={record.statusLabel} />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  <Badge label={record.branchSummary} color="#0F766E" bg="#CCFBF1" />
                  {record.modes.map((mode) => (
                    <Badge
                      key={mode}
                      label={mode}
                      color="var(--color-text-secondary)"
                      bg="var(--color-bg-surface)"
                    />
                  ))}
                  {warningStyle ? (
                    <Badge
                      label={warningStyle.label}
                      color={warningStyle.color}
                      bg={warningStyle.bg}
                    />
                  ) : null}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--space-3)" }}>
                  <InfoCell label="Chi nhánh" value={`${record.scopeAssignments[0]?.values.length ?? 0} scope`} />
                  <InfoCell label="Kênh" value={`${record.scopeAssignments[1]?.values.length ?? 0} scope`} />
                  <InfoCell label="Cập nhật" value={record.updatedAt} />
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
          <UserScopeDetail record={selectedRecord} />
        ) : (
          <div>
            <Eyebrow>Users And Roles</Eyebrow>
            <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              Chọn 1 hồ sơ quyền để xem chi tiết
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chọn một profile bên trái để xem role, mode áp dụng và các phạm vi theo chi nhánh, kênh, loại cửa hàng.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function UserScopeDetail({ record }: { record: UserScopeProfile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <Eyebrow>Users And Roles</Eyebrow>
        <h2 style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-1)" }}>
          {record.name}
        </h2>
        <div style={{ color: "var(--color-text-secondary)" }}>
          {record.role} • {record.ownerTeam}
        </div>
      </div>

      <WarningBanner warningState={record.warningState} customText={record.reviewNote} />

      <section>
        <Eyebrow>Thông tin hồ sơ</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "grid", gap: "var(--space-3)" }}>
          <DetailRow icon={<UserRound size={15} />} label="Vai trò" value={record.role} />
          <DetailRow icon={<Users size={15} />} label="Đội phụ trách" value={record.ownerTeam} />
          <DetailRow icon={<Store size={15} />} label="Tóm tắt phạm vi" value={record.branchSummary} />
          <DetailRow icon={<ShieldAlert size={15} />} label="Trạng thái" value={record.statusLabel} />
        </div>
      </section>

      <section>
        <Eyebrow>Phạm vi áp dụng</Eyebrow>
        <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {record.scopeAssignments.map((item) => (
            <Card key={item.label} style={{ background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
              <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>
                {item.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {item.values.map((value) => (
                  <Badge key={value} label={value} color="var(--color-text-secondary)" bg="var(--color-bg-card)" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Mode vận hành</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            {record.modes.map((mode) => (
              <Badge key={mode} label={mode} color="#0F4C81" bg="rgba(47, 100, 246, 0.1)" />
            ))}
          </div>
          <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{record.note}</div>
        </Card>
      </section>

      <section>
        <Eyebrow>Hướng xử lý</Eyebrow>
        <Card style={{ marginTop: "var(--space-3)", background: "var(--color-bg-surface)", padding: "var(--space-4)" }}>
          <div style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>{record.reviewNote}</div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Button variant="secondary">Mở role matrix</Button>
            <Button variant="secondary">Xem preview answer</Button>
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
