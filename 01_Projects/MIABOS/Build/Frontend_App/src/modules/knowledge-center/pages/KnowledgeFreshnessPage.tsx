import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { DATA_SOURCES } from "@/mocks/knowledge/sources";

function minutesAgo(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} phút`;
  return `${Math.floor(mins / 60)} giờ ${mins % 60} phút`;
}

export function KnowledgeFreshnessPage() {
  const navigate = useNavigate();
  const THRESHOLD_MINS = 60;

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 900, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/knowledge/sources")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: "var(--space-5)", padding: 0 }}
      >
        <ArrowLeft size={16} /> Nguồn dữ liệu
      </button>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Freshness Board</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Ngưỡng stale: <strong>1 giờ</strong> cho tất cả nguồn
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        {DATA_SOURCES.map((src) => {
          const mins = minutesAgo(src.lastSync);
          const isStale = mins > THRESHOLD_MINS;
          return (
            <div key={src.id} style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: `1px solid ${isStale ? "#FECACA" : "var(--color-border)"}`, padding: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-2)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: isStale ? "#DC2626" : "#16A34A" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{src.name}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: isStale ? "#DC2626" : "#16A34A", marginBottom: 4 }}>
                {formatDuration(mins)}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                {isStale ? "⚠ Vượt ngưỡng 1 giờ" : "✓ Trong ngưỡng cho phép"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", padding: "var(--space-3) var(--space-5)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-subtle)" }}>
          {["Nguồn", "Lần đồng bộ cuối", "Thời gian đã trôi qua", "Tài liệu", "Trạng thái"].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>
        {DATA_SOURCES.map((src, i) => {
          const mins = minutesAgo(src.lastSync);
          const isStale = mins > THRESHOLD_MINS;
          return (
            <div
              key={src.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", padding: "var(--space-4) var(--space-5)", borderBottom: i < DATA_SOURCES.length - 1 ? "1px solid var(--color-border)" : "none", alignItems: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: isStale ? "#DC2626" : "#16A34A", flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{src.name}</span>
              </div>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                {new Date(src.lastSync).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span style={{ fontSize: 13, color: isStale ? "#DC2626" : "var(--color-text-secondary)", fontWeight: isStale ? 600 : 400 }}>
                {formatDuration(mins)}
              </span>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{src.docCount}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {isStale ? (
                  <><AlertTriangle size={14} style={{ color: "#DC2626" }} /><span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>Stale</span></>
                ) : (
                  <><CheckCircle size={14} style={{ color: "#16A34A" }} /><span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>Active</span></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
