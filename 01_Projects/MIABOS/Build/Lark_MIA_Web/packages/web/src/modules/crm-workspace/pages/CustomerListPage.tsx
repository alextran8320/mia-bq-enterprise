import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Search, Plus, Upload, Filter, Trash2, GitMerge, RefreshCw,
  X, CheckCircle, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";
import { DataTable, Avatar, StatusBadge, Input, Card, Button } from "@/shared/ui";
import type { Column } from "@/shared/ui";
import { CUSTOMERS } from "@/mocks/crm/customers";
import type { Customer, CustomerStatus } from "@/mocks/crm/customers";
import { customerApi, type CustomerEntry } from "@/shared/api/customerApi";
import { getApiErrorMessage } from "@/shared/auth/apiClient";

// Map a BE CustomerEntry → the rich Customer shape this page expects.
// Fields not provided by BE (orders, timeline, AI summary, …) get safe defaults
// so existing UI keeps rendering. Will be replaced as BE schema grows.
function apiToCustomer(c: CustomerEntry): Customer {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone ?? "",
    email: c.email ?? "",
    status: (c.status as CustomerStatus) ?? "Lead",
    source: c.source ?? "—",
    consentGiven: c.consentGiven,
    createdAt: c.createdAt.slice(0, 10),
    lastContact: (c.lastContactAt ?? c.updatedAt).slice(0, 10),
    gender: c.gender ?? undefined,
    birthday: c.birthday ?? undefined,
    region: c.region ?? undefined,
    preferredChannel: c.preferredChannel ?? undefined,
    preferredStore: c.preferredStore ?? undefined,
    totalSpent: c.totalSpent,
    orderCount: c.orderCount,
    avgOrderValue: c.orderCount > 0 ? Math.round(c.totalSpent / c.orderCount) : 0,
    tags: c.tags,
    attributes: [],
    orders: [],
    conversations: [],
    calls: [],
    identities: [],
    timeline: [],
    aiSummary: undefined,
    channel: c.preferredChannel ?? undefined,
    platform: undefined,
    syncSource: c.source ?? undefined,
    assignee: c.assigneeEmail ?? undefined,
    updatedAt: c.updatedAt.slice(0, 10),
  };
}

const STATUS_FILTERS: (CustomerStatus | "All")[] = ["All", "Lead", "Qualified", "Customer", "Inactive", "Blocked"];

// ── Modal overlay ──
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.28)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// ── FilterSelect with title ──
function FilterSelect<T extends string>({ title, value, options, onChange }: {
  title: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  // Close on click outside
  useState(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: "var(--radius-sm)",
          border: open ? "1.5px solid #212B36" : "1.5px solid transparent",
          background: "var(--color-bg-card)", color: "#212B36",
          fontSize: 13, fontFamily: "var(--font-primary)", fontWeight: 400,
          cursor: "pointer", boxShadow: "var(--shadow-ambient)",
          minWidth: 140, whiteSpace: "nowrap",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>
          <span style={{ color: "#919EAB", fontWeight: 400 }}>{title}: </span>
          {selectedLabel}
        </span>
        {open ? <ChevronUp size={14} color="#919EAB" /> : <ChevronDown size={14} color="#919EAB" />}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 10,
          background: "#fff", borderRadius: "var(--radius-sm)",
          boxShadow: "0 12px 28px -4px rgba(145,158,171,0.2), 0 0 2px rgba(145,158,171,0.1)",
          minWidth: "100%", padding: 4,
        }}>
          {options.map((opt) => (
            <button
              key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                display: "block", width: "100%", padding: "10px 14px",
                border: "none", borderRadius: 6,
                background: opt.value === value ? "rgba(145,158,171,0.08)" : "transparent",
                color: "#212B36", fontSize: 13, fontFamily: "var(--font-primary)",
                fontWeight: opt.value === value ? 600 : 400,
                textAlign: "left", cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (opt.value !== value) e.currentTarget.style.background = "rgba(145,158,171,0.08)"; }}
              onMouseLeave={(e) => { if (opt.value !== value) e.currentTarget.style.background = "transparent"; }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Generate new customer ID ──
let nextId = 100;
function genId() { return `CRM-${String(++nextId).padStart(3, "0")}`; }

// ── Add Customer Modal with real logic ──
function AddCustomerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Customer) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", gender: "", source: "MIA BOS", channel: "Online", assignee: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim()) { setError("Họ tên và SĐT là bắt buộc"); return; }
    const newCustomer: Customer = {
      id: genId(), name: form.name, phone: form.phone, email: form.email, status: "Lead",
      source: form.source || "MIA BOS", consentGiven: false, createdAt: new Date().toISOString().slice(0, 10),
      lastContact: new Date().toISOString().slice(0, 10), attributes: [], orders: [], tags: [],
      avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${Date.now()}&backgroundColor=b6e3f4`,
      gender: form.gender || undefined, conversations: [], calls: [], identities: [], timeline: [
        { id: `TL-${Date.now()}`, date: new Date().toISOString().slice(0, 10), type: "system", title: "Tạo hồ sơ CRM", description: "Tạo thủ công từ giao diện", channel: "MIA BOS" },
      ],
      channel: form.channel, platform: form.channel === "Online" ? "Website" : "KiotViet",
      syncSource: "MIA BOS", assignee: form.assignee || undefined, updatedAt: new Date().toISOString().slice(0, 10),
    };
    onAdd(newCustomer);
    setSaved(true);
  }

  if (saved) {
    return (
      <ModalOverlay onClose={onClose}>
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 440, textAlign: "center" }}>
          <CheckCircle size={40} style={{ color: "var(--color-success)", marginBottom: "var(--space-3)" }} />
          <h3 style={{ margin: "0 0 var(--space-2)" }}>Đã tạo khách hàng mới</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: "0 0 var(--space-4)" }}>
            Mã KH: <strong>{form.name}</strong> đã được thêm vào danh sách.
          </p>
          <Button variant="primary" onClick={onClose}>Đóng</Button>
        </div>
      </ModalOverlay>
    );
  }

  const fields = [
    { key: "name", label: "Họ và tên *", placeholder: "Nguyễn Văn A" },
    { key: "phone", label: "Số điện thoại *", placeholder: "0901 234 567" },
    { key: "email", label: "Email", placeholder: "email@example.com" },
    { key: "gender", label: "Giới tính", placeholder: "Nam / Nữ" },
    { key: "source", label: "Nguồn", placeholder: "Haravan, KiotViet..." },
    { key: "channel", label: "Kênh", placeholder: "Online, POS..." },
    { key: "assignee", label: "Phụ trách", placeholder: "Tên nhân viên" },
  ];

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 520, border: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Thêm khách hàng mới</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}><X size={18} /></button>
        </div>
        {error && <div style={{ color: "var(--color-error)", fontSize: 13, marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} /> {error}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
          {fields.map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]} placeholder={f.placeholder}
                onChange={(e) => { setForm((p) => ({ ...p, [f.key]: e.target.value })); setError(""); }}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: 13, background: "var(--color-bg-page)", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
          <Button variant="secondary" onClick={onClose}>Huỷ</Button>
          <Button variant="primary" onClick={handleSubmit}><Plus size={14} /> Tạo khách hàng</Button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ── Column mapping options for import ──
const IMPORT_FIELD_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "— Bỏ qua —" },
  { value: "name", label: "Họ và tên" },
  { value: "phone", label: "Số điện thoại" },
  { value: "email", label: "Email" },
  { value: "gender", label: "Giới tính" },
  { value: "source", label: "Nguồn" },
  { value: "channel", label: "Kênh" },
  { value: "platform", label: "Nền tảng" },
  { value: "assignee", label: "Phụ trách" },
  { value: "region", label: "Khu vực" },
  { value: "status", label: "Trạng thái" },
];

// Auto-guess mapping from header text
function guessMapping(header: string): string {
  const h = header.toLowerCase().trim();
  if (h.includes("tên") || h.includes("name") || h === "họ tên" || h === "ho ten") return "name";
  if (h.includes("điện thoại") || h.includes("sđt") || h.includes("phone") || h.includes("di động") || h === "sdt") return "phone";
  if (h.includes("email") || h.includes("mail")) return "email";
  if (h.includes("giới") || h.includes("gender")) return "gender";
  if (h.includes("nguồn") || h.includes("source")) return "source";
  if (h.includes("kênh") || h.includes("channel")) return "channel";
  if (h.includes("nền tảng") || h.includes("platform")) return "platform";
  if (h.includes("assignee") || h.includes("nhân viên") || h.includes("phụ trách")) return "assignee";
  if (h.includes("khu vực") || h.includes("region") || h.includes("vùng")) return "region";
  if (h.includes("trạng thái") || h.includes("status")) return "status";
  return "";
}

type ImportStep = "upload" | "mapping" | "preview" | "done";

function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (customers: Customer[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>("upload");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<number, string>>({});
  const [importedCount, setImportedCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  function parseFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]!];
      if (!sheet) return;
      const json: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      if (json.length < 2) return;
      const hdrs = json[0]!.map(String);
      const dataRows = json.slice(1).filter((r) => r.some((cell) => String(cell).trim()));
      setHeaders(hdrs);
      setRows(dataRows.map((r) => r.map(String)));
      // Auto-guess mapping
      const autoMap: Record<number, string> = {};
      hdrs.forEach((h, i) => { autoMap[i] = guessMapping(h); });
      setMapping(autoMap);
      setStep("mapping");
    };
    reader.readAsArrayBuffer(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }

  function buildCustomers(): Customer[] {
    // Find which column index maps to which field
    const fieldToCol: Record<string, number> = {};
    for (const [colIdx, field] of Object.entries(mapping)) {
      if (field) fieldToCol[field] = Number(colIdx);
    }
    const get = (row: string[], field: string) => {
      const idx = fieldToCol[field];
      return idx !== undefined ? (row[idx] ?? "").trim() : "";
    };
    const today = new Date().toISOString().slice(0, 10);
    return rows.map((row) => {
      const name = get(row, "name") || "Không tên";
      return {
        id: genId(), name, phone: get(row, "phone"), email: get(row, "email"),
        status: (get(row, "status") as CustomerStatus) || "Lead",
        source: get(row, "source") || "Excel Import", consentGiven: false,
        createdAt: today, lastContact: today, attributes: [], orders: [], tags: ["Import"],
        avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${Date.now() + Math.random()}&backgroundColor=b6e3f4`,
        gender: get(row, "gender") || undefined,
        region: get(row, "region") || undefined,
        conversations: [], calls: [], identities: [],
        timeline: [{ id: `TL-${Date.now()}`, date: today, type: "system" as const, title: "Import từ Excel", description: `Import từ file ${fileName}`, channel: "Excel" }],
        channel: get(row, "channel") || undefined,
        platform: get(row, "platform") || undefined,
        syncSource: "Excel Import",
        assignee: get(row, "assignee") || undefined,
        updatedAt: today,
      };
    });
  }

  function handleConfirmImport() {
    const customers = buildCustomers();
    onImport(customers);
    setImportedCount(customers.length);
    setStep("done");
  }

  const mappedFieldCount = Object.values(mapping).filter(Boolean).length;
  const previewCustomers = step === "preview" ? buildCustomers().slice(0, 5) : [];

  // ── Step: Upload ──
  if (step === "upload") {
    return (
      <ModalOverlay onClose={onClose}>
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 500, border: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Nhập dữ liệu khách hàng</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}><X size={18} /></button>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-border)"}`,
              borderRadius: "var(--radius-sm)", padding: "var(--space-8)", textAlign: "center",
              marginBottom: "var(--space-4)", background: dragOver ? "var(--color-primary-light)" : "var(--color-bg-page)",
              transition: "all 0.2s", cursor: "pointer",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} style={{ color: dragOver ? "var(--color-primary)" : "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }} />
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Kéo thả file vào đây hoặc click để chọn</div>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Hỗ trợ: .xlsx, .xls, .csv</div>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} style={{ display: "none" }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
            Hệ thống sẽ đọc header từ file để bạn map với các trường khách hàng.
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Button variant="secondary" onClick={onClose}>Huỷ</Button>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step: Mapping ──
  if (step === "mapping") {
    return (
      <ModalOverlay onClose={onClose}>
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 600, border: "1px solid var(--color-border)", maxHeight: "85vh", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Ánh xạ cột dữ liệu</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}><X size={18} /></button>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            File: <strong>{fileName}</strong> — {rows.length} dòng dữ liệu
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: "var(--space-4)" }}>
            Hệ thống đã tự động nhận diện {mappedFieldCount}/{headers.length} cột. Bạn có thể điều chỉnh.
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-4)" }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface)" }}>Cột trong file</th>
                <th style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface)" }}>Map sang trường</th>
                <th style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface)" }}>Dữ liệu mẫu</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((h, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--color-border)" }}>{h}</td>
                  <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-border)" }}>
                    <select
                      value={mapping[i] ?? ""}
                      onChange={(e) => setMapping((p) => ({ ...p, [i]: e.target.value }))}
                      style={{
                        padding: "5px 8px", borderRadius: "var(--radius-xs)",
                        border: `1px solid ${mapping[i] ? "var(--color-primary)" : "var(--color-border)"}`,
                        fontSize: 12, background: mapping[i] ? "var(--color-primary-light)" : "var(--color-bg-page)",
                        color: mapping[i] ? "var(--color-primary)" : "var(--color-text-secondary)",
                        fontWeight: mapping[i] ? 600 : 400, width: "100%", boxSizing: "border-box",
                      }}
                    >
                      {IMPORT_FIELD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--color-text-tertiary)", borderBottom: "1px solid var(--color-border)" }}>
                    {rows[0]?.[i] ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!Object.values(mapping).includes("name") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "var(--space-2) var(--space-3)", background: "#FEF3C7", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-3)", fontSize: 12, color: "#B45309" }}>
              <AlertTriangle size={13} /> Cần map ít nhất cột "Họ và tên"
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button variant="secondary" style={{ fontSize: 12 }} onClick={() => setStep("upload")}>Chọn file khác</Button>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button variant="secondary" onClick={onClose}>Huỷ</Button>
              <Button variant="primary" onClick={() => setStep("preview")} style={{ opacity: Object.values(mapping).includes("name") ? 1 : 0.5 }}>
                Xem trước ({rows.length} dòng)
              </Button>
            </div>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step: Preview ──
  if (step === "preview") {
    return (
      <ModalOverlay onClose={onClose}>
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 700, border: "1px solid var(--color-border)", maxHeight: "85vh", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Xem trước dữ liệu import</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}><X size={18} /></button>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
            Hiển thị {Math.min(5, rows.length)}/{rows.length} dòng đầu tiên. Kiểm tra dữ liệu trước khi import.
          </div>

          <div style={{ overflowX: "auto", marginBottom: "var(--space-4)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 10px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left" }}>Mã KH</th>
                  <th style={{ padding: "8px 10px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left" }}>Tên</th>
                  <th style={{ padding: "8px 10px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left" }}>SĐT</th>
                  <th style={{ padding: "8px 10px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "8px 10px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left" }}>Nguồn</th>
                  <th style={{ padding: "8px 10px", background: "var(--color-bg-surface)", borderBottom: "1px solid var(--color-border)", fontWeight: 600, color: "var(--color-text-tertiary)", textAlign: "left" }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {previewCustomers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--color-border)", fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>{c.id}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--color-border)", fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--color-border)" }}>{c.phone || "—"}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>{c.email || "—"}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--color-border)" }}>{c.source}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--color-border)" }}><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 5 && (
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)", textAlign: "center" }}>
              ... và {rows.length - 5} dòng khác
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="secondary" style={{ fontSize: 12 }} onClick={() => setStep("mapping")}>Quay lại ánh xạ</Button>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button variant="secondary" onClick={onClose}>Huỷ</Button>
              <Button variant="primary" onClick={handleConfirmImport}>
                <CheckCircle size={14} /> Nhập {rows.length} khách hàng
              </Button>
            </div>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  // ── Step: Done ──
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 440, textAlign: "center" }}>
        <CheckCircle size={40} style={{ color: "var(--color-success)", marginBottom: "var(--space-3)" }} />
        <h3 style={{ margin: "0 0 var(--space-2)" }}>Nhập dữ liệu thành công</h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: "0 0 var(--space-4)" }}>
          Đã thêm <strong>{importedCount}</strong> khách hàng vào hệ thống từ file <strong>{fileName}</strong>.
        </p>
        <Button variant="primary" onClick={onClose}>Đóng</Button>
      </div>
    </ModalOverlay>
  );
}

// ── Duplicate Finder Modal with real merge logic ──
const MERGE_FIELDS: { key: string; label: string; getValue: (c: Customer) => string }[] = [
  { key: "name", label: "Họ và tên", getValue: (c) => c.name },
  { key: "phone", label: "Di động", getValue: (c) => c.phone },
  { key: "email", label: "Email", getValue: (c) => c.email || "" },
  { key: "gender", label: "Giới tính", getValue: (c) => c.gender ?? "" },
  { key: "source", label: "Nguồn", getValue: (c) => c.source },
  { key: "status", label: "Trạng thái", getValue: (c) => c.status },
  { key: "region", label: "Khu vực", getValue: (c) => c.region ?? "" },
  { key: "channel", label: "Kênh", getValue: (c) => c.channel ?? "" },
  { key: "assignee", label: "Phụ trách", getValue: (c) => c.assignee ?? "" },
];

type DupStep = "select-cols" | "review-list" | "merge-fields" | "done";

function DuplicateFinderModal({ onClose, customers, onMerge }: {
  onClose: () => void;
  customers: Customer[];
  onMerge: (primaryId: string, removedIds: string[], fieldChoices: Record<string, string>) => void;
}) {
  const [step, setStep] = useState<DupStep>("select-cols");
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [dupRows, setDupRows] = useState<{ groupId: number; customer: Customer }[]>([]);
  const [mergeSelection, setMergeSelection] = useState<Set<string>>(new Set());
  const [mergeGroup, setMergeGroup] = useState<Customer[]>([]);
  const [fieldChoices, setFieldChoices] = useState<Record<string, string>>({});
  const [mergedPrimaryId, setMergedPrimaryId] = useState<string>("");

  const colOptions = [
    { key: "phone", label: "Số điện thoại", getValue: (c: Customer) => c.phone },
    { key: "email", label: "Email", getValue: (c: Customer) => c.email },
    { key: "name", label: "Tên khách hàng", getValue: (c: Customer) => c.name },
  ];

  // Track which columns were selected for display in review table
  const [searchedCols, setSearchedCols] = useState<string[]>([]);

  function toggleCol(key: string) {
    setSelectedCols((prev) => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  }

  // Get value for a customer by column key
  function getColValue(c: Customer, colKey: string): string {
    if (colKey === "phone") return c.phone ?? "";
    if (colKey === "email") return c.email ?? "";
    if (colKey === "name") return c.name ?? "";
    return "";
  }

  function handleFind() {
    if (selectedCols.size === 0) return;
    const cols = Array.from(selectedCols);
    setSearchedCols(cols);

    // Group by composite key of ALL selected columns
    const groups: Record<string, Customer[]> = {};
    for (const c of customers) {
      const keyParts = cols.map((col) => getColValue(c, col).toLowerCase().trim());
      // Skip if any selected column is empty and skipEmpty is on
      if (skipEmpty && keyParts.some((p) => !p)) continue;
      const compositeKey = keyParts.join("|||");
      if (!groups[compositeKey]) groups[compositeKey] = [];
      groups[compositeKey]!.push(c);
    }

    // Only keep groups with 2+ records (actual duplicates)
    const realGroups = Object.values(groups).filter((g) => g.length > 1);

    const rows: { groupId: number; customer: Customer }[] = [];
    let gid = 1;
    for (const group of realGroups) {
      for (const c of group) rows.push({ groupId: gid, customer: c });
      gid++;
    }
    setDupRows(rows);
    setMergeSelection(new Set());
    setStep("review-list");
  }

  function handleMergeGroup(groupId: number) {
    const group = dupRows.filter((r) => r.groupId === groupId).map((r) => r.customer);
    setMergeGroup(group);
    const defaults: Record<string, string> = {};
    for (const f of MERGE_FIELDS) defaults[f.key] = group[0]?.id ?? "";
    setFieldChoices(defaults);
    setStep("merge-fields");
  }

  function handleConfirmMerge() {
    // Determine primary: the record that has the most field selections
    const counts: Record<string, number> = {};
    for (const id of Object.values(fieldChoices)) { counts[id] = (counts[id] ?? 0) + 1; }
    const primaryId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? mergeGroup[0]?.id ?? "";
    const removedIds = mergeGroup.filter((c) => c.id !== primaryId).map((c) => c.id);
    onMerge(primaryId, removedIds, fieldChoices);
    setMergedPrimaryId(primaryId);
    setStep("done");
  }

  const groupIds = [...new Set(dupRows.map((r) => r.groupId))];
  const cellStyle: React.CSSProperties = { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid var(--color-border)" };
  const headStyle: React.CSSProperties = { ...cellStyle, fontWeight: 600, fontSize: 12, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.03em", background: "var(--color-bg-surface)" };

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", maxHeight: "85vh", overflow: "auto", width: step === "merge-fields" ? 780 : step === "review-list" ? 720 : 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-5) var(--space-6) var(--space-4)" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>
            {step === "select-cols" && "Tìm trùng lặp"}
            {step === "review-list" && "Danh sách Khách hàng bị trùng"}
            {step === "merge-fields" && "Gộp bản ghi trong > Khách hàng"}
            {step === "done" && "Hoàn tất"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}><X size={18} /></button>
        </div>

        {step === "select-cols" && (
          <div style={{ padding: "0 var(--space-6) var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 130, paddingTop: 8 }}>Các cột thỏa mãn điều kiện</label>
              <div style={{ flex: 1, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "var(--space-2)", minHeight: 80, display: "flex", flexWrap: "wrap", gap: "var(--space-2)", alignContent: "flex-start" }}>
                {colOptions.map((col) => {
                  const sel = selectedCols.has(col.key);
                  return (
                    <button key={col.key} onClick={() => toggleCol(col.key)} style={{ padding: "4px 12px", borderRadius: "var(--radius-pill)", fontSize: 12, fontWeight: 500, border: sel ? "1px solid var(--color-primary)" : "1px solid var(--color-border)", background: sel ? "var(--color-primary-light)" : "var(--color-bg-card)", color: sel ? "var(--color-primary)" : "var(--color-text-secondary)", cursor: "pointer" }}>
                      {sel && "✓ "}{col.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-5)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: 13, cursor: "pointer", color: "var(--color-text-secondary)" }}>
                <input type="checkbox" checked={skipEmpty} onChange={() => setSkipEmpty(!skipEmpty)} style={{ width: 16, height: 16 }} />
                Bỏ qua giá trị rỗng
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)" }}>
              <Button variant="primary" onClick={handleFind} style={{ opacity: selectedCols.size > 0 ? 1 : 0.5 }}>Tìm trùng</Button>
              <Button variant="secondary" onClick={onClose} style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}>Huỷ bỏ</Button>
            </div>
          </div>
        )}

        {step === "review-list" && (
          <div style={{ padding: "0 0 var(--space-4)" }}>
            <div style={{ padding: "0 var(--space-6) var(--space-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button variant="secondary" style={{ fontSize: 12 }} onClick={() => setStep("select-cols")}>Quay lại</Button>
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                {dupRows.length > 0 ? `${dupRows.length} bản ghi · ${groupIds.length} nhóm trùng` : "Không tìm thấy trùng lặp"}
              </span>
            </div>
            {dupRows.length === 0 && (
              <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-6) var(--space-4)" }}>
                <CheckCircle size={36} style={{ color: "var(--color-success)", marginBottom: "var(--space-3)" }} />
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Không tìm thấy bản ghi trùng</div>
                <div style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
                  Dữ liệu khách hàng không có trùng lặp theo {searchedCols.map((k) => colOptions.find((o) => o.key === k)?.label).filter(Boolean).join(", ")}.
                </div>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>
                  <th style={{ ...headStyle, width: 40 }}><input type="checkbox" checked={mergeSelection.size === dupRows.length && dupRows.length > 0} onChange={() => { if (mergeSelection.size === dupRows.length) setMergeSelection(new Set()); else setMergeSelection(new Set(dupRows.map((r) => r.customer.id))); }} /></th>
                  <th style={headStyle}>Mã KH</th>
                  <th style={headStyle}>Tên</th>
                  {/* Dynamic columns based on what was searched */}
                  {searchedCols.map((colKey) => {
                    const opt = colOptions.find((o) => o.key === colKey);
                    return <th key={colKey} style={{ ...headStyle, color: "var(--color-primary)", fontWeight: 700 }}>{opt?.label ?? colKey}</th>;
                  })}
                  <th style={{ ...headStyle, textAlign: "center" }}>Chọn để gộp</th>
                  <th style={{ ...headStyle, textAlign: "center" }}>Thao tác</th>
                </tr></thead>
                <tbody>
                  {groupIds.map((gid) => {
                    const gRows = dupRows.filter((r) => r.groupId === gid);
                    return gRows.map((row, ri) => (
                      <tr key={row.customer.id} style={{ background: ri % 2 === 0 ? "var(--color-bg-card)" : "var(--color-bg-page)" }}>
                        <td style={cellStyle}><input type="checkbox" checked={mergeSelection.has(row.customer.id)} onChange={() => setMergeSelection((p) => { const n = new Set(p); if (n.has(row.customer.id)) n.delete(row.customer.id); else n.add(row.customer.id); return n; })} /></td>
                        <td style={{ ...cellStyle, fontFamily: "var(--font-mono)", fontWeight: 500 }}>{row.customer.id}</td>
                        <td style={cellStyle}>{row.customer.name}</td>
                        {/* Dynamic column values — highlighted because these are the matched fields */}
                        {searchedCols.map((colKey) => (
                          <td key={colKey} style={{ ...cellStyle, fontWeight: 500, color: "var(--color-primary)" }}>
                            {getColValue(row.customer, colKey) || "—"}
                          </td>
                        ))}
                        <td style={{ ...cellStyle, textAlign: "center" }}><input type="checkbox" checked={mergeSelection.has(row.customer.id)} onChange={() => setMergeSelection((p) => { const n = new Set(p); if (n.has(row.customer.id)) n.delete(row.customer.id); else n.add(row.customer.id); return n; })} /></td>
                        <td style={{ ...cellStyle, textAlign: "center" }}>{ri === gRows.length - 1 && <Button variant="primary" style={{ fontSize: 12, padding: "5px 16px" }} onClick={() => handleMergeGroup(gid)}>Gộp</Button>}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === "merge-fields" && mergeGroup.length > 0 && (
          <div style={{ padding: "0 0 var(--space-4)" }}>
            <div style={{ margin: "0 var(--space-6) var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--color-text-secondary)" }}>
              Dữ liệu bản ghi chính sẽ được giữ lại. Dữ liệu của các bản ghi khác sẽ bị xóa nhưng dữ liệu liên quan sẽ được giao cho bản ghi chính.
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>
                  <th style={{ ...headStyle, width: 140 }}>Cột</th>
                  {mergeGroup.map((c) => (
                    <th key={c.id} style={headStyle}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 600 }}>
                        <input type="radio" name="primary-record" checked={Object.values(fieldChoices).every((v) => v === c.id)} onChange={() => { const a: Record<string, string> = {}; for (const f of MERGE_FIELDS) a[f.key] = c.id; setFieldChoices(a); }} style={{ accentColor: "var(--color-primary)" }} />
                        <span style={{ color: "var(--color-primary)" }}>Bản ghi #{c.id}</span>
                      </label>
                    </th>
                  ))}
                </tr></thead>
                <tbody>
                  {MERGE_FIELDS.map((field) => (
                    <tr key={field.key}>
                      <td style={{ ...cellStyle, fontWeight: 500, color: "var(--color-text-secondary)" }}>{field.label}</td>
                      {mergeGroup.map((c) => {
                        const val = field.getValue(c);
                        return (
                          <td key={c.id} style={cellStyle}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                              <input type="radio" name={`field-${field.key}`} checked={fieldChoices[field.key] === c.id} onChange={() => setFieldChoices((p) => ({ ...p, [field.key]: c.id }))} style={{ accentColor: "var(--color-primary)" }} />
                              <span style={{ fontSize: 13, color: val ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}>{val || "—"}</span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", padding: "var(--space-4) var(--space-6) 0" }}>
              <Button variant="primary" onClick={handleConfirmMerge}>Gộp dữ liệu</Button>
              <Button variant="secondary" onClick={() => setStep("review-list")} style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }}>Huỷ bỏ</Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "var(--space-4) var(--space-6) var(--space-6)" }}>
            <CheckCircle size={40} style={{ color: "var(--color-success)", marginBottom: "var(--space-3)" }} />
            <h3 style={{ margin: "0 0 var(--space-2)" }}>Gộp thành công</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: "0 0 var(--space-4)" }}>
              Bản ghi chính <strong>{mergedPrimaryId}</strong> đã được giữ lại. Các bản ghi trùng đã bị xoá và dữ liệu liên quan đã chuyển giao.
            </p>
            <Button variant="primary" onClick={onClose}>Đóng</Button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// ── Advanced filter panel with real filtering ──
interface AdvancedFilters { channel: string; platform: string; syncSource: string; assignee: string; minOrders: string; consent: string; }
const emptyFilters: AdvancedFilters = { channel: "", platform: "", syncSource: "", assignee: "", minOrders: "", consent: "" };

function AdvancedFilterPanel({ filters, onChange, onClose }: { filters: AdvancedFilters; onChange: (f: AdvancedFilters) => void; onClose: () => void }) {
  const [local, setLocal] = useState(filters);
  const set = (key: keyof AdvancedFilters, val: string) => setLocal((p) => ({ ...p, [key]: val }));

  const filterFields: { key: keyof AdvancedFilters; label: string; placeholder: string }[] = [
    { key: "channel", label: "Kênh", placeholder: "Online, POS, Social..." },
    { key: "platform", label: "Nền tảng", placeholder: "Zalo, Facebook, Website..." },
    { key: "syncSource", label: "Nguồn đồng bộ", placeholder: "Haravan, KiotViet, SAP..." },
    { key: "assignee", label: "Phụ trách", placeholder: "Tên nhân viên..." },
    { key: "minOrders", label: "Số đơn hàng >=", placeholder: "0" },
    { key: "consent", label: "Consent", placeholder: "yes / no / all" },
  ];

  return (
    <Card style={{ marginBottom: "var(--space-4)", border: "1px solid var(--color-primary)", borderRadius: "var(--radius-sm)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
        <h3 style={{ margin: 0, fontSize: 14 }}>Bộ lọc nâng cao</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}><X size={16} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
        {filterFields.map((f) => (
          <div key={f.key}>
            <label style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", display: "block", marginBottom: 3 }}>{f.label}</label>
            <input value={local[f.key]} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)}
              style={{ width: "100%", padding: "7px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-bg-page)", boxSizing: "border-box" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
        <Button variant="secondary" style={{ fontSize: 12 }} onClick={() => { onChange(emptyFilters); setLocal(emptyFilters); }}>Xoá bộ lọc</Button>
        <Button variant="primary" style={{ fontSize: 12 }} onClick={() => onChange(local)}>Áp dụng</Button>
      </div>
    </Card>
  );
}

// ── Table columns ──
const columns: Column<Customer>[] = [
  { key: "id", header: "Mã KH", render: (c) => <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-tertiary)" }}>{c.id}</span>, width: "7%" },
  { key: "name", header: "Khách hàng", render: (c) => (<div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}><Avatar name={c.name} size={28} src={c.avatarUrl} /><span style={{ fontWeight: 500, fontSize: "13px" }}>{c.name}</span></div>), width: "14%" },
  { key: "phone", header: "SĐT", render: (c) => <span style={{ fontSize: "13px" }}>{c.phone}</span>, width: "9%" },
  { key: "email", header: "Email", width: "12%", render: (c) => <span style={{ fontSize: "12px", color: c.email ? "var(--color-text-secondary)" : "var(--color-text-tertiary)" }}>{c.email || "—"}</span> },
  { key: "channel", header: "Kênh", render: (c) => <span style={{ fontSize: "12px" }}>{c.channel ?? "—"}</span>, width: "6%" },
  { key: "platform", header: "Nền tảng", render: (c) => <span style={{ fontSize: "12px" }}>{c.platform ?? "—"}</span>, width: "7%" },
  { key: "syncSource", header: "Nguồn", width: "7%", render: (c) => <span style={{ fontSize: "11px", fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: "var(--color-bg-surface)", color: "var(--color-text-secondary)" }}>{c.syncSource ?? c.source}</span> },
  { key: "status", header: "Trạng thái", render: (c) => <StatusBadge status={c.status} />, width: "7%" },
  { key: "lastContact", header: "Liên hệ gần nhất", render: (c) => <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{c.lastContact}</span>, width: "8%" },
  { key: "orders", header: "Đơn hàng", render: (c) => <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>{c.orders.length}</span>, width: "5%" },
  { key: "assignee", header: "Phụ trách", render: (c) => <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{c.assignee ?? "—"}</span>, width: "9%" },
  { key: "updatedAt", header: "Cập nhật", render: (c) => <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{c.updatedAt ?? "—"}</span>, width: "7%" },
];

// ── Main page ──
export function CustomerListPage() {
  const navigate = useNavigate();

  // Mutable customer state — seeded from API on mount, falls back to mock if BE down.
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    customerApi
      .list({ pageSize: 200 })
      .then((res) => {
        if (cancelled) return;
        setCustomers(res.items.map(apiToCustomer));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getApiErrorMessage(err, "Không tải được danh sách khách hàng"));
        // Fallback: render mock so the page is at least usable for design review.
        setCustomers([...CUSTOMERS]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "All">("All");
  const [advFilters, setAdvFilters] = useState<AdvancedFilters>(emptyFilters);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState<"update" | "delete" | null>(null);
  const [bulkUpdateField, setBulkUpdateField] = useState("assignee");
  const [bulkUpdateValue, setBulkUpdateValue] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  // Filter logic
  const filtered = customers.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    // Advanced filters
    const af = advFilters;
    const matchChannel = !af.channel || (c.channel ?? "").toLowerCase().includes(af.channel.toLowerCase());
    const matchPlatform = !af.platform || (c.platform ?? "").toLowerCase().includes(af.platform.toLowerCase());
    const matchSync = !af.syncSource || (c.syncSource ?? c.source).toLowerCase().includes(af.syncSource.toLowerCase());
    const matchAssignee = !af.assignee || (c.assignee ?? "").toLowerCase().includes(af.assignee.toLowerCase());
    const matchOrders = !af.minOrders || c.orders.length >= Number(af.minOrders);
    const matchConsent = !af.consent || af.consent === "all" || (af.consent === "yes" ? c.consentGiven : !c.consentGiven);
    return matchSearch && matchStatus && matchChannel && matchPlatform && matchSync && matchAssignee && matchOrders && matchConsent;
  });

  // Actions
  const handleAddCustomer = useCallback((c: Customer) => { setCustomers((prev) => [c, ...prev]); }, []);
  const handleImport = useCallback((batch: Customer[]) => { setCustomers((prev) => [...batch, ...prev]); }, []);

  const handleBulkDelete = useCallback(() => {
    setCustomers((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    const count = selectedIds.size;
    setSelectedIds(new Set());
    setShowBulkConfirm(null);
    showToast(`Đã xoá ${count} khách hàng`);
  }, [selectedIds]);

  const handleBulkUpdate = useCallback(() => {
    if (!bulkUpdateValue.trim()) return;
    setCustomers((prev) => prev.map((c) => {
      if (!selectedIds.has(c.id)) return c;
      if (bulkUpdateField === "assignee") return { ...c, assignee: bulkUpdateValue, updatedAt: new Date().toISOString().slice(0, 10) };
      if (bulkUpdateField === "status") return { ...c, status: bulkUpdateValue as CustomerStatus, updatedAt: new Date().toISOString().slice(0, 10) };
      if (bulkUpdateField === "channel") return { ...c, channel: bulkUpdateValue, updatedAt: new Date().toISOString().slice(0, 10) };
      return c;
    }));
    const count = selectedIds.size;
    setSelectedIds(new Set());
    setShowBulkConfirm(null);
    setBulkUpdateValue("");
    showToast(`Đã cập nhật ${count} khách hàng`);
  }, [selectedIds, bulkUpdateField, bulkUpdateValue]);

  const handleMerge = useCallback((primaryId: string, removedIds: string[], fieldChoices: Record<string, string>) => {
    setCustomers((prev) => {
      const primary = prev.find((c) => c.id === primaryId);
      const removed = prev.filter((c) => removedIds.includes(c.id));
      if (!primary) return prev;
      // Build merged record: pick values from field choices, transfer related data
      const merged = { ...primary };
      for (const [fieldKey, sourceId] of Object.entries(fieldChoices)) {
        const src = prev.find((c) => c.id === sourceId);
        if (!src) continue;
        const mf = MERGE_FIELDS.find((f) => f.key === fieldKey);
        if (!mf) continue;
        const val = mf.getValue(src);
        if (fieldKey === "name") merged.name = val;
        else if (fieldKey === "phone") merged.phone = val;
        else if (fieldKey === "email") merged.email = val;
        else if (fieldKey === "gender") merged.gender = val || undefined;
        else if (fieldKey === "source") merged.source = val;
        else if (fieldKey === "status") merged.status = val as CustomerStatus;
        else if (fieldKey === "region") merged.region = val || undefined;
        else if (fieldKey === "channel") merged.channel = val || undefined;
        else if (fieldKey === "assignee") merged.assignee = val || undefined;
      }
      // Transfer orders, conversations, calls, timeline from removed records
      for (const r of removed) {
        merged.orders = [...merged.orders, ...r.orders];
        merged.conversations = [...merged.conversations, ...r.conversations];
        merged.calls = [...merged.calls, ...r.calls];
        merged.timeline = [...merged.timeline, ...r.timeline];
        merged.identities = [...merged.identities, ...r.identities];
      }
      merged.orderCount = merged.orders.length;
      merged.totalSpent = merged.orders.reduce((s, o) => s + o.total, 0);
      merged.updatedAt = new Date().toISOString().slice(0, 10);
      // Remove duplicates and replace primary
      return prev.filter((c) => !removedIds.includes(c.id)).map((c) => c.id === primaryId ? merged : c);
    });
  }, []);

  const toggleSelect = (id: string) => { setSelectedIds((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const toggleSelectAll = () => { if (selectedIds.size === filtered.length) setSelectedIds(new Set()); else setSelectedIds(new Set(filtered.map((c) => c.id))); };

  const columnsWithCheckbox: Column<Customer>[] = [
    { key: "_select", header: (<input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} style={{ cursor: "pointer" }} />) as unknown as string, render: (c) => (<input type="checkbox" checked={selectedIds.has(c.id)} onChange={(e) => { e.stopPropagation(); toggleSelect(c.id); }} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer" }} />), width: "3%" },
    ...columns,
  ];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, padding: "12px 20px", background: "#15803D", color: "#fff", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      <div style={{ marginBottom: "var(--space-2)" }}>
        <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>CRM Workspace</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
        <h1 style={{ margin: 0 }}>Khách hàng <span style={{ fontSize: 14, fontWeight: 400, color: "var(--color-text-tertiary)" }}>({customers.length})</span></h1>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="primary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }} onClick={() => setShowAddModal(true)}><Plus size={14} /> Thêm KH mới</Button>
          <Button variant="secondary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }} onClick={() => setShowImportModal(true)}><Upload size={14} /> Nhập dữ liệu</Button>
          <Button variant="secondary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }} onClick={() => setShowBulkConfirm("update")}><RefreshCw size={14} /> Cập nhật hàng loạt</Button>
          <Button variant="secondary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }} onClick={() => setShowDuplicateModal(true)}><GitMerge size={14} /> Tìm trùng</Button>
          <Button variant="secondary" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-error)" }} onClick={() => setShowBulkConfirm("delete")}><Trash2 size={14} /> Xoá hàng loạt</Button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-4)", background: "var(--color-primary-light)", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-3)", fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{selectedIds.size} khách hàng được chọn</span>
          <button onClick={() => setSelectedIds(new Set())} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", fontSize: 12, fontWeight: 500 }}>Bỏ chọn tất cả</button>
        </div>
      )}

      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-4)", alignItems: "center" }}>
        <Input icon={<Search size={16} />} placeholder="Tìm theo tên, SĐT, mã KH..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 320 }} />
        <Button variant={showAdvancedFilter ? "primary" : "secondary"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }} onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
          <Filter size={14} /> Bộ lọc nâng cao
        </Button>
        <FilterSelect
          title="Trạng thái"
          value={statusFilter}
          options={STATUS_FILTERS.map((s) => ({ value: s, label: s === "All" ? "Tất cả" : s === "Lead" ? "Tiềm năng" : s === "Qualified" ? "Đủ điều kiện" : s === "Customer" ? "Khách hàng" : s === "Inactive" ? "Không hoạt động" : s === "Blocked" ? "Đã chặn" : s }))}
          onChange={setStatusFilter}
        />
      </div>

      {showAdvancedFilter && <AdvancedFilterPanel filters={advFilters} onChange={(f) => setAdvFilters(f)} onClose={() => setShowAdvancedFilter(false)} />}

      {error && (
        <div role="alert" style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", borderRadius: 8, fontSize: 13 }}>
          {error} (đang hiển thị dữ liệu mock — kiểm tra lại kết nối BE)
        </div>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-secondary)" }}>Đang tải…</div>
        ) : (
          <DataTable columns={columnsWithCheckbox} data={filtered} rowKey={(c) => c.id} onRowClick={(c) => navigate(`/crm/customers/${c.id}`)} />
        )}
      </Card>

      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} onAdd={handleAddCustomer} />}
      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} onImport={handleImport} />}
      {showDuplicateModal && <DuplicateFinderModal onClose={() => setShowDuplicateModal(false)} customers={customers} onMerge={handleMerge} />}

      {showBulkConfirm && (
        <ModalOverlay onClose={() => setShowBulkConfirm(null)}>
          <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: 460, border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              {showBulkConfirm === "delete" ? <Trash2 size={20} style={{ color: "var(--color-error)" }} /> : <RefreshCw size={20} style={{ color: "var(--color-primary)" }} />}
              <h3 style={{ margin: 0, fontSize: 16 }}>{showBulkConfirm === "delete" ? "Xoá hàng loạt" : "Cập nhật hàng loạt"}</h3>
            </div>
            {selectedIds.size === 0 ? (
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 var(--space-4)" }}>Vui lòng chọn ít nhất 1 khách hàng từ danh sách (checkbox) trước khi thực hiện.</p>
            ) : showBulkConfirm === "delete" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--space-3) var(--space-4)", background: "#FEF2F2", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-4)" }}>
                  <AlertTriangle size={16} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#991B1B" }}>Bạn có chắc muốn xoá <strong>{selectedIds.size}</strong> khách hàng? Thao tác này không thể hoàn tác.</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }}>
                  Các KH sẽ bị xoá: {Array.from(selectedIds).join(", ")}
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 var(--space-4)" }}>Cập nhật <strong>{selectedIds.size}</strong> khách hàng đã chọn:</p>
                <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "block", marginBottom: 3 }}>Trường cần cập nhật</label>
                    <select value={bulkUpdateField} onChange={(e) => setBulkUpdateField(e.target.value)} style={{ padding: "7px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-bg-page)" }}>
                      <option value="assignee">Phụ trách</option>
                      <option value="status">Trạng thái</option>
                      <option value="channel">Kênh</option>

                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "block", marginBottom: 3 }}>Giá trị mới</label>
                    <input value={bulkUpdateValue} onChange={(e) => setBulkUpdateValue(e.target.value)} placeholder={bulkUpdateField === "status" ? "Tiềm năng, Khách hàng, Không hoạt động..." : "Nhập giá trị..."} style={{ width: "100%", padding: "7px 10px", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-bg-page)", boxSizing: "border-box" }} />
                  </div>
                </div>
              </>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
              <Button variant="secondary" onClick={() => setShowBulkConfirm(null)}>Huỷ</Button>
              {selectedIds.size > 0 && (
                showBulkConfirm === "delete"
                  ? <Button variant="secondary" style={{ color: "var(--color-error)", borderColor: "var(--color-error)" }} onClick={handleBulkDelete}>Xoá {selectedIds.size} KH</Button>
                  : <Button variant="primary" onClick={handleBulkUpdate}>Cập nhật {selectedIds.size} KH</Button>
              )}
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}
