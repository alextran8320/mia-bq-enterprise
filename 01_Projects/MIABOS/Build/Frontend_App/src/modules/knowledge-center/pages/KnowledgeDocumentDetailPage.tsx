import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, AlertTriangle, Info, Edit, ChevronRight, ChevronDown,
  Shield, ClipboardList, HelpCircle, MonitorPlay,
  Play, FileText, Download, Calendar, User, Globe, Clock,
  ThumbsUp, ThumbsDown, Paperclip,
} from "lucide-react";
import { KNOWLEDGE_DOCS, isStaleDoc } from "@/mocks/knowledge/documents";
import { Card, Badge } from "@/shared/ui";

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  FAQ: { color: "#0369A1", bg: "#F0F9FF", icon: <HelpCircle size={18} /> },
  SOP: { color: "#6D28D9", bg: "#F5F3FF", icon: <ClipboardList size={18} /> },
  Policy: { color: "#1D4ED8", bg: "#EFF6FF", icon: <Shield size={18} /> },
  "System Guide": { color: "#15803D", bg: "#F0FDF4", icon: <MonitorPlay size={18} /> },
};

const ATTACHMENT_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText size={14} />,
  excel: <FileText size={14} />,
  doc: <FileText size={14} />,
};

// ── Feedback widget ───────────────────────────────────────────
function FeedbackWidget() {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Nội dung hữu ích không?</span>
      {(["up", "down"] as const).map((v) => (
        <button
          key={v}
          onClick={() => setVoted(voted === v ? null : v)}
          title={v === "up" ? "Hữu ích" : "Không hữu ích"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
            background: voted === v ? (v === "up" ? "#F0FDF4" : "#FEF2F2") : "var(--color-bg-card)",
            color: voted === v ? (v === "up" ? "#15803D" : "#B91C1C") : "var(--color-text-tertiary)",
            cursor: "pointer",
          }}
        >
          {v === "up" ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
        </button>
      ))}
      {voted && <span style={{ fontSize: 12, color: "var(--color-success)", fontWeight: 500 }}>Cảm ơn phản hồi!</span>}
    </div>
  );
}

// ── Policy-specific content ──────────────────────────────────
function PolicyContent({ doc }: { doc: (typeof KNOWLEDGE_DOCS)[0] }) {
  if (!doc.policySections?.length) {
    return (
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)", whiteSpace: "pre-line" }}>
        {doc.body}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {doc.policySections.map((section, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "#EFF6FF",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Shield size={14} style={{ color: "#1D4ED8" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>{section.heading}</span>
          </div>
          <div
            style={{
              padding: "var(--space-4)",
              fontSize: 13,
              lineHeight: 1.7,
              color: "var(--color-text-primary)",
              whiteSpace: "pre-line",
            }}
          >
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── FAQ-specific content ─────────────────────────────────────
function FAQContent({ doc }: { doc: (typeof KNOWLEDGE_DOCS)[0] }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  if (!doc.faqItems?.length) {
    return (
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)", whiteSpace: "pre-line" }}>
        {doc.body}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      {doc.faqItems.map((item, i) => {
        const isOpen = expandedIdx === i;
        return (
          <div
            key={i}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              background: isOpen ? "#F0F9FF" : "var(--color-bg-card)",
            }}
          >
            <button
              onClick={() => setExpandedIdx(isOpen ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: isOpen ? "#0369A1" : "var(--color-bg-surface)",
                  color: isOpen ? "#FFFFFF" : "var(--color-text-tertiary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}
              >
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", flex: 1 }}>
                {item.question}
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "0 var(--space-4) var(--space-4)",
                  paddingLeft: "calc(var(--space-4) + 24px + var(--space-3))",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── SOP-specific content ─────────────────────────────────────
function SOPContent({ doc }: { doc: (typeof KNOWLEDGE_DOCS)[0] }) {
  const steps = doc.body
    .split("\n")
    .filter((l) => l.trim().match(/^Bước \d+/));
  const nonStepBody = doc.body
    .split("\n")
    .filter((l) => !l.trim().match(/^Bước \d+/))
    .join("\n");

  if (steps.length === 0) {
    return (
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)", whiteSpace: "pre-line" }}>
        {doc.body}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "var(--space-4)",
              padding: "var(--space-4)",
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              borderLeft: "3px solid #6D28D9",
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#F5F3FF", color: "#6D28D9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.6, flex: 1 }}>
              {step.replace(/^Bước \d+:\s*/, "")}
            </div>
          </div>
        ))}
      </div>
      {nonStepBody.trim() && (
        <div style={{ marginTop: "var(--space-4)", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {nonStepBody}
        </div>
      )}
    </div>
  );
}

// ── System Guide-specific content ────────────────────────────
function SystemGuideContent({ doc }: { doc: (typeof KNOWLEDGE_DOCS)[0] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Video embed */}
      {doc.guideVideoUrl && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
            <Play size={12} /> Video hướng dẫn
          </div>
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background: "#000",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                cursor: "pointer",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto var(--space-3)",
                  }}
                >
                  <Play size={28} style={{ color: "#FFFFFF", marginLeft: 3 }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Click để xem video hướng dẫn</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-step guide with screenshots */}
      {doc.guideSteps?.length ? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-3)" }}>
            Hướng dẫn từng bước
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {doc.guideSteps.map((step, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                }}
              >
                {/* Step header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)",
                    background: "#F0FDF4",
                    borderBottom: step.screenshotUrl ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#15803D", color: "#FFFFFF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginTop: 2 }}>{step.description}</div>
                  </div>
                </div>

                {/* Screenshot */}
                {step.screenshotUrl && (
                  <div style={{ padding: "var(--space-3)", background: "var(--color-bg-surface)" }}>
                    <img
                      src={step.screenshotUrl}
                      alt={step.title}
                      style={{
                        width: "100%",
                        borderRadius: "var(--radius-xs)",
                        border: "1px solid var(--color-border)",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)", whiteSpace: "pre-line" }}>
          {doc.body}
        </div>
      )}
    </div>
  );
}

// ── Main detail page ─────────────────────────────────────────
export function KnowledgeDocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doc = KNOWLEDGE_DOCS.find((d) => d.id === id);

  if (!doc) {
    return (
      <div style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-tertiary)" }}>
        Không tìm thấy tài liệu.{" "}
        <button onClick={() => navigate("/knowledge")} style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          Quay lại
        </button>
      </div>
    );
  }

  const supersededDoc = doc.supersededBy ? KNOWLEDGE_DOCS.find((d) => d.id === doc.supersededBy) : null;
  const stale = isStaleDoc(doc);
  const typeCfg = TYPE_CONFIG[doc.type] ?? TYPE_CONFIG["FAQ"]!;
  const relatedDocs = KNOWLEDGE_DOCS.filter(d => d.id !== doc.id && d.topic === doc.topic && d.status === "Published").slice(0, 4);

  return (
    <div>
      {/* Back link */}
      <Link
        to="/knowledge"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-4)",
        }}
      >
        <ArrowLeft size={16} /> Quay lại Trung tâm tri thức
      </Link>

      {/* Banners */}
      {doc.status === "Superseded" && supersededDoc && (
        <div role="alert" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", background: "#FEF3C7", border: "1px solid #D97706", borderRadius: "var(--radius-sm)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <AlertTriangle size={16} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: "#92400E" }}>
            Tài liệu này đã được thay thế bởi{" "}
            <button onClick={() => navigate(`/knowledge/${supersededDoc.id}`)} style={{ color: "#1E40AF", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", fontSize: 13 }}>
              {supersededDoc.title}
            </button>
          </div>
        </div>
      )}

      {stale && doc.status !== "Superseded" && (
        <div role="alert" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", background: "#FEF2F2", border: "1px solid #DC2626", borderRadius: "var(--radius-sm)", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <AlertTriangle size={16} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: "#991B1B" }}>
            Tài liệu này có thể chưa được cập nhật mới nhất. Vui lòng xác nhận với Knowledge Owner trước khi áp dụng.
          </div>
        </div>
      )}

      {/* Main layout: 5fr content + 2fr sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr", gap: "var(--space-4)" }}>
        {/* Left: Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Header card */}
          <Card>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: "var(--radius-sm)",
                  background: typeCfg.bg, color: typeCfg.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {typeCfg.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                  <Badge label={doc.type} color={typeCfg.color} bg={typeCfg.bg} />
                  <Badge label={doc.topic} />
                  <Badge label={doc.scope} color="var(--color-text-secondary)" bg="var(--color-bg-surface)" />
                  {doc.status === "Pending Review" && <Badge label="Chờ duyệt" color="#B45309" bg="#FEF3C7" />}
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.4 }}>
                  {doc.title}
                </h1>
              </div>
              <button
                onClick={() => navigate(`/knowledge/${doc.id}/edit`)}
                style={{
                  display: "flex", alignItems: "center", gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
                  background: "var(--color-bg-card)", color: "var(--color-text-secondary)",
                  fontSize: 13, cursor: "pointer", flexShrink: 0,
                }}
              >
                <Edit size={14} /> Chỉnh sửa
              </button>
            </div>
          </Card>

          {/* Type-specific content */}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              {typeCfg.icon && <span style={{ color: typeCfg.color }}>{typeCfg.icon}</span>}
              {doc.type === "FAQ" && "Câu hỏi thường gặp"}
              {doc.type === "SOP" && "Các bước thực hiện"}
              {doc.type === "Policy" && "Nội dung chính sách"}
              {doc.type === "System Guide" && "Hướng dẫn hệ thống"}
            </div>

            {doc.type === "Policy" && <PolicyContent doc={doc} />}
            {doc.type === "FAQ" && <FAQContent doc={doc} />}
            {doc.type === "SOP" && <SOPContent doc={doc} />}
            {doc.type === "System Guide" && <SystemGuideContent doc={doc} />}
          </Card>

          {/* Attachments */}
          {doc.attachments && doc.attachments.length > 0 && (
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                <Paperclip size={12} /> Tài liệu đính kèm
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {doc.attachments.map((att, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: "var(--space-3)",
                      padding: "var(--space-3) var(--space-4)",
                      background: "var(--color-bg-page)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span style={{ color: "var(--color-primary)" }}>{ATTACHMENT_ICONS[att.type] ?? <FileText size={14} />}</span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{att.name}</span>
                    <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 12, cursor: "pointer" }}>
                      <Download size={12} /> Tải
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Feedback */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FeedbackWidget />
              <button style={{ fontSize: 12, color: "var(--color-text-tertiary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Báo nội dung sai
              </button>
            </div>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Metadata */}
          <Card>
            <h3 style={{ margin: "0 0 var(--space-4)", fontSize: 14 }}>Thông tin tài liệu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {[
                { icon: <User size={14} />, label: "Phụ trách", value: doc.owner },
                { icon: <Calendar size={14} />, label: "Hiệu lực từ", value: doc.effectiveDate },
                { icon: <Globe size={14} />, label: "Nguồn dữ liệu", value: doc.sourceType },
                { icon: <Shield size={14} />, label: "Phạm vi", value: doc.scope },
                { icon: <Clock size={14} />, label: "Cập nhật lần cuối", value: new Date(doc.lastUpdated).toLocaleDateString("vi-VN") },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                  <span style={{ color: "var(--color-text-tertiary)", marginTop: 1, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 1 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Source citation */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              <Info size={14} style={{ color: "var(--color-primary)" }} />
              <h3 style={{ margin: 0, fontSize: 14 }}>Nguồn & Trạng thái</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "var(--color-text-tertiary)" }}>Trạng thái</span>
                <Badge
                  label={stale ? "Cần cập nhật" : doc.status}
                  color={stale ? "#B91C1C" : doc.status === "Published" ? "#15803D" : "#B45309"}
                  bg={stale ? "#FEF2F2" : doc.status === "Published" ? "#F0FDF4" : "#FEF3C7"}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "var(--color-text-tertiary)" }}>Chu kỳ review</span>
                <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{doc.reviewCycleDays} ngày</span>
              </div>
              {stale && (
                <div style={{ marginTop: "var(--space-2)", padding: "var(--space-2) var(--space-3)", background: "#FEF2F2", borderRadius: "var(--radius-xs)", fontSize: 11, color: "#B91C1C", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                  <AlertTriangle size={11} />
                  Chưa review đúng chu kỳ
                </div>
              )}
            </div>
          </Card>

          {/* Related docs */}
          {relatedDocs.length > 0 && (
            <Card>
              <h3 style={{ margin: "0 0 var(--space-3)", fontSize: 14 }}>Tài liệu liên quan</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {relatedDocs.map((r) => {
                  const rCfg = TYPE_CONFIG[r.type] ?? TYPE_CONFIG["FAQ"]!;
                  return (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/knowledge/${r.id}`)}
                      style={{
                        display: "flex", alignItems: "center", gap: "var(--space-2)",
                        width: "100%", textAlign: "left",
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: "var(--radius-xs)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-card)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-surface)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-card)"; }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: rCfg.bg, color: rCfg.color, whiteSpace: "nowrap" }}>
                        {r.type}
                      </span>
                      <span style={{ flex: 1, fontSize: 12, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.title}
                      </span>
                      <ChevronRight size={12} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
