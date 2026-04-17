import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, BookOpen, FileText, Clock, AlertCircle } from "lucide-react";
import { KNOWLEDGE_DOCS, DOMAINS, type Domain } from "@/mocks/knowledge/documents";

const TYPE_COLORS: Record<string, string> = {
  FAQ: "#0EA5E9",
  SOP: "#8B5CF6",
  Policy: "#1E40AF",
  "System Guide": "#059669",
};

const STATUS_COLORS: Record<string, string> = {
  Published: "#16A34A",
  "Pending Review": "#D97706",
  Stale: "#DC2626",
  Superseded: "#94A3B8",
};

export function KnowledgeHomePage() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");
  const [activeDomain, setActiveDomain] = useState<Domain | "Tất cả">("Tất cả");

  const filtered = KNOWLEDGE_DOCS.filter((d) => {
    const matchDomain = activeDomain === "Tất cả" || d.domain === activeDomain;
    const matchSearch =
      !searchQ ||
      d.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      d.body.toLowerCase().includes(searchQ.toLowerCase());
    return matchDomain && matchSearch;
  });

  const stats = {
    total: KNOWLEDGE_DOCS.length,
    pending: KNOWLEDGE_DOCS.filter((d) => d.status === "Pending Review").length,
    stale: KNOWLEDGE_DOCS.filter((d) => d.status === "Stale").length,
  };

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            Knowledge Center
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 }}>
            Quản lý tài liệu chính sách, FAQ, SOP nội bộ
          </p>
        </div>
        <button
          onClick={() => navigate("/knowledge/create")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--color-primary)", color: "#fff",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          <Plus size={16} /> Tạo tài liệu mới
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        {[
          { label: "Tổng tài liệu", value: stats.total, icon: BookOpen, color: "var(--color-primary)" },
          { label: "Chờ duyệt", value: stats.pending, icon: Clock, color: "#D97706" },
          { label: "Cần cập nhật", value: stats.stale, icon: AlertCircle, color: "#DC2626" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-5)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon size={20} style={{ color }} />
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 8 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Tìm tài liệu..."
            style={{ width: "100%", paddingLeft: 34, paddingRight: 12, height: 36, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 14, background: "var(--color-bg-card)", color: "var(--color-text-primary)", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {(["Tất cả", ...DOMAINS] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d as Domain | "Tất cả")}
              style={{
                padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
                background: activeDomain === d ? "var(--color-primary)" : "var(--color-bg-card)",
                color: activeDomain === d ? "#fff" : "var(--color-text-secondary)",
                fontSize: 13, fontWeight: activeDomain === d ? 600 : 400, cursor: "pointer",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
        <button
          onClick={() => navigate("/knowledge/publishing-queue")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
        >
          <Clock size={14} /> Hàng chờ duyệt {stats.pending > 0 && <span style={{ background: "#D97706", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{stats.pending}</span>}
        </button>
        <button
          onClick={() => navigate("/knowledge/library")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
        >
          <BookOpen size={14} /> Thư viện tài liệu
        </button>
        <button
          onClick={() => navigate("/knowledge/sources")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}
        >
          <FileText size={14} /> Nguồn dữ liệu
        </button>
      </div>

      {/* Doc list */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 14 }}>
            Không tìm thấy tài liệu phù hợp.
          </div>
        ) : (
          filtered.map((doc, i) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/knowledge/${doc.id}`)}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-4)",
                padding: "var(--space-4) var(--space-5)",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none",
                cursor: "pointer", transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--color-bg-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: TYPE_COLORS[doc.type] + "1A", color: TYPE_COLORS[doc.type] }}>
                    {doc.type}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{doc.domain}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {doc.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                  {doc.owner} · Hiệu lực: {doc.effectiveDate}
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: STATUS_COLORS[doc.status] + "1A", color: STATUS_COLORS[doc.status], whiteSpace: "nowrap" }}>
                {doc.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
