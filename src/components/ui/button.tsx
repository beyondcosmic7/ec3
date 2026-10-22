import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium font-body transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none active:scale-[0.985] rounded-[var(--radius-control)]";

    const variantStyles = {
      primary:
        "bg-[var(--accent-madder)] text-white hover:brightness-105 active:brightness-95 border-none",
      secondary:
        "bg-[var(--surface-subtle)] text-[var(--ink-primary)] hover:bg-[var(--border-subtle)] border-none",
      outline:
        "bg-transparent text-[var(--ink-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]",
      ghost:
        "bg-transparent text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] border-none",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 min-h-[36px]",
      md: "text-sm px-4 py-2.5 min-h-[44px]", // 44px min touch target on mobile
      lg: "text-base px-6 py-3.5 min-h-[50px]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        style={{
          transitionDuration: "var(--duration-press)",
          transitionTimingFunction: "var(--ease-settle)",
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
