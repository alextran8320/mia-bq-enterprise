import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { PUBLISHING_QUEUE } from "@/mocks/knowledge/publishingQueue";

export function KnowledgePublishingQueuePage() {
  const navigate = useNavigate();
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleApprove = (id: string) => {
    setApproved((s) => new Set(s).add(id));
    showToast("Đã duyệt tài liệu thành công.");
  };

  const handleReject = (id: string) => {
    if (!rejectComment.trim()) return;
    setRejected((s) => new Set(s).add(id));
    setRejectingId(null);
    setRejectComment("");
    showToast("Đã từ chối và gửi phản hồi cho người tạo.");
  };

  const pending = PUBLISHING_QUEUE.filter((q) => !approved.has(q.id) && !rejected.has(q.id));

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 900, margin: "0 auto" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, background: "#16A34A", color: "#fff", padding: "12px 20px", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          {toast}
        </div>
      )}

      <button
        onClick={() => navigate("/knowledge")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: "var(--space-5)", padding: 0 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Hàng chờ duyệt</h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
            {pending.length} tài liệu đang chờ xem xét
          </p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", padding: "var(--space-10)", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 14 }}>
          Không còn tài liệu nào chờ duyệt.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {pending.map((item) => (
            <div key={item.id} style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#EFF6FF", color: "#1E40AF", fontWeight: 600 }}>{item.docType}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{item.domain}</span>
                    {item.changeType === "update" && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#F3F4F6", color: "#6B7280" }}>Cập nhật</span>
                    )}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>{item.docTitle}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                    Gửi bởi {item.submittedBy} · {new Date(item.submittedAt).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 10, background: item.slaStatus === "urgent" ? "#FEF2F2" : "#F1F5F9", flexShrink: 0 }}>
                  <Clock size={13} style={{ color: item.slaStatus === "urgent" ? "#DC2626" : "#94A3B8" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.slaStatus === "urgent" ? "#DC2626" : "#64748B" }}>
                    {item.slaStatus === "urgent" ? "Gấp" : "Bình thường"}
                  </span>
                </div>
              </div>

              {/* Body preview */}
              <div style={{ padding: "var(--space-4) var(--space-5)", background: "var(--color-bg-subtle)", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", whiteSpace: "pre-line", maxHeight: 80, overflow: "hidden" }}>
                  {item.body}
                </div>
              </div>

              {/* Reject comment area */}
              {rejectingId === item.id && (
                <div style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--color-border)", background: "#FFF7ED" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "var(--space-2)" }}>
                    Lý do từ chối <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Nhập lý do từ chối để gửi phản hồi cho người tạo..."
                    rows={3}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              )}

              {/* Actions */}
              <div style={{ padding: "var(--space-3) var(--space-5)", display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }}>
                {rejectingId === item.id ? (
                  <>
                    <button onClick={() => { setRejectingId(null); setRejectComment(""); }} style={{ padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer" }}>
                      Hủy
                    </button>
                    <button onClick={() => handleReject(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "#DC2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <XCircle size={14} /> Xác nhận từ chối
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setRejectingId(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "1px solid #DC2626", background: "var(--color-bg-card)", color: "#DC2626", fontSize: 13, cursor: "pointer" }}>
                      <XCircle size={14} /> Từ chối
                    </button>
                    <button onClick={() => handleApprove(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "#16A34A", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <CheckCircle size={14} /> Duyệt
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
