import React from "react";
import { Media } from "@/components/ui/media";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";

export function TheCloth() {
  return (
    <section className="w-full py-16 sm:py-24 bg-[var(--canvas)] border-b border-[var(--border-subtle)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Macro Textile Visual Stage */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-subtle)] group">
              <Media
                src="/brand/products/EKC-1501-3 piece/2.jpeg"
                alt="Banarasi Soft Silk Weave Detail with Zari Border"
                fill
                aspectRatio="auto"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[var(--canvas)]/90 backdrop-blur-none text-[var(--ink-primary)] text-[10px] font-semibold px-2.5 py-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
                  Macro View · 1:1 Weave
                </span>
              </div>
            </div>
          </div>

          {/* Authentic Care-Label Fact Block */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
                  Textile Architecture
                </span>
                <span className="text-[var(--ink-faint)]">·</span>
                <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
              </div>
              <h2 className="text-heading font-display text-[var(--ink-primary)]">
                The cloth: Counted threads, honest dyes
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              We do not coat fabrics in artificial silicones to simulate softness.
              Our rayon is derived from natural wood pulp for breathable drape, and
              our Banarasi weaves are backed with 100% pure combed cotton inner
              linings so metal threads never touch bare skin.
            </p>

            {/* Care-Label Specification Container */}
            <div className="p-4 sm:p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--ink-muted)]">FIBRE WEAVE</span>
                <span className="font-semibold text-[var(--ink-primary)]">60×60 Pure Cambric & Art Silk</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--ink-muted)]">INNER LINING</span>
                <span className="font-semibold text-[var(--ink-primary)]">100% Breathable Cotton</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--ink-muted)]">SEAM ALLOWANCE</span>
                <span className="font-semibold text-[var(--ink-primary)]">1.5 inches internal let-out margin</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-muted)]">SHRINKAGE</span>
                <span className="font-semibold text-[var(--ink-primary)]">&lt; 2% pre-shrunk wash test</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
