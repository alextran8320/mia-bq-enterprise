import { useState } from "react";
import { Columns3, Filter, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

interface Role {
  id: string;
  name: string;
  description: string;
  status: "Hoạt động" | "Không hoạt động";
  parent: string;
}

const INIT_ROLES: Role[] = [
  { id: "r1", name: "Company Owner", description: "Company Owner", status: "Hoạt động", parent: "—" },
  { id: "r2", name: "Quản trị viên", description: "Toàn quyền quản trị hệ thống", status: "Hoạt động", parent: "Company Owner" },
  { id: "r3", name: "Nhân viên bán hàng", description: "Xem và xử lý đơn hàng, khách hàng", status: "Hoạt động", parent: "Quản trị viên" },
  { id: "r4", name: "Chăm sóc khách hàng", description: "Hỗ trợ khách hàng, xem lịch sử", status: "Hoạt động", parent: "Quản trị viên" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "Hoạt động": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Không hoạt động": { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" },
};

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(INIT_ROLES);
  const [search, setSearch] = useState("");

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }

  const columns: Column<Role>[] = [
    {
      key: "name",
      header: "Tên",
      render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      render: (r) => <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{r.description}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => <Badge label={r.status} color={STATUS_STYLE[r.status]?.color ?? "#637381"} bg={STATUS_STYLE[r.status]?.bg ?? "#F4F6F8"} />,
    },
    {
      key: "parent",
      header: "Cấp trên",
      render: (r) => <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{r.parent}</span>,
    },
    {
      key: "actions",
      header: "Hành động",
      align: "right",
      render: (r) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-primary)", padding: 4, borderRadius: 6, display: "flex" }}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-error)", padding: 4, borderRadius: 6, display: "flex" }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quản lý vai trò</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid var(--color-border)", borderRadius: 8, background: "var(--color-bg-card)", cursor: "pointer", color: "var(--color-text-secondary)" }}>
            <Filter size={16} />
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid var(--color-border)", borderRadius: 8, background: "var(--color-bg-card)", cursor: "pointer", color: "var(--color-text-secondary)" }}>
            <Columns3 size={16} />
          </button>
          <Button variant="secondary" style={{ gap: 6 }}>
            <Upload size={14} /> Nhập từ mẫu
          </Button>
          <Button variant="primary" style={{ gap: 6 }}>
            <Plus size={14} /> Tạo mới
          </Button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 280 }}>
        <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Vui lòng nhập từ khóa"
          style={{ width: "100%", paddingLeft: 34, paddingRight: 12, height: 38, border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", color: "var(--color-text-primary)", background: "var(--color-bg-card)", outline: "none" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(r) => r.id}
          pageSize={5}
        />
      </div>
    </div>
  );
}
