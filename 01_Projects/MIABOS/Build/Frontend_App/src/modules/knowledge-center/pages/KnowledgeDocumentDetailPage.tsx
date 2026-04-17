import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Info, Edit } from "lucide-react";
import { KNOWLEDGE_DOCS, isStaleDoc } from "@/mocks/knowledge/documents";

const TYPE_COLORS: Record<string, string> = {
  FAQ: "#0EA5E9",
  SOP: "#8B5CF6",
  Policy: "#1E40AF",
  "System Guide": "#059669",
};

export function KnowledgeDocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doc = KNOWLEDGE_DOCS.find((d) => d.id === id);

  if (!doc) {
    return (
      <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-tertiary)" }}>
        Không tìm thấy tài liệu.{" "}
        <button onClick={() => navigate("/knowledge")} style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          Quay lại
        </button>
      </div>
    );
  }

  const supersededDoc = doc.supersededBy ? KNOWLEDGE_DOCS.find((d) => d.id === doc.supersededBy) : null;
  const stale = isStaleDoc(doc);

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 800, margin: "0 auto" }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: "var(--space-5)", padding: 0 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      {/* Superseded banner */}
      {doc.status === "Superseded" && supersededDoc && (
        <div role="alert" style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FEF3C7", border: "1px solid #D97706", borderRadius: "var(--radius-sm)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <AlertTriangle size={16} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: "#92400E" }}>
            Tài liệu này đã được thay thế bởi{" "}
            <button onClick={() => navigate(`/knowledge/${supersededDoc.id}`)} style={{ color: "#1E40AF", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
              {supersededDoc.title}
            </button>
          </div>
        </div>
      )}

      {/* Stale banner */}
      {stale && doc.status !== "Superseded" && (
        <div role="alert" style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FEF2F2", border: "1px solid #DC2626", borderRadius: "var(--radius-sm)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <AlertTriangle size={16} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: "#991B1B" }}>
            Tài liệu này có thể chưa được cập nhật mới nhất. Vui lòng xác nhận với Knowledge Owner trước khi áp dụng.
          </div>
        </div>
      )}

      {/* Main card */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "var(--space-6)", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: TYPE_COLORS[doc.type] + "1A", color: TYPE_COLORS[doc.type] }}>
              {doc.type}
            </span>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{doc.topic}</span>
            <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: "#F1F5F9", color: "var(--color-text-secondary)" }}>
              {doc.scope}
            </span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 var(--space-3)" }}>
            {doc.title}
          </h1>
          <div style={{ display: "flex", gap: "var(--space-5)", fontSize: 13, color: "var(--color-text-tertiary)" }}>
            <span>Người sở hữu: <strong style={{ color: "var(--color-text-secondary)" }}>{doc.owner}</strong></span>
            <span>Hiệu lực: <strong style={{ color: "var(--color-text-secondary)" }}>{doc.effectiveDate}</strong></span>
            <span>Nguồn: <strong style={{ color: "var(--color-text-secondary)" }}>{doc.sourceType}</strong></span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "var(--space-6)" }}>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)", whiteSpace: "pre-line" }}>
            {doc.body}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 6 }}>
            <Info size={13} />
            Cập nhật lần cuối: {new Date(doc.lastUpdated).toLocaleString("vi-VN")}
          </span>
          <button
            onClick={() => navigate(`/knowledge/${doc.id}/edit`)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
          >
            <Edit size={14} /> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
