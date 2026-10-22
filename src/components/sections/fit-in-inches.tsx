"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FitInInches() {
  const [bust, setBust] = useState<number>(36);
  const [hip, setHip] = useState<number>(39);

  // Garment sizes table according to Eskort Creations Jaipur standard specifications
  const standardGarments: Record<string, { bust: number; hip: number; length: number }> = {
    XS: { bust: 34, hip: 36, length: 42 },
    S: { bust: 36, hip: 38, length: 42 },
    M: { bust: 38, hip: 40, length: 42 },
    L: { bust: 40, hip: 42, length: 42 },
    XL: { bust: 42, hip: 44, length: 42 },
    XXL: { bust: 44, hip: 46, length: 42 },
    "3XL": { bust: 46, hip: 48, length: 45 },
  };

  // Find recommended size: body measurement + 2 inches ease
  let recommendedSize = "M";
  let sizeUpAdvice = "";

  const requiredGarmentBust = bust + 2;
  const requiredGarmentHip = hip + 2;

  if (requiredGarmentBust <= 34 && requiredGarmentHip <= 36) {
    recommendedSize = "XS";
  } else if (requiredGarmentBust <= 36 && requiredGarmentHip <= 38) {
    recommendedSize = "S";
  } else if (requiredGarmentBust <= 38 && requiredGarmentHip <= 40) {
    recommendedSize = "M";
  } else if (requiredGarmentBust <= 40 && requiredGarmentHip <= 42) {
    recommendedSize = "L";
  } else if (requiredGarmentBust <= 42 && requiredGarmentHip <= 44) {
    recommendedSize = "XL";
  } else if (requiredGarmentBust <= 44 && requiredGarmentHip <= 46) {
    recommendedSize = "XXL";
  } else {
    recommendedSize = "3XL";
  }

  // Check if close to boundary
  const currentGarment = standardGarments[recommendedSize];
  if (currentGarment) {
    const bustMargin = currentGarment.bust - bust;
    if (bustMargin < 1.5) {
      sizeUpAdvice = "If you prefer a relaxed silhouette or layering room, consider sizing up to the next size.";
    }
  }

  return (
    <section className="w-full py-16 sm:py-24 bg-[var(--canvas)] border-b border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
            Measurement Precision
          </span>
          <h2 className="text-heading font-display text-[var(--ink-primary)] mt-1">
            Fit in inches: No guesswork sizing
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-2">
            Every garment has its exact chest, waist, and hip measurements tailored
            with internal 1.5-inch let-out seam allowances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[var(--surface-subtle)] p-6 sm:p-10 rounded-[var(--radius-control)] border border-[var(--border-subtle)]">
          {/* Measurement Controls */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="bust-slider" className="text-xs font-semibold text-[var(--ink-primary)]">
                  Your Body Bust Measurement
                </label>
                <span className="text-sm font-mono font-semibold tabular-numbers text-[var(--accent-madder)]">
                  {bust}&quot; inches
                </span>
              </div>
              <input
                id="bust-slider"
                type="range"
                min="30"
                max="46"
                step="1"
                value={bust}
                onChange={(e) => setBust(Number(e.target.value))}
                aria-label="Body bust measurement in inches"
                className="w-full accent-[var(--accent-madder)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--ink-muted)] mt-1 font-mono">
                <span>30&quot;</span>
                <span>38&quot;</span>
                <span>46&quot;</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="hip-slider" className="text-xs font-semibold text-[var(--ink-primary)]">
                  Your Body Hip Measurement
                </label>
                <span className="text-sm font-mono font-semibold tabular-numbers text-[var(--accent-madder)]">
                  {hip}&quot; inches
                </span>
              </div>
              <input
                id="hip-slider"
                type="range"
                min="32"
                max="50"
                step="1"
                value={hip}
                onChange={(e) => setHip(Number(e.target.value))}
                aria-label="Body hip measurement in inches"
                className="w-full accent-[var(--accent-madder)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--ink-muted)] mt-1 font-mono">
                <span>32&quot;</span>
                <span>40&quot;</span>
                <span>50&quot;</span>
              </div>
            </div>

            <div className="text-[11px] text-[var(--ink-muted)] bg-[var(--canvas)] p-3 rounded-[var(--radius-media)] border border-[var(--border-subtle)] leading-relaxed">
              <strong>Tailoring Note:</strong> Eskort kurtas include standard 2-inch movement ease
              so garments drape without pulling across the shoulders or chest.
            </div>
          </div>

          {/* Sizing Output Card */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[var(--canvas)] rounded-[var(--radius-control)] border border-[var(--border-strong)] text-center shadow-xs">
            <span className="text-xs uppercase font-medium text-[var(--ink-muted)]">
              Your Recommended Size
            </span>
            <span className="text-4xl font-display font-bold text-[var(--ink-primary)] my-2">
              Size {recommendedSize}
            </span>

            <div className="w-full my-4 py-3 border-y border-[var(--border-subtle)] text-xs font-mono flex flex-col gap-1.5 text-[var(--ink-secondary)]">
              <div className="flex justify-between">
                <span>Garment Chest:</span>
                <span className="font-semibold text-[var(--ink-primary)]">
                  {currentGarment?.bust}&quot;
                </span>
              </div>
              <div className="flex justify-between">
                <span>Garment Hip:</span>
                <span className="font-semibold text-[var(--ink-primary)]">
                  {currentGarment?.hip}&quot;
                </span>
              </div>
              <div className="flex justify-between">
                <span>Standard Length:</span>
                <span className="font-semibold text-[var(--ink-primary)]">
                  {currentGarment?.length}&quot;
                </span>
              </div>
            </div>

            {sizeUpAdvice && (
              <p className="text-[11px] text-[var(--accent-brass)] mb-4 leading-normal">
                {sizeUpAdvice}
              </p>
            )}

            <Link href={`/shop?size=${recommendedSize}`} className="w-full">
              <Button variant="primary" size="md" className="w-full">
                Shop Size {recommendedSize} Pieces
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
