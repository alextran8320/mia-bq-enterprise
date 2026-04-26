import { useState } from "react";
import { KeyRound, Upload, UserCircle } from "lucide-react";
import { Button } from "@/shared/ui";
import { useAuthStore } from "@/shared/auth/authStore";

const TABS = [
  { key: "general", label: "Thông tin chung", icon: UserCircle },
  { key: "security", label: "Bảo mật", icon: KeyRound },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function FloatInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const labelUp = focused || hasValue;
  return (
    <div style={{ position: "relative", border: "1px solid", borderColor: focused ? "#212B36" : "#E0E3E7", borderRadius: 8, padding: "16px 14px 8px", background: "#fff", transition: "border-color 0.15s" }}>
      <label style={{ position: "absolute", top: labelUp ? 6 : "50%", transform: labelUp ? "none" : "translateY(-50%)", left: 14, fontSize: labelUp ? 11 : 14, color: labelUp ? "#637381" : "#919EAB", pointerEvents: "none", transition: "all 0.15s", fontFamily: "var(--font-primary)", lineHeight: 1 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={focused ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-primary)", color: "#212B36", background: "transparent", paddingTop: 4 }}
      />
    </div>
  );
}

function FloatSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const hasValue = value.length > 0;
  return (
    <div style={{ position: "relative", border: "1px solid #E0E3E7", borderRadius: 8, padding: "16px 14px 8px", background: "#fff" }}>
      <label style={{ position: "absolute", top: hasValue ? 6 : "50%", transform: hasValue ? "none" : "translateY(-50%)", left: 14, fontSize: hasValue ? 11 : 14, color: hasValue ? "#637381" : "#919EAB", pointerEvents: "none", transition: "all 0.15s", fontFamily: "var(--font-primary)", lineHeight: 1 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-primary)", color: "#212B36", background: "transparent", paddingTop: 4, appearance: "none", cursor: "pointer" }}
      >
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#637381" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}

function FloatTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const labelUp = focused || hasValue;
  return (
    <div style={{ position: "relative", border: "1px solid", borderColor: focused ? "#212B36" : "#E0E3E7", borderRadius: 8, padding: "16px 14px 8px", background: "#fff", transition: "border-color 0.15s" }}>
      <label style={{ position: "absolute", top: 6, left: 14, fontSize: labelUp ? 11 : 13, color: labelUp ? "#637381" : "#919EAB", pointerEvents: "none", transition: "font-size 0.15s, color 0.15s", fontFamily: "var(--font-primary)" }}>
        {label}
      </label>
      <textarea
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{ width: "100%", border: "none", outline: "none", fontSize: 14, fontFamily: "var(--font-primary)", color: "#212B36", background: "transparent", paddingTop: 8, resize: "vertical" }}
      />
    </div>
  );
}

function TabGeneral() {
  const me = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    name: me?.fullName ?? "",
    email: me?.email ?? "",
    phone: "",
    address: "",
    country: "",
    province: "",
    postal: "",
    bio: "",
  });
  function set(k: keyof typeof form) { return (v: string) => setForm((f) => ({ ...f, [k]: v })); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, alignItems: "start" }}>
      {/* Avatar upload */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 32, border: "1px dashed #E0E3E7", borderRadius: 12, background: "#FAFAFA" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #E8F0FE, #C7D9FB)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", border: "2px dashed #C7D9FB" }}>
          {/* MIA logo placeholder */}
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="12" fill="#2F64F6" opacity="0.15"/>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="#2F64F6" fontSize="22" fontWeight="700" fontFamily="sans-serif">MIA</text>
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <Button variant="secondary" style={{ gap: 6, fontSize: 13 }}>
            <Upload size={14} /> Tải ảnh lên
          </Button>
          <div style={{ fontSize: 12, color: "#919EAB", marginTop: 8, lineHeight: 1.5 }}>
            Cho phép *.jpeg, *.jpg, *.png, *.gif<br />Dung lượng tối đa 3 Mb
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FloatInput label="Tên" value={form.name} onChange={set("name")} />
          <FloatInput label="Địa chỉ Email" value={form.email} onChange={set("email")} type="email" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FloatInput label="Số điện thoại" value={form.phone} onChange={set("phone")} />
          <FloatInput label="Địa chỉ" value={form.address} onChange={set("address")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FloatSelect label="Quốc gia" value={form.country} onChange={set("country")} options={["Việt Nam", "Singapore", "Thái Lan"]} />
          <FloatSelect label="Tỉnh/Thành phố" value={form.province} onChange={set("province")} options={["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"]} />
        </div>
        <FloatInput label="Mã bưu điện" value={form.postal} onChange={set("postal")} />
        <FloatTextarea label="Giới thiệu" value={form.bio} onChange={set("bio")} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <Button variant="primary">Lưu thay đổi</Button>
        </div>
      </div>
    </div>
  );
}

function TabSecurity() {
  const [form, setForm] = useState({ currentPw: "", newPw: "", confirmPw: "" });
  function set(k: keyof typeof form) { return (v: string) => setForm((f) => ({ ...f, [k]: v })); }
  return (
    <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Đổi mật khẩu</h3>
      <FloatInput label="Mật khẩu hiện tại" value={form.currentPw} onChange={set("currentPw")} type="password" />
      <FloatInput label="Mật khẩu mới" value={form.newPw} onChange={set("newPw")} type="password" />
      <FloatInput label="Xác nhận mật khẩu mới" value={form.confirmPw} onChange={set("confirmPw")} type="password" />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <Button variant="primary">Cập nhật mật khẩu</Button>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const me = useAuthStore((s) => s.user);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Tài khoản</h1>
        {me && (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            {me.email} · role <strong>{me.role}</strong> ·{" "}
            {me.permissions.length} quyền
          </p>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", padding: "0 24px" }}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 0", marginRight: 24, border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)", borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent", marginBottom: -1, fontFamily: "var(--font-primary)", transition: "color 0.15s" }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 32 }}>
          {activeTab === "general" && <TabGeneral />}
          {activeTab === "security" && <TabSecurity />}
        </div>
      </div>
    </div>
  );
}
