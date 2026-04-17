import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { DataTable, Avatar, StatusBadge, Input, Card } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { CUSTOMERS } from "@/mocks/crm/customers";
import type { Customer, CustomerStatus } from "@/mocks/crm/customers";

const STATUS_FILTERS: (CustomerStatus | "All")[] = ["All", "Lead", "Qualified", "Customer", "Inactive", "Blocked"];

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Khách hàng",
    render: (c) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Avatar name={c.name} size={32} src={c.avatarUrl} />
        <div>
          <div style={{ fontWeight: 500 }}>{c.name}</div>
          <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
            {c.id}
          </div>
        </div>
      </div>
    ),
    width: "30%",
  },
  { key: "phone", header: "SĐT", render: (c) => c.phone },
  { key: "source", header: "Nguồn", render: (c) => c.source },
  { key: "status", header: "Trạng thái", render: (c) => <StatusBadge status={c.status} /> },
  { key: "lastContact", header: "Liên hệ gần nhất", render: (c) => c.lastContact },
  {
    key: "orders",
    header: "Đơn hàng",
    render: (c) => (
      <span style={{ fontFamily: "var(--font-mono)" }}>{c.orders.length}</span>
    ),
  },
];

export function CustomerListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "All">("All");
  const navigate = useNavigate();

  const filtered = CUSTOMERS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: "var(--space-2)" }}>
        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          CRM Workspace
        </span>
      </div>
      <h1 style={{ marginBottom: "var(--space-6)" }}>Khách hàng</h1>

      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)", alignItems: "center" }}>
        <Input
          icon={<Search size={16} />}
          placeholder="Tìm theo tên, SĐT, mã..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                border: "none",
                borderRadius: "var(--radius-pill)",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "var(--font-primary)",
                cursor: "pointer",
                background: statusFilter === s ? "var(--color-primary)" : "var(--color-bg-card)",
                color: statusFilter === s ? "#fff" : "var(--color-text-secondary)",
                boxShadow: statusFilter === s ? "none" : "var(--shadow-ambient)",
                transition: "all 0.15s",
              }}
            >
              {s === "All" ? "Tất cả" : s}
            </button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate(`/crm/customers/${c.id}`)}
        />
      </Card>
    </div>
  );
}
