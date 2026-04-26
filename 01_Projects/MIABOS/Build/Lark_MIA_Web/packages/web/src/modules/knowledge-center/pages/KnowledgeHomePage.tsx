import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Upload, Plus, ChevronRight, ChevronDown,
  AlertTriangle, Clock, CheckCircle, FileText,
  BookOpen, Database, X, RotateCcw,
  ClipboardList, HelpCircle, Shield, MonitorPlay, FolderInput,
} from "lucide-react";
import { KNOWLEDGE_DOCS, FOLDER_CATEGORIES, isStaleDoc, type KnowledgeDoc, type FolderCategory } from "@/mocks/knowledge/documents";
import { PUBLISHING_QUEUE } from "@/mocks/knowledge/publishingQueue";
import { DATA_SOURCES } from "@/mocks/knowledge/sources";

// ── Type badge config ────────────────────────────────────────
const TYPE_CONFIG: Record<string, { bg: string; color: string }> = {
  FAQ:           { bg: "#F0F9FF", color: "#0369A1" },
  SOP:           { bg: "#F5F3FF", color: "#6D28D9" },
  Policy:        { bg: "#EFF6FF", color: "#1D4ED8" },
  "System Guide":{ bg: "#F0FDF4", color: "#15803D" },
};

// ── Folder tree icons ────────────────────────────────────────
const FOLDER_ICONS: Record<FolderCategory, { icon: React.ReactNode; color: string }> = {
  SOP: { icon: <ClipboardList size={13} />, color: "#6D28D9" },
  FAQ: { icon: <HelpCircle size={13} />, color: "#0369A1" },
  Policy: { icon: <Shield size={13} />, color: "#1D4ED8" },
  "System Guide": { icon: <MonitorPlay size={13} />, color: "#15803D" },
  Imported: { icon: <FolderInput size={13} />, color: "#94A3B8" },
};

// ── Folder tree ──────────────────────────────────────────────
function FolderTree({
  selected,
  onSelect,
  counts,
}: {
  selected: FolderCategory | "all";
  onSelect: (f: FolderCategory | "all") => void;
  counts: Record<string, number>;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    SOP: true, FAQ: true, Policy: true, "System Guide": true, Imported: false,
  });

  return (
    <div style={{ fontSize: 13 }}>
      {/* All */}
      <button
        onClick={() => onSelect("all")}
        style={{
          width: "100%", textAlign: "left", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "6px 10px", borderRadius: "var(--radius-xs)",
          border: "none", cursor: "pointer",
          background: selected === "all" ? "var(--color-primary-light)" : "transparent",
          color: selected === "all" ? "var(--color-primary)" : "var(--color-text-secondary)",
          fontWeight: selected === "all" ? 600 : 400, marginBottom: 2,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BookOpen size={13} /> Tất cả
        </span>
        <span style={{ fontSize: 11, background: "var(--color-bg-surface)", padding: "1px 6px", borderRadius: 10, color: "var(--color-text-tertiary)" }}>
          {KNOWLEDGE_DOCS.length}
        </span>
      </button>

      {FOLDER_CATEGORIES.map((folder) => (
        <div key={folder}>
          <button
            onClick={() => {
              onSelect(folder);
              setExpanded((p) => ({ ...p, [folder]: !p[folder] }));
            }}
            style={{
              width: "100%", textAlign: "left", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "6px 10px", borderRadius: "var(--radius-xs)",
              border: "none", cursor: "pointer",
              background: selected === folder ? "var(--color-primary-light)" : "transparent",
              color: selected === folder ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontWeight: selected === folder ? 600 : 400, marginBottom: 2,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {expanded[folder]
                ? <ChevronDown size={12} style={{ color: "var(--color-text-tertiary)" }} />
                : <ChevronRight size={12} style={{ color: "var(--color-text-tertiary)" }} />
              }
              <span style={{ color: FOLDER_ICONS[folder].color }}>{FOLDER_ICONS[folder].icon}</span> {folder}
            </span>
            <span style={{ fontSize: 11, background: "var(--color-bg-surface)", padding: "1px 6px", borderRadius: 10, color: "var(--color-text-tertiary)" }}>
              {counts[folder] ?? 0}
            </span>
          </button>
        </div>
      ))}

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--color-border)", margin: "8px 0" }} />

      {/* Sections */}
      {[
        { key: "queue", icon: <Clock size={13} />, label: "Chờ duyệt", count: PUBLISHING_QUEUE.length, urgent: PUBLISHING_QUEUE.filter(q => q.slaStatus === "urgent").length },
        { key: "sources", icon: <Database size={13} />, label: "Source Health", count: DATA_SOURCES.filter(s => s.status !== "Active").length, urgent: 0 },
      ].map(({ key, icon, label, count, urgent }) => (
        <button
          key={key}
          onClick={() => onSelect(key as FolderCategory | "all")}
          style={{
            width: "100%", textAlign: "left", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "6px 10px", borderRadius: "var(--radius-xs)",
            border: "none", cursor: "pointer",
            background: selected === key ? "var(--color-primary-light)" : "transparent",
            color: selected === key ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontWeight: selected === key ? 600 : 400, marginBottom: 2,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{icon} {label}</span>
          {count > 0 && (
            <span style={{ fontSize: 11, background: urgent > 0 ? "#FEF2F2" : "var(--color-bg-surface)", padding: "1px 6px", borderRadius: 10, color: urgent > 0 ? "#B91C1C" : "var(--color-text-tertiary)", fontWeight: urgent > 0 ? 700 : 400 }}>
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Document row ─────────────────────────────────────────────
function DocRow({ doc, onClick }: { doc: KnowledgeDoc; onClick: () => void }) {
  const stale = isStaleDoc(doc);
  const effectiveStatus = stale && doc.status === "Published" ? "Stale" : doc.status;
  void effectiveStatus;
  const typeCfg = (TYPE_CONFIG[doc.type] ?? TYPE_CONFIG["FAQ"])!;
  const folderCfg = FOLDER_ICONS[doc.folder as FolderCategory];

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
        cursor: "pointer", borderBottom: "1px solid var(--color-border)",
        background: "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--color-bg-surface)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      {/* Type icon */}
      <div
        style={{
          width: 36, height: 36, borderRadius: "var(--radius-sm)",
          background: typeCfg.bg, display: "flex", alignItems: "center", justifyContent: "center",
          color: typeCfg.color, flexShrink: 0,
        }}
      >
        {folderCfg ? folderCfg.icon : <FileText size={16} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: typeCfg.bg, color: typeCfg.color }}>
            {doc.type}
          </span>
          {(stale || effectiveStatus === "Stale") && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "#FEF2F2", color: "#B91C1C", display: "flex", alignItems: "center", gap: 3 }}>
              <AlertTriangle size={9} /> Cần cập nhật
            </span>
          )}
          {doc.status === "Pending Review" && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "#FEF3C7", color: "#B45309" }}>
              Chờ duyệt
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {doc.title}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
          {doc.owner} · {doc.topic}
        </div>
      </div>
      <ChevronRight size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
    </div>
  );
}

// ── Queue panel ───────────────────────────────────────────────
function QueuePanel() {
  return (
    <div style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>Hàng chờ phê duyệt</div>
      {PUBLISHING_QUEUE.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13, padding: 24 }}>Không có yêu cầu đang chờ.</div>
      ) : (
        PUBLISHING_QUEUE.map(q => (
          <div key={q.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 8, background: "var(--color-bg-card)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: TYPE_CONFIG[q.docType]?.bg ?? "#F1F5F9", color: TYPE_CONFIG[q.docType]?.color ?? "#475569" }}>
                {q.docType}
              </span>
              {q.slaStatus === "urgent" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#B91C1C", display: "flex", alignItems: "center", gap: 3 }}>
                  <Clock size={10} /> SLA: gấp
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>{q.docTitle}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 8 }}>
              {q.submittedBy} · {new Date(q.submittedAt).toLocaleDateString("vi-VN")}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "5px 0", borderRadius: "var(--radius-xs)", border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <CheckCircle size={12} /> Duyệt
              </button>
              <button style={{ flex: 1, padding: "5px 0", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 12, cursor: "pointer" }}>
                Xem chi tiết
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Source Health panel ───────────────────────────────────────
function SourceHealthPanel() {
  return (
    <div style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>Source Health</div>
      {DATA_SOURCES.map(src => {
        const isOk = src.status === "Active";
        return (
          <div key={src.id} style={{ border: `1px solid ${isOk ? "var(--color-border)" : "#FCA5A5"}`, borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 8, background: isOk ? "var(--color-bg-card)" : "#FEF2F2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>{src.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: isOk ? "#F0FDF4" : "#FEF2F2", color: isOk ? "#15803D" : "#B91C1C" }}>
                {isOk ? "Active" : src.status}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 6 }}>{src.description}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "flex", gap: 12 }}>
              <span>{src.docCount} tài liệu</span>
              <span>Sync: {src.syncFrequency}</span>
            </div>
            {!isOk && (
              <button style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: "var(--radius-xs)", border: "1px solid #FCA5A5", background: "#fff", color: "#B91C1C", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                <RotateCcw size={11} /> Kiểm tra lại
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export function KnowledgeHomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQ, setSearchQ] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<FolderCategory | "all" | "queue" | "sources">("all");
  const [showImportBanner, setShowImportBanner] = useState(false);

  // section from URL param
  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "queue") setSelectedFolder("queue" as never);
    if (section === "sources") setSelectedFolder("sources" as never);
  }, [searchParams]);

  const folderCounts = FOLDER_CATEGORIES.reduce((acc, f) => {
    acc[f] = KNOWLEDGE_DOCS.filter(d => d.folder === f).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredDocs = KNOWLEDGE_DOCS.filter(doc => {
    const matchFolder = selectedFolder === "all" || doc.folder === selectedFolder;
    const matchSearch = !searchQ || doc.title.toLowerCase().includes(searchQ.toLowerCase()) || doc.body.toLowerCase().includes(searchQ.toLowerCase()) || doc.topic.toLowerCase().includes(searchQ.toLowerCase());
    return matchFolder && matchSearch;
  });

  const staleDocs = filteredDocs.filter(d => isStaleDoc(d) && d.status === "Published");
  const pendingDocs = filteredDocs.filter(d => d.status === "Pending Review");
  const recentDocs = [...KNOWLEDGE_DOCS].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 3);

  const isSpecialSection = selectedFolder === "queue" || selectedFolder === "sources";

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: "var(--color-bg-page)" }}>

      {/* ── Left: Folder tree ── */}
      <div style={{ width: 240, borderRight: "1px solid var(--color-border)", background: "var(--color-bg-card)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 12px 8px", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Trung tâm tri thức
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "8px 8px" }}>
          <FolderTree
            selected={selectedFolder as FolderCategory | "all"}
            onSelect={(f) => { setSelectedFolder(f as never); }}
            counts={folderCounts}
          />
        </div>
      </div>

      {/* ── Center: Content area (full width) ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Command bar */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-card)", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Tìm tài liệu... (Cmd+K)"
              style={{ width: "100%", paddingLeft: 32, paddingRight: 12, height: 34, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 13, background: "var(--color-bg-page)", color: "var(--color-text-primary)", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={() => setShowImportBanner(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            <Upload size={14} /> Import tài liệu
          </button>
          <button
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            <Plus size={14} /> Tạo thủ công
          </button>
        </div>

        {/* Import banner */}
        {showImportBanner && (
          <div style={{ margin: "12px 16px 0", padding: "12px 16px", background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Upload size={16} style={{ color: "#0369A1" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0C4A6E" }}>Import tài liệu</div>
                <div style={{ fontSize: 12, color: "#0369A1" }}>Hỗ trợ: PDF, DOCX, XLSX, hình ảnh. Kéo thả hoặc chọn file.</div>
              </div>
            </div>
            <button onClick={() => setShowImportBanner(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0369A1" }}><X size={14} /></button>
          </div>
        )}

        {/* Scrollable sections */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 0 16px" }}>
          {isSpecialSection ? (
            selectedFolder === "queue" ? <QueuePanel /> : <SourceHealthPanel />
          ) : (
            <>
              {/* Stale / pending alerts */}
              {(staleDocs.length > 0 || pendingDocs.length > 0) && (
                <div style={{ padding: "12px 16px 0" }}>
                  {staleDocs.length > 0 && (
                    <div style={{ display: "flex", gap: 8, background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "var(--radius-xs)", padding: "8px 12px", marginBottom: 6 }}>
                      <AlertTriangle size={13} style={{ color: "#B91C1C", marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#7F1D1D" }}><strong>{staleDocs.length} tài liệu</strong> quá chu kỳ review — cần cập nhật.</span>
                    </div>
                  )}
                  {pendingDocs.length > 0 && (
                    <div style={{ display: "flex", gap: 8, background: "#FEF3C7", border: "1px solid #D97706", borderRadius: "var(--radius-xs)", padding: "8px 12px" }}>
                      <Clock size={13} style={{ color: "#B45309", marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#78350F" }}><strong>{pendingDocs.length} tài liệu</strong> đang chờ phê duyệt.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Document list */}
              <div style={{ padding: "12px 16px 0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>
                    {selectedFolder === "all" ? "Tất cả tài liệu" : `${selectedFolder}`}
                  </span>
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{filteredDocs.length} tài liệu</span>
                </div>
                <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  {filteredDocs.length === 0 ? (
                    <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13 }}>
                      <FileText size={28} style={{ opacity: 0.3, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                      Không tìm thấy tài liệu phù hợp.
                      <br />
                      <button style={{ marginTop: 8, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        Báo thiếu nội dung
                      </button>
                    </div>
                  ) : (
                    filteredDocs.map((doc) => (
                      <DocRow
                        key={doc.id}
                        doc={doc}
                        onClick={() => navigate(`/knowledge/${doc.id}`)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Recent updates (only on "all" view) */}
              {selectedFolder === "all" && !searchQ && (
                <div style={{ padding: "16px 16px 0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                    Cập nhật gần đây
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {recentDocs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => navigate(`/knowledge/${doc.id}`)}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xs)", cursor: "pointer", textAlign: "left" }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: TYPE_CONFIG[doc.type]?.bg, color: TYPE_CONFIG[doc.type]?.color, whiteSpace: "nowrap" }}>{doc.type}</span>
                        <span style={{ flex: 1, fontSize: 12, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</span>
                        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{new Date(doc.lastUpdated).toLocaleDateString("vi-VN")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
