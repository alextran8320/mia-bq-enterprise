import { useNavigate } from "react-router-dom";
import { DataTable, Avatar, StatusBadge, Card } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { CUSTOMERS } from "@/mocks/crm/customers";
import type { Customer } from "@/mocks/crm/customers";

const leads = CUSTOMERS.filter(
  (c) => c.status === "Lead" || c.status === "Qualified",
);

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Lead",
    render: (c) => (
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
      >
        <Avatar name={c.name} size={32} src={c.avatarUrl} />
        <div>
          <div style={{ fontWeight: 500 }}>{c.name}</div>
          <div
            style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}
          >
            {c.source}
          </div>
        </div>
      </div>
    ),
  },
  { key: "phone", header: "SĐT", render: (c) => c.phone },
  {
    key: "status",
    header: "Trạng thái",
    render: (c) => <StatusBadge status={c.status} />,
  },
  {
    key: "consent",
    header: "Consent",
    render: (c) => (c.consentGiven ? "OK" : "Chưa"),
  },
  { key: "created", header: "Ngày tạo", render: (c) => c.createdAt },
];

export function LeadListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ marginBottom: "var(--space-2)" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--color-text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          CRM Workspace
        </span>
      </div>
      <h1 style={{ marginBottom: "var(--space-6)" }}>Đầu mối</h1>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={leads}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate(`/crm/customers/${c.id}`)}
        />
      </Card>
    </div>
  );
}
