import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "subtle";
  children: React.ReactNode;
}

export function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral:
      "bg-[var(--surface-subtle)] text-[var(--ink-secondary)] border border-[var(--border-subtle)]",
    accent:
      "bg-[var(--accent-madder)] text-white border-transparent",
    subtle:
      "bg-black/5 text-[var(--ink-primary)] border-transparent",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full select-none ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
