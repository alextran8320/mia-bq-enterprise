import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertTriangle, BarChart2, RefreshCw } from "lucide-react";
import { DATA_SOURCES } from "@/mocks/knowledge/sources";

const STATUS_CONFIG = {
  Active: { color: "#16A34A", bg: "#F0FDF4", label: "Hoạt động", Icon: CheckCircle },
  Stale: { color: "#DC2626", bg: "#FEF2F2", label: "Cần đồng bộ", Icon: AlertTriangle },
  Conflict: { color: "#D97706", bg: "#FFFBEB", label: "Xung đột", Icon: AlertTriangle },
};

function minutesAgo(isoDate: string): string {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (diff < 60) return `${diff} phút trước`;
  return `${Math.floor(diff / 60)} giờ trước`;
}

export function KnowledgeSourcesPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 900, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/knowledge")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: "var(--space-5)", padding: 0 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Nguồn dữ liệu</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
            3 nguồn đang kết nối · Freshness threshold: 1 giờ
          </p>
        </div>
        <button
          onClick={() => navigate("/knowledge/freshness")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
        >
          <BarChart2 size={14} /> Freshness Board
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {DATA_SOURCES.map((src) => {
          const cfg = STATUS_CONFIG[src.status];
          const Icon = cfg.Icon;
          return (
            <div key={src.id} style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <div style={{ padding: "var(--space-5)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)" }}>{src.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 10, background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 var(--space-3)" }}>
                    {src.description}
                  </p>
                  <div style={{ display: "flex", gap: "var(--space-5)", fontSize: 12, color: "var(--color-text-tertiary)" }}>
                    <span><RefreshCw size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />Đồng bộ lần cuối: {minutesAgo(src.lastSync)}</span>
                    <span>Tần suất: {src.syncFrequency}</span>
                    <span>{src.docCount} tài liệu</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
                  {src.status !== "Active" && (
                    <button style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-primary)", background: "var(--color-primary-light)", color: "var(--color-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      Đồng bộ ngay
                    </button>
                  )}
                  <button style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 12, cursor: "pointer" }}>
                    Giới hạn
                  </button>
                </div>
              </div>
              {src.status === "Stale" && (
                <div style={{ padding: "var(--space-3) var(--space-5)", background: "#FEF2F2", borderTop: "1px solid #FECACA", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={14} style={{ color: "#DC2626" }} />
                  <span style={{ fontSize: 12, color: "#991B1B" }}>
                    Nguồn này chưa được đồng bộ hơn 1 giờ. AI có thể đang dùng dữ liệu lỗi thời.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
