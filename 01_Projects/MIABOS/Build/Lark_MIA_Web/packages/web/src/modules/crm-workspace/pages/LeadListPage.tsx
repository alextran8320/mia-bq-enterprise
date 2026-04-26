import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, DataTable, StatusBadge } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { leadApi, type LeadEntry } from "@/shared/api/leadApi";
import { getApiErrorMessage } from "@/shared/auth/apiClient";

const columns: Column<LeadEntry>[] = [
  {
    key: "name",
    header: "Lead",
    render: (c) => (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Avatar name={c.name} size={32} />
        <div>
          <div style={{ fontWeight: 500 }}>{c.name}</div>
          <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
            {c.source ?? "—"}
          </div>
        </div>
      </div>
    ),
  },
  { key: "phone", header: "SĐT", render: (c) => c.phone ?? "—" },
  { key: "email", header: "Email", render: (c) => c.email ?? "—" },
  {
    key: "status",
    header: "Trạng thái",
    render: (c) => <StatusBadge status={c.status} />,
  },
  {
    key: "score",
    header: "Score",
    render: (c) => (
      <span style={{ fontFamily: "var(--font-mono, monospace)" }}>{c.score}</span>
    ),
  },
  {
    key: "createdAt",
    header: "Ngày tạo",
    render: (c) => new Date(c.createdAt).toLocaleDateString("vi-VN"),
  },
];

export function LeadListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<LeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    leadApi
      .list()
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch((err) => {
        if (!cancelled)
          setError(getApiErrorMessage(err, "Không tải được danh sách lead"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

      {error && (
        <div
          role="alert"
          style={{
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div
            style={{ padding: 40, textAlign: "center", color: "var(--color-text-secondary)" }}
          >
            Đang tải…
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            rowKey={(c) => c.id}
            onRowClick={(c) => {
              if (c.convertedCustomerId) {
                navigate(`/crm/customers/${c.convertedCustomerId}`);
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
