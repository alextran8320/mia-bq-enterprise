import { useState } from "react";
import { ExternalLink, Eye, Facebook, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

interface Channel {
  id: string;
  name: string;
  platform: "Facebook" | "Zalo" | "Instagram" | "TikTok";
  status: "Đã kết nối" | "Ngắt kết nối";
  active: boolean;
  replyComment: boolean;
  tokenExpired: string | null;
  createdAt: string;
}

const INIT_CHANNELS: Channel[] = [
  { id: "ch1", name: "Dental Crowns – Delia Dental Clinic", platform: "Facebook", status: "Đã kết nối", active: true, replyComment: true, tokenExpired: null, createdAt: "6/4/2026" },
  { id: "ch2", name: "Thung lũng", platform: "Facebook", status: "Ngắt kết nối", active: false, replyComment: true, tokenExpired: null, createdAt: "6/4/2026" },
  { id: "ch3", name: "Nha khoa Automation", platform: "Facebook", status: "Ngắt kết nối", active: false, replyComment: true, tokenExpired: null, createdAt: "1/4/2026" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "Đã kết nối": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Ngắt kết nối": { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" },
};

function PlatformIcon({ platform }: { platform: Channel["platform"] }) {
  if (platform === "Facebook") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Facebook size={12} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontSize: 13 }}>Facebook</span>
      </div>
    );
  }
  return <span style={{ fontSize: 13 }}>{platform}</span>;
}

function ToggleBadge({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{ border: "none", cursor: "pointer", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: on ? "#212B36" : "#F4F6F8", color: on ? "#fff" : "#637381", fontFamily: "var(--font-primary)", transition: "all 0.15s" }}
    >
      {on ? "Bật" : "Tắt"}
    </button>
  );
}

export function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(INIT_CHANNELS);
  const [search, setSearch] = useState("");

  const filtered = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.platform.toLowerCase().includes(search.toLowerCase())
  );

  function toggleActive(id: string) {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  }
  function toggleReply(id: string) {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, replyComment: !c.replyComment } : c));
  }
  function handleDelete(id: string) {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  }

  const columns: Column<Channel>[] = [
    {
      key: "name",
      header: "Tên",
      render: (c) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Facebook size={12} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</span>
        </div>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (c) => <PlatformIcon platform={c.platform} />,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (c) => <Badge label={c.status} color={STATUS_STYLE[c.status]?.color ?? "#637381"} bg={STATUS_STYLE[c.status]?.bg ?? "#F4F6F8"} />,
    },
    {
      key: "active",
      header: "Kích hoạt",
      render: (c) => <ToggleBadge on={c.active} onToggle={() => toggleActive(c.id)} />,
    },
    {
      key: "replyComment",
      header: "Trả lời comment",
      render: (c) => <ToggleBadge on={c.replyComment} onToggle={() => toggleReply(c.id)} />,
    },
    {
      key: "tokenExpired",
      header: "Token hết hạn",
      render: (c) => <span style={{ color: "var(--color-text-tertiary)", fontSize: 13 }}>{c.tokenExpired ?? "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (c) => <span style={{ fontSize: 13 }}>{c.createdAt}</span>,
    },
    {
      key: "actions",
      header: "Hành động",
      align: "right",
      render: (c) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <button onClick={(e) => e.stopPropagation()} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-primary)", padding: 4, borderRadius: 6, display: "flex" }}>
            <Eye size={15} />
          </button>
          <button onClick={(e) => e.stopPropagation()} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-primary)", padding: 4, borderRadius: 6, display: "flex" }}>
            <ExternalLink size={15} />
          </button>
          <button onClick={(e) => e.stopPropagation()} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-primary)", padding: 4, borderRadius: 6, display: "flex" }}>
            <Pencil size={15} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-error)", padding: 4, borderRadius: 6, display: "flex" }}>
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
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quản lý kênh</h1>
        <Button variant="primary" style={{ gap: 6 }}>
          <Plus size={14} /> Tạo mới
        </Button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 280 }}>
        <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm kênh..."
          style={{ width: "100%", paddingLeft: 34, paddingRight: 12, height: 38, border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", color: "var(--color-text-primary)", background: "var(--color-bg-card)", outline: "none" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(c) => c.id}
          pageSize={10}
        />
      </div>
    </div>
  );
}
