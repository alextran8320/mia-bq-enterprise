import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, style, ...rest }: InputProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        background: "var(--color-bg-card)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-ambient)",
        ...style,
      }}
    >
      {icon && <span style={{ color: "var(--color-text-tertiary)", display: "flex" }}>{icon}</span>}
      <input
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          font: "inherit",
          color: "var(--color-text-primary)",
          width: "100%",
        }}
        {...rest}
      />
    </div>
  );
}
