"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Media } from "@/components/ui/media";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface NewInRailProps {
  products: Product[];
}

export function NewInRail({ products }: NewInRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
                Recent Workshop Releases
              </span>
              <span className="text-[var(--ink-faint)]">·</span>
              <span className="text-xs text-[var(--ink-muted)]">Pure Weaves</span>
            </div>
            <h2 className="text-heading font-display text-[var(--ink-primary)]">
              New in: Tailored Pieces
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="text-xs font-medium text-[var(--accent-madder)] hover:underline hidden sm:inline"
            >
              All {products.length} designs
            </Link>
            <div className="flex items-center gap-1.5" aria-label="Rail navigation">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:border-[var(--ink-primary)] hover:text-[var(--ink-primary)] interactive-press"
              >
                <CaretLeft size={16} weight="light" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:border-[var(--ink-primary)] hover:text-[var(--ink-primary)] interactive-press"
              >
                <CaretRight size={16} weight="light" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Snap Rail */}
        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-label="New products horizontal rail"
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory focus:outline-none focus:ring-1 focus:ring-[var(--border-strong)]"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p, idx) => {
            const firstImage = p.images[0] ? `/brand/products/${p.images[0]}` : "";
            const isTall = idx % 2 === 0;

            return (
              <article
                key={p.slug}
                className="snap-start shrink-0 w-[240px] sm:w-[280px] flex flex-col group"
              >
                <Link
                  href={`/product/${p.slug}`}
                  className={`relative block w-full overflow-hidden rounded-[var(--radius-media)] bg-[var(--surface-subtle)] ${
                    isTall ? "aspect-[4/5]" : "aspect-[3/4]"
                  }`}
                >
                  {firstImage && (
                    <Media
                      src={firstImage}
                      alt={p.name}
                      fill
                      aspectRatio="auto"
                      className="group-hover:scale-[1.02] transition-transform duration-500 object-cover"
                    />
                  )}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="bg-[var(--canvas)]/90 text-[var(--ink-primary)] text-[10px] font-medium px-2 py-0.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
                      {p.fabric.split(" ")[0]}
                    </span>
                  </div>
                </Link>

                {/* Caption Only (No card boxes per prompt 8.2) */}
                <div className="pt-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <SelvedgeDots colors={p.print_colours} size="sm" />
                    <span className="text-[10px] text-[var(--ink-muted)]">
                      {p.sizes.join(" · ")}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-medium line-clamp-1 text-[var(--ink-primary)] group-hover:text-[var(--accent-madder)] transition-colors">
                    <Link href={`/product/${p.slug}`}>{p.name}</Link>
                  </h3>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm font-semibold tabular-numbers text-[var(--ink-primary)]">
                      ₹{p.price_inr}
                    </span>
                    {p.mrp_inr > p.price_inr && (
                      <span className="text-xs text-[var(--ink-muted)] line-through tabular-numbers">
                        ₹{p.mrp_inr}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--ink-faint)] ml-auto">
                      GST incl.
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
