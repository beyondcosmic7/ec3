"use client";

import React, { useState } from "react";
import { brandConfig } from "@/../brand.config";
import { Button } from "@/components/ui/button";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { cartStore } from "@/lib/cart-store";

export function CutToLength() {
  const [metres, setMetres] = useState<number>(2.5);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  if (!brandConfig.featureFlags.fabricByMetre) {
    return null;
  }

  // Rate in paise per metre (e.g. ₹240/metre = 24000 paise)
  const RATE_PER_METRE_INR = 240;


  const increment = () => setMetres((m) => Math.min(15, +(m + 0.5).toFixed(1)));
  const decrement = () => setMetres((m) => Math.max(1.0, +(m - 0.5).toFixed(1)));

  const totalPriceInr = Math.round(metres * RATE_PER_METRE_INR);

  return (
    <section className="w-full py-16 sm:py-24 bg-[var(--surface-subtle)] border-b border-[var(--border-subtle)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--canvas)] rounded-[var(--radius-control)] border border-[var(--border-strong)] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
                  Fabric Workshop
                </span>
                <span className="text-[var(--ink-faint)]">·</span>
                <SelvedgeDots colors={["#3D5A80", "#E87A90", "#F4ACB7"]} size="sm" />
              </div>
              <h2 className="text-heading font-display text-[var(--ink-primary)]">
                Cut to length: Pure printed cotton by the metre
              </h2>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-xs text-[var(--ink-muted)] block">Running Total</span>
              <span className="text-2xl font-semibold tabular-numbers text-[var(--ink-primary)]">
                ₹{totalPriceInr}
              </span>
              <span className="text-[10px] text-[var(--ink-muted)] block">GST incl. (@ ₹240/m)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] py-6 leading-relaxed">
            Need running fabric for matching suits, children&apos;s frocks, or custom tailoring?
            Select your exact cut length in 0.5-metre increments. Each bolt is inspected for weave
            uniformity and sheared cleanly off the loom.
          </p>

          {/* Stepper & Ruler Visualization */}
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center justify-between bg-[var(--surface-subtle)] p-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)]">
              <span className="text-xs font-medium text-[var(--ink-secondary)]">
                Selected Cut Length:
              </span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={decrement}
                  disabled={metres <= 1.0}
                  aria-label="Decrease cut length by 0.5 metres"
                  className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-strong)] text-[var(--ink-primary)] font-bold text-sm disabled:opacity-30 interactive-press"
                >
                  −
                </button>
                <span className="text-lg font-mono font-semibold tabular-numbers min-w-[4rem] text-center text-[var(--ink-primary)]">
                  {metres.toFixed(1)} m
                </span>
                <button
                  type="button"
                  onClick={increment}
                  disabled={metres >= 15}
                  aria-label="Increase cut length by 0.5 metres"
                  className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-strong)] text-[var(--ink-primary)] font-bold text-sm disabled:opacity-30 interactive-press"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stylized Metric Ruler Graphics */}
            <div className="w-full bg-[var(--canvas)] p-3 rounded-[var(--radius-media)] border border-[var(--border-subtle)] overflow-hidden">
              <div className="flex justify-between text-[9px] font-mono text-[var(--ink-faint)] pb-1">
                <span>0m</span>
                <span>2m</span>
                <span>4m</span>
                <span>6m</span>
                <span>8m</span>
                <span>10m</span>
              </div>
              <div className="relative h-6 w-full flex items-end justify-between border-t border-[var(--ink-primary)]">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-[var(--ink-primary)] w-[1px] ${
                      i % 4 === 0 ? "h-4" : i % 2 === 0 ? "h-2.5" : "h-1.5"
                    }`}
                  />
                ))}
                {/* Active marker pin */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[var(--accent-madder)] transition-all duration-300"
                  style={{ left: `${Math.min(100, (metres / 10) * 100)}%` }}
                >
                  <div className="w-2.5 h-2.5 -top-1 -left-1 rounded-full bg-[var(--accent-madder)] absolute" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--ink-muted)]">
              Width: 44 inches (Standard Indian Panna)
            </span>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  cartStore.addItem({
                    slug: "pure-printed-cotton-fabric-cut",
                    name: `Pure Printed Cotton Fabric (${metres}m Cut)`,
                    size: `${metres}m`,
                    quantity: 1,
                    price_paise: totalPriceInr * 100,
                    image: "/brand/products/EKC-1503-3 Piece/1.jpeg",
                    fabric: "Pure Combed Cotton",
                    isFabricCut: true,
                    metres,
                  });
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 2000);
                }}
                className="w-full sm:w-auto"
              >
                {isAdded ? "Added Cut to Cart" : `Add Cut to Cart — ₹${totalPriceInr}`}
              </Button>
              <a
                href={`https://wa.me/919929191655?text=${encodeURIComponent(
                  `Namaste Eskort Creations, I would like to order ${metres} metres of running cotton fabric (Total ₹${totalPriceInr}). Please confirm available prints.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  Request Cut on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
