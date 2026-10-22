import React from "react";

interface SelvedgeDotsProps {
  colors?: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function SelvedgeDots({
  colors = ["#943843", "#A67C38", "#3D5A80", "#2F3E46"],
  size = "md",
  className = "",
  label,
}: SelvedgeDotsProps) {
  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      role="group"
      aria-label={label || "Fabric registration color dots"}
    >
      {colors.map((color, idx) => (
        <span
          key={`${color}-${idx}`}
          className={`rounded-full shrink-0 border border-black/10 ${sizeMap[size]}`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
      {label && (
        <span className="text-xs text-ink-muted ml-1 font-normal font-sans">
          {label}
        </span>
      )}
    </div>
  );
}

export default SelvedgeDots;
