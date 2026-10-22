import React from "react";
import { GarmentMeasurements } from "@/lib/types";

interface FitPanelProps {
  measurements: GarmentMeasurements;
}

export function FitPanel({ measurements }: FitPanelProps) {
  const sizes = Object.keys(measurements);
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-medium text-[var(--ink-primary)]">
          Garment Measurements (Inches)
        </h3>
        <span className="text-[10px] text-[var(--ink-muted)]">
          Finished garment dimensions
        </span>
      </div>

      <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-strong)] text-[var(--ink-secondary)]">
              <th className="py-2 pr-3 font-semibold">Size</th>
              <th className="py-2 px-3 font-semibold">Bust</th>
              <th className="py-2 px-3 font-semibold">Waist</th>
              <th className="py-2 px-3 font-semibold">Hip</th>
              <th className="py-2 pl-3 font-semibold">Length</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--ink-primary)]">
            {sizes.map((s) => {
              const row = measurements[s];
              return (
                <tr key={s} className="hover:bg-[var(--canvas)]/50 transition-colors">
                  <td className="py-2 pr-3 font-bold text-[var(--accent-madder)]">{s}</td>
                  <td className="py-2 px-3">{row.bust}&quot;</td>
                  <td className="py-2 px-3">{row.waist ? `${row.waist}"` : "Relaxed"}</td>
                  <td className="py-2 px-3">{row.hip ? `${row.hip}"` : "Flared"}</td>
                  <td className="py-2 pl-3">{row.length}&quot;</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed pt-1 border-t border-[var(--border-subtle)]">
        *Measurements are taken across the flat garment. Includes internal 1.5&quot; seam margins for tailoring adjustments.
      </p>
    </div>
  );
}
