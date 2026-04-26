import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
    color: "#fff",
  },
  secondary: {
    background: "var(--color-primary-light)",
    color: "var(--color-primary)",
  },
  tertiary: {
    background: "transparent",
    color: "var(--color-primary)",
  },
};

const base: React.CSSProperties = {
  border: "none",
  borderRadius: "var(--radius-pill)",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: 500,
  fontFamily: "var(--font-primary)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-2)",
  transition: "opacity 0.15s",
};

export function Button({ variant = "primary", children, style, ...rest }: ButtonProps) {
  return (
    <button style={{ ...base, ...styles[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}
