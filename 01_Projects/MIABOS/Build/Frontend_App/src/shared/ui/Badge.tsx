interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
}

export function Badge({ label, color, bg }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "var(--radius-pill)",
        fontSize: "11px",
        fontWeight: 500,
        lineHeight: 1.5,
        color: color ?? "var(--color-primary)",
        background: bg ?? "var(--color-primary-light)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

const STATUS_MAP: Record<string, { color: string; bg: string }> = {
  Lead: { color: "var(--color-warning)", bg: "#FEF3C7" },
  Qualified: { color: "var(--color-primary)", bg: "var(--color-primary-light)" },
  Customer: { color: "var(--color-success)", bg: "#DCFCE7" },
  Inactive: { color: "var(--color-text-tertiary)", bg: "var(--color-bg-surface)" },
  Blocked: { color: "var(--color-error)", bg: "#FFE4E6" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { color: "var(--color-text-secondary)", bg: "var(--color-bg-surface)" };
  return <Badge label={status} color={s.color} bg={s.bg} />;
}
