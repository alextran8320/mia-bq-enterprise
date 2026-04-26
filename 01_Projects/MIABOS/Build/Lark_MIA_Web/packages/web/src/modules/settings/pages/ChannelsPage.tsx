import { useState } from "react";
import { ExternalLink, Eye, Facebook, Mail, Monitor, Phone, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { DataTable } from "@/shared/ui/DataTable";
import type { Column } from "@/shared/ui/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChannelPlatform =
  | "Facebook Messenger"
  | "Zalo OA"
  | "Zalo ZNS"
  | "Website Chat"
  | "SMS"
  | "Email";

interface Channel {
  id: string;
  name: string;
  platform: ChannelPlatform;
  status: "Đã kết nối" | "Ngắt kết nối";
  active: boolean;
  replyComment: boolean;
  tokenExpired: string | null;
  createdAt: string;
}

// ─── Mock data — 6 kênh BQ thực tế ──────────────────────────────────────────

const INIT_CHANNELS: Channel[] = [
  {
    id: "ch1",
    name: "BQ - Facebook Messenger",
    platform: "Facebook Messenger",
    status: "Đã kết nối",
    active: true,
    replyComment: true,
    tokenExpired: null,
    createdAt: "01/01/2026",
  },
  {
    id: "ch2",
    name: "BQ - Zalo OA",
    platform: "Zalo OA",
    status: "Đã kết nối",
    active: true,
    replyComment: false,
    tokenExpired: null,
    createdAt: "01/01/2026",
  },
  {
    id: "ch3",
    name: "BQ - Zalo ZNS",
    platform: "Zalo ZNS",
    status: "Đã kết nối",
    active: true,
    replyComment: false,
    tokenExpired: null,
    createdAt: "15/02/2026",
  },
  {
    id: "ch4",
    name: "giaybq.com.vn Chat",
    platform: "Website Chat",
    status: "Đã kết nối",
    active: true,
    replyComment: false,
    tokenExpired: null,
    createdAt: "01/03/2026",
  },
  {
    id: "ch5",
    name: "BQ - SMS Notification",
    platform: "SMS",
    status: "Đã kết nối",
    active: true,
    replyComment: false,
    tokenExpired: null,
    createdAt: "01/01/2026",
  },
  {
    id: "ch6",
    name: "BQ - Email CSKH",
    platform: "Email",
    status: "Ngắt kết nối",
    active: false,
    replyComment: false,
    tokenExpired: "30/03/2026",
    createdAt: "01/01/2026",
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "Đã kết nối": { color: "var(--color-success)", bg: "#DCFCE7" },
  "Ngắt kết nối": { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" },
};

const PLATFORM_CONFIG: Record<ChannelPlatform, { label: string; iconBg: string; icon: React.ReactNode }> = {
  "Facebook Messenger": {
    label: "Facebook Messenger",
    iconBg: "#1877F2",
    icon: <Facebook size={11} color="#fff" fill="#fff" />,
  },
  "Zalo OA": {
    label: "Zalo OA",
    iconBg: "#0068FF",
    icon: <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", lineHeight: 1 }}>Z</span>,
  },
  "Zalo ZNS": {
    label: "Zalo ZNS",
    iconBg: "#0068FF",
    icon: <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", lineHeight: 1 }}>ZNS</span>,
  },
  "Website Chat": {
    label: "Website Chat",
    iconBg: "#0F766E",
    icon: <Monitor size={11} color="#fff" />,
  },
  "SMS": {
    label: "SMS",
    iconBg: "#7C3AED",
    icon: <Phone size={11} color="#fff" />,
  },
  "Email": {
    label: "Email",
    iconBg: "#B45309",
    icon: <Mail size={11} color="#fff" />,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: ChannelPlatform }) {
  const cfg = PLATFORM_CONFIG[platform];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 20, height: 20, borderRadius: 4, background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {cfg.icon}
      </div>
      <span style={{ fontSize: 13 }}>{cfg.label}</span>
    </div>
  );
}

function ChannelNameCell({ channel }: { channel: Channel }) {
  const cfg = PLATFORM_CONFIG[channel.platform];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 20, height: 20, borderRadius: 4, background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {cfg.icon}
      </div>
      <span style={{ fontWeight: 500, fontSize: 13 }}>{channel.name}</span>
    </div>
  );
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

// ─── Page ─────────────────────────────────────────────────────────────────────

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
      render: (c) => <ChannelNameCell channel={c} />,
      width: "26%",
    },
    {
      key: "platform",
      header: "Platform",
      render: (c) => <PlatformIcon platform={c.platform} />,
      width: "18%",
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (c) => <Badge label={c.status} color={STATUS_STYLE[c.status]?.color ?? "#637381"} bg={STATUS_STYLE[c.status]?.bg ?? "#F4F6F8"} />,
      width: "12%",
    },
    {
      key: "active",
      header: "Kích hoạt",
      render: (c) => <ToggleBadge on={c.active} onToggle={() => toggleActive(c.id)} />,
      width: "10%",
    },
    {
      key: "replyComment",
      header: "Trả lời comment",
      render: (c) => <ToggleBadge on={c.replyComment} onToggle={() => toggleReply(c.id)} />,
      width: "13%",
    },
    {
      key: "tokenExpired",
      header: "Token hết hạn",
      render: (c) => (
        <span style={{ color: c.tokenExpired ? "var(--color-error)" : "var(--color-text-tertiary)", fontSize: 13, fontWeight: c.tokenExpired ? 600 : undefined }}>
          {c.tokenExpired ?? "—"}
        </span>
      ),
      width: "11%",
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (c) => <span style={{ fontSize: 13 }}>{c.createdAt}</span>,
      width: "8%",
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
        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Cài đặt</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Kết nối đa kênh</h1>
        </div>
        <Button variant="primary" style={{ gap: 6 }}>
          <Plus size={14} /> Thêm kênh mới
        </Button>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        {[
          { label: "Kênh hoạt động", value: channels.filter((c) => c.active).length, color: "var(--color-success)" },
          { label: "Đã kết nối", value: channels.filter((c) => c.status === "Đã kết nối").length, color: "var(--color-primary)" },
          { label: "Ngắt kết nối", value: channels.filter((c) => c.status === "Ngắt kết nối").length, color: "var(--color-text-tertiary)" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "10px 16px", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 280 }}>
        <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm kênh..."
          style={{ width: "100%", paddingLeft: 34, paddingRight: 12, height: 38, border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-primary)", color: "var(--color-text-primary)", background: "var(--color-bg-card)", outline: "none", boxSizing: "border-box" }}
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
