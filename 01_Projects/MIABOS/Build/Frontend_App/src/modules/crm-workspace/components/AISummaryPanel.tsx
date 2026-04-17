import { Card } from "@/shared/ui";
import { Sparkles, Target, AlertTriangle, Zap } from "lucide-react";
import type { AISummaryData } from "@/mocks/crm/customers";

export function AISummaryPanel({ data }: { data?: AISummaryData }) {
  if (!data) {
    return (
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          <Sparkles size={16} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ margin: 0 }}>AI Summary</h3>
        </div>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>
          Chưa có dữ liệu AI summary.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Sparkles size={16} style={{ color: "var(--color-primary)" }} />
          <h3 style={{ margin: 0 }}>AI Summary</h3>
        </div>
        <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
          Cập nhật: {data.lastUpdated}
        </span>
      </div>

      <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-5)" }}>
        {data.summary}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        {/* Needs */}
        <div
          style={{
            padding: "var(--space-3)",
            background: "#EFF6FF",
            borderRadius: "var(--radius-sm)",
            borderLeft: "3px solid var(--color-primary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-2)" }}>
            <Target size={13} style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-primary)" }}>Nhu cầu</span>
          </div>
          {data.needs.map((n, i) => (
            <div key={i} style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)", paddingLeft: "var(--space-2)" }}>
              • {n}
            </div>
          ))}
        </div>

        {/* Risks */}
        <div
          style={{
            padding: "var(--space-3)",
            background: "#FEF3C7",
            borderRadius: "var(--radius-sm)",
            borderLeft: "3px solid var(--color-warning)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-2)" }}>
            <AlertTriangle size={13} style={{ color: "var(--color-warning)" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-warning)" }}>Rủi ro</span>
          </div>
          {data.risks.map((r, i) => (
            <div key={i} style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)", paddingLeft: "var(--space-2)" }}>
              • {r}
            </div>
          ))}
        </div>
      </div>

      {/* Next Best Actions */}
      <div style={{ marginTop: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-2)" }}>
          <Zap size={13} style={{ color: "var(--color-success)" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-success)" }}>Hành động tiếp theo</span>
        </div>
        {data.nextBestActions.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              background: "#DCFCE7",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--space-2)",
              fontSize: "12px",
              color: "#15803D",
            }}
          >
            <span style={{ fontWeight: 600 }}>{i + 1}.</span> {a}
          </div>
        ))}
      </div>
    </Card>
  );
}
