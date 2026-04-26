import { type CSSProperties } from "react";
import { AlertTriangle, ArrowRightLeft, CheckCircle, CircleHelp, Clock, HelpCircle, Info, Tag, XCircle } from "lucide-react";
import { Badge, Button } from "@/shared/ui";

// ── Freshness Badge ────────────────────────────────────────────────

type FreshnessLevel = "realtime" | "cached" | "stale" | "unknown";

const FRESHNESS_CONFIG: Record<FreshnessLevel, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  realtime: { label: "Realtime", color: "#22C55E", bg: "rgba(34,197,94,0.1)", icon: <CheckCircle size={12} /> },
  cached: { label: "Cached", color: "#60A5FA", bg: "rgba(96,165,250,0.1)", icon: <Clock size={12} /> },
  stale: { label: "Cũ", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: <AlertTriangle size={12} /> },
  unknown: { label: "Không rõ", color: "#94A3B8", bg: "rgba(148,163,184,0.1)", icon: <HelpCircle size={12} /> },
};

export function parseFreshnessLevel(label: string): FreshnessLevel {
  const lower = label.toLowerCase();
  if (lower.includes("realtime")) return "realtime";
  if (lower.includes("cached")) return "cached";
  if (lower.includes("stale") || lower.includes("cũ") || lower.includes("> 12")) return "stale";
  return "unknown";
}

export function FreshnessBadge({ label, style }: { label: string; style?: CSSProperties }) {
  const level = parseFreshnessLevel(label);
  const config = FRESHNESS_CONFIG[level];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "var(--radius-pill)",
        background: config.bg,
        color: config.color,
        animation: level === "stale" ? "pulse-once 600ms ease-in-out" : undefined,
        ...style,
      }}
    >
      {config.icon}
      {label}
    </span>
  );
}

// ── Availability Status Badge ──────────────────────────────────────

type AvailabilityLevel = "available" | "low_stock" | "out_of_stock" | "unknown" | "conflict" | "needs_confirmation";

const AVAILABILITY_CONFIG: Record<AvailabilityLevel, { icon: React.ReactNode; color: string; bg: string }> = {
  available: { icon: <CheckCircle size={14} />, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  low_stock: { icon: <AlertTriangle size={14} />, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  out_of_stock: { icon: <XCircle size={14} />, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  unknown: { icon: <CircleHelp size={14} />, color: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
  conflict: { icon: <ArrowRightLeft size={14} />, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  needs_confirmation: { icon: <Info size={14} />, color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
};

export function parseAvailabilityLevel(label: string): AvailabilityLevel {
  const lower = label.toLowerCase();
  if (lower.includes("tốt") || lower === "còn hàng" || lower.includes("còn size")) return "available";
  if (lower.includes("giới hạn") || lower.includes("còn ít")) return "low_stock";
  if (lower.includes("hết")) return "out_of_stock";
  if (lower.includes("xác nhận") || lower.includes("cập nhật") || lower.includes("chờ")) return "needs_confirmation";
  if (lower.includes("conflict") || lower.includes("đồng nhất")) return "conflict";
  return "unknown";
}

export function AvailabilityStatusBadge({ label }: { label: string }) {
  const level = parseAvailabilityLevel(label);
  const config = AVAILABILITY_CONFIG[level];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: "12px",
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: "var(--radius-pill)",
        background: config.bg,
        color: config.color,
      }}
    >
      {config.icon}
      {label}
    </span>
  );
}

// ── Conflict Detail Banner ─────────────────────────────────────────

export function ConflictDetailBanner({
  sources,
  ctaLabel,
}: {
  sources: Array<{ system: string; value: string }>;
  ctaLabel: string;
}) {
  return (
    <div
      style={{
        padding: "var(--space-4)",
        borderRadius: "var(--radius-md)",
        background: "#FFF7ED",
        border: "1px solid rgba(245,158,11,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
        <AlertTriangle size={16} style={{ color: "var(--color-warning)" }} />
        <span style={{ fontWeight: 600, color: "var(--color-warning)" }}>Dữ liệu chưa đồng nhất giữa các nguồn</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
        {sources.map((s) => (
          <div key={s.system} style={{ display: "flex", gap: "var(--space-3)", fontSize: "13px" }}>
            <span style={{ fontWeight: 600, minWidth: 80, color: "var(--color-text-secondary)" }}>{s.system}:</span>
            <span>{s.value}</span>
          </div>
        ))}
      </div>
      <Button variant="secondary" style={{ fontSize: "12px", padding: "6px 14px" }}>
        {ctaLabel}
      </Button>
    </div>
  );
}

// ── Missing Rule Card ──────────────────────────────────────────────

export function MissingRuleCard({ context, ctaLabel }: { context: string; ctaLabel: string }) {
  return (
    <div
      style={{
        padding: "var(--space-5)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
        textAlign: "center",
      }}
    >
      <Info size={32} style={{ color: "var(--color-primary)", marginBottom: "var(--space-3)" }} />
      <div style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>Chưa có quy tắc cho context này</div>
      <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
        {context}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }}>
        <Button variant="secondary" style={{ fontSize: "12px" }}>{ctaLabel}</Button>
        <Button variant="secondary" style={{ fontSize: "12px" }}>Thử context khác</Button>
      </div>
    </div>
  );
}

// ── Cross-Module CTA Group ─────────────────────────────────────────

export function CrossModuleCTAs(_props: { sku: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
      <Button variant="secondary" style={{ fontSize: "12px", padding: "6px 14px" }}>
        Xem tồn kho
      </Button>
      <Button variant="secondary" style={{ fontSize: "12px", padding: "6px 14px" }}>
        Xem giá bán
      </Button>
      <Button variant="secondary" style={{ fontSize: "12px", padding: "6px 14px" }}>
        Xem khuyến mãi
      </Button>
    </div>
  );
}

// ── Price Answer Card ──────────────────────────────────────────────

export function PriceAnswerCard({
  basePrice,
  finalPrice,
  promotionLabel,
  contextLabel,
  source,
  syncedAt,
  freshnessLabel,
}: {
  basePrice: string;
  finalPrice: string;
  promotionLabel?: string;
  contextLabel: string;
  source: string;
  syncedAt: string;
  freshnessLabel: string;
  hasConflict?: boolean;
}) {
  const hasPromo = promotionLabel && basePrice !== finalPrice;

  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>{contextLabel}</div>
          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
            Nguồn: {source}
          </div>
        </div>
        <FreshnessBadge label={freshnessLabel} />
      </div>

      <div style={{ display: "grid", gap: "var(--space-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
            Giá niêm yết
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: "14px",
              textDecoration: hasPromo ? "line-through" : "none",
              color: hasPromo ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
            }}
          >
            {basePrice}
          </span>
        </div>

        {hasPromo && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-warning)", fontWeight: 500 }}>
              <Tag size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
              {promotionLabel}
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "var(--space-2)",
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-primary)" }}>
            {hasPromo ? "Giá sau CTKM" : "Giá bán"}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)" }}>
              {finalPrice}
            </span>
            {hasPromo && (
              <Badge label="★ Kết luận" color="var(--color-primary)" bg="var(--color-primary-light)" />
            )}
          </span>
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
        Cập nhật: {syncedAt}
      </div>
    </div>
  );
}

// ── Promotion Item Card ────────────────────────────────────────────

export function PromotionItemCard({
  name,
  discountLabel,
  conditionLabel,
  scopeLabel,
  validRange,
  source,
  publicSafeLabel,
  note,
  warningLabel,
  isExpiringSoon,
}: {
  name: string;
  discountLabel: string;
  conditionLabel: string;
  scopeLabel: string;
  validRange: string;
  source: string;
  publicSafeLabel: string;
  note: string;
  warningLabel?: string;
  isExpiringSoon?: boolean;
}) {
  const isRestricted = publicSafeLabel === "Restricted";
  const borderColor = isRestricted ? "#94A3B8" : "var(--color-warning)";

  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
        padding: "var(--space-4)",
        borderLeft: `3px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
            <Tag size={14} style={{ color: "var(--color-warning)" }} />
            <span style={{ fontWeight: 600 }}>{name}</span>
          </div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
            {scopeLabel}
          </div>
        </div>
        <Badge label={discountLabel} color="var(--color-primary)" bg="var(--color-primary-light)" />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
        <Badge label={source} color="#0F766E" bg="#CCFBF1" />
        <Badge
          label={publicSafeLabel}
          color={isRestricted ? "#7C3AED" : "var(--color-text-secondary)"}
          bg={isRestricted ? "#F3E8FF" : "var(--color-bg-card)"}
        />
        {isExpiringSoon && (
          <Badge label="Sắp hết hạn" color="var(--color-error)" bg="rgba(239,68,68,0.1)" />
        )}
        {isRestricted && (
          <Badge label="Nội bộ" color="#94A3B8" bg="rgba(148,163,184,0.1)" />
        )}
        {warningLabel && (
          <Badge label={warningLabel} color="var(--color-warning)" bg="#FFF7ED" />
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Điều kiện
          </div>
          <div style={{ marginTop: 2, fontWeight: 500, fontSize: "13px" }}>{conditionLabel}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Hiệu lực
          </div>
          <div style={{ marginTop: 2, fontWeight: 500, fontSize: "13px" }}>{validRange}</div>
        </div>
      </div>

      <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
        {note}
      </div>
    </div>
  );
}

// ── No Promotion State ─────────────────────────────────────────────

export function NoPromotionState({ context }: { context: string }) {
  return (
    <div
      style={{
        padding: "var(--space-6)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg-surface)",
        textAlign: "center",
      }}
    >
      <Tag size={32} style={{ color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)" }} />
      <div style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>Không có CTKM đang áp dụng</div>
      <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
        Không tìm thấy khuyến mãi nào cho {context}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }}>
        <Button variant="secondary" style={{ fontSize: "12px" }}>Thử context khác</Button>
        <Button variant="secondary" style={{ fontSize: "12px" }}>Xem giá bán thông thường</Button>
      </div>
    </div>
  );
}
