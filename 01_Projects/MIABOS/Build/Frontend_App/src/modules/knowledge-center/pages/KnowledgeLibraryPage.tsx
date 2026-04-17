import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import { KNOWLEDGE_DOCS, DOMAINS, type Domain } from "@/mocks/knowledge/documents";

const TYPE_COLORS: Record<string, string> = {
  FAQ: "#0EA5E9",
  SOP: "#8B5CF6",
  Policy: "#1E40AF",
  "System Guide": "#059669",
};

export function KnowledgeLibraryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activeDomain, setActiveDomain] = useState<Domain | "Tất cả">("Tất cả");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const publishedDocs = KNOWLEDGE_DOCS.filter((d) => d.status === "Published" || d.status === "Stale");

  const results = publishedDocs.filter((d) => {
    const matchDomain = activeDomain === "Tất cả" || d.domain === activeDomain;
    const matchQ =
      !debouncedQ ||
      d.title.toLowerCase().includes(debouncedQ.toLowerCase()) ||
      d.body.toLowerCase().includes(debouncedQ.toLowerCase());
    return matchDomain && matchQ;
  });

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 var(--space-2)" }}>
          Thư viện tài liệu
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>
          Tra cứu chính sách, FAQ, SOP nội bộ theo domain
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "var(--space-4)" }}>
        <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm chính sách, FAQ, SOP..."
          style={{ width: "100%", height: 48, paddingLeft: 44, paddingRight: 16, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: 15, background: "var(--color-bg-card)", color: "var(--color-text-primary)", boxSizing: "border-box" }}
        />
      </div>

      {/* Domain tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        {(["Tất cả", ...DOMAINS] as const).map((d) => (
          <button
            key={d}
            onClick={() => setActiveDomain(d as Domain | "Tất cả")}
            style={{
              padding: "8px 16px", borderRadius: "var(--radius-sm)",
              border: activeDomain === d ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: activeDomain === d ? "var(--color-primary)" : "var(--color-bg-card)",
              color: activeDomain === d ? "#fff" : "var(--color-text-secondary)",
              fontSize: 13, fontWeight: activeDomain === d ? 600 : 400, cursor: "pointer",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", padding: "var(--space-10)", textAlign: "center" }}>
          <BookOpen size={40} style={{ color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Không tìm thấy tài liệu phù hợp
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: "var(--space-4)" }}>
            Hãy thử từ khóa khác hoặc thay đổi domain
          </div>
          <button
            onClick={() => navigate("/knowledge/create")}
            style={{ padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-primary)", background: "var(--color-primary-light)", color: "var(--color-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Báo thiếu tài liệu
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }}>
            {results.length} tài liệu{debouncedQ ? ` cho "${debouncedQ}"` : ""}
          </div>
          <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
            {results.map((doc, i) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/knowledge/${doc.id}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "var(--space-4)",
                  padding: "var(--space-4) var(--space-5)",
                  borderBottom: i < results.length - 1 ? "1px solid var(--color-border)" : "none",
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
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#F1F5F9", color: "#64748B" }}>{doc.scope}</span>
                    {doc.status === "Stale" && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#FEF2F2", color: "#DC2626", fontWeight: 600 }}>Cần cập nhật</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.body.slice(0, 100)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
