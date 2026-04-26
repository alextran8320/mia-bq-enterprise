import { useState } from "react";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

interface PermissionProfile {
  id: string;
  name: string;
  description: string;
  status: "Hoạt động" | "Không hoạt động";
}

const INIT_PROFILES: PermissionProfile[] = [];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "Hoạt động": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Không hoạt động": { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" },
};

export function PermissionProfilesPage() {
  const [profiles, setProfiles] = useState<PermissionProfile[]>(INIT_PROFILES);
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }

  const columns: Column<PermissionProfile>[] = [
    {
      key: "name",
      header: "Tên hồ sơ",
      render: (p) => <span style={{ fontWeight: 600 }}>{p.name}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      render: (p) => <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{p.description}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (p) => <Badge label={p.status} color={STATUS_STYLE[p.status]?.color ?? "#637381"} bg={STATUS_STYLE[p.status]?.bg ?? "#F4F6F8"} />,
    },
    {
      key: "actions",
      header: "Hành động",
      align: "right",
      render: (p) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-primary)", padding: 4, borderRadius: 6, display: "flex" }}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Hồ sơ phân quyền</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Quản lý các mẫu phân quyền để tạo vai trò nhanh chóng
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
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
          placeholder="Tìm kiếm hồ sơ..."
          style={{ width: "100%", paddingLeft: 34, paddingRight: 12, height: 38, border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", color: "var(--color-text-primary)", background: "var(--color-bg-card)", outline: "none" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(p) => p.id}
          pageSize={5}
        />
      </div>
    </div>
  );
}
