import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { DOMAINS, DOC_TYPES, type Domain, type DocType } from "@/mocks/knowledge/documents";

interface FormState {
  type: DocType | "";
  title: string;
  domain: Domain | "";
  body: string;
  source: string;
  scope: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function KnowledgeCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ type: "", title: "", domain: "", body: "", source: "", scope: "Nội bộ" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.type) e.type = "Vui lòng chọn loại tài liệu";
    if (!form.title.trim()) e.title = "Tiêu đề không được để trống";
    if (!form.domain) e.domain = "Vui lòng chọn domain";
    if (!form.body.trim()) e.body = "Nội dung không được để trống";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => navigate("/knowledge"), 2000);
  };

  if (submitted) {
    return (
      <div style={{ padding: "var(--space-6)", maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
        <CheckCircle size={48} style={{ color: "#16A34A", marginBottom: "var(--space-4)" }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>
          Đã gửi để duyệt
        </h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
          Tài liệu của bạn đã được gửi vào hàng chờ duyệt. Đang chuyển về trang chính...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: 700, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/knowledge")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-primary)", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: "var(--space-5)", padding: 0 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-6)" }}>
        Tạo tài liệu mới
      </h1>

      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", padding: "var(--space-6)" }}>
        {/* Type */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Loại tài liệu <span style={{ color: "#DC2626" }}>*</span>
          </label>
          {errors.type && <div style={{ fontSize: 12, color: "#DC2626", marginBottom: "var(--space-1)" }}>{errors.type}</div>}
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {DOC_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                style={{
                  padding: "6px 16px", borderRadius: "var(--radius-sm)",
                  border: form.type === t ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                  background: form.type === t ? "var(--color-primary-light)" : "var(--color-bg-card)",
                  color: form.type === t ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontSize: 13, fontWeight: form.type === t ? 600 : 400, cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Tiêu đề <span style={{ color: "#DC2626" }}>*</span>
          </label>
          {errors.title && <div style={{ fontSize: 12, color: "#DC2626", marginBottom: "var(--space-1)" }}>{errors.title}</div>}
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Nhập tiêu đề tài liệu..."
            style={{ width: "100%", height: 40, padding: "0 12px", border: errors.title ? "1px solid #DC2626" : "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--color-text-primary)", background: "var(--color-bg-card)", boxSizing: "border-box" }}
          />
        </div>

        {/* Domain */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Domain <span style={{ color: "#DC2626" }}>*</span>
          </label>
          {errors.domain && <div style={{ fontSize: 12, color: "#DC2626", marginBottom: "var(--space-1)" }}>{errors.domain}</div>}
          <select
            value={form.domain}
            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value as Domain }))}
            style={{ width: "100%", height: 40, padding: "0 12px", border: errors.domain ? "1px solid #DC2626" : "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--color-text-primary)", background: "var(--color-bg-card)", boxSizing: "border-box" }}
          >
            <option value="">-- Chọn domain --</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Body */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Nội dung <span style={{ color: "#DC2626" }}>*</span>
          </label>
          {errors.body && <div style={{ fontSize: 12, color: "#DC2626", marginBottom: "var(--space-1)" }}>{errors.body}</div>}
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Nhập nội dung tài liệu..."
            rows={8}
            style={{ width: "100%", padding: "10px 12px", border: errors.body ? "1px solid #DC2626" : "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--color-text-primary)", background: "var(--color-bg-card)", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
          />
        </div>

        {/* Source */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Nguồn tham chiếu <span style={{ fontSize: 12, fontWeight: 400 }}>(không bắt buộc)</span>
          </label>
          <input
            value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
            placeholder="VD: SAP B1 — Báo giá Q2/2026, mã PO-00123"
            style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--color-text-primary)", background: "var(--color-bg-card)", boxSizing: "border-box" }}
          />
        </div>

        {/* Scope */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Phạm vi áp dụng
          </label>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {["Nội bộ", "Store staff", "Tất cả"].map((s) => (
              <button
                key={s}
                onClick={() => setForm((f) => ({ ...f, scope: s }))}
                style={{
                  padding: "6px 14px", borderRadius: "var(--radius-sm)",
                  border: form.scope === s ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                  background: form.scope === s ? "var(--color-primary-light)" : "var(--color-bg-card)",
                  color: form.scope === s ? "var(--color-primary)" : "var(--color-text-secondary)",
                  fontSize: 13, cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
          <button
            onClick={() => navigate("/knowledge")}
            style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)", color: "var(--color-text-secondary)", fontSize: 14, cursor: "pointer" }}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--color-primary)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Gửi để duyệt
          </button>
        </div>
      </div>
    </div>
  );
}
