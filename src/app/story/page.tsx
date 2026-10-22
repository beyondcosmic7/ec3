import React from "react";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { Media } from "@/components/ui/media";


export const metadata = {
  title: "Our Story & Jaipur Workshop — Eskort Creations",
  description:
    "Eskort Creations is an artisanal women's ethnic atelier based in Jaipur, Rajasthan, crafting calm, breathable garments with honest inch measurements.",
};

export default function StoryPage() {
  return (
    <div className="w-full flex flex-col bg-[var(--canvas)] min-h-screen">
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
            Our Foundation
          </span>
          <span className="text-[var(--ink-faint)]">·</span>
          <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
        </div>

        <h1 className="text-display-title font-display text-[var(--ink-primary)] mb-6">
          The Jaipur Atelier: Measured in inches, unhurried by design
        </h1>

        <div className="relative aspect-[16/9] w-full rounded-[var(--radius-media)] overflow-hidden mb-10 border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
          <Media
            src="/brand/products/EKC-1501-3 piece/2.jpeg"
            alt="Handcrafting and Zari Weaving in Jaipur"
            fill
            priority
            aspectRatio="auto"
            className="object-cover"
          />
        </div>

        <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed flex flex-col gap-6">
          <p>
            Eskort Creations was established in Jaipur with a single guiding principle:
            Indian women deserve garments cut from breathable, honest fabrics with measurements
            that never require guesswork.
          </p>

          <p>
            Too often, contemporary fashion relies on synthetic polyester blends and vague size labels
            that vary wildly between batches. At our Jaipur workroom, our master pattern makers measure
            every piece flat across the bust, waist, hip, and length in exact inches.
          </p>

          <div className="p-6 bg-[var(--surface-subtle)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] flex flex-col gap-3 my-2">
            <h2 className="text-sm font-semibold text-[var(--ink-primary)]">
              What We Stand By
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-[var(--ink-muted)]">
              <li>Breathable weaves: 100% pure combed cotton, viscose rayon, and pure Banarasi soft silk.</li>
              <li>Inner cotton linings: metal threads and zari embroideries never touch bare skin.</li>
              <li>Generous seam allowances: 1.5-inch internal margins for custom adjustments.</li>
              <li>No false scarcity: no fake countdown timers, no drip pricing, no invented reviews.</li>
            </ul>
          </div>

          <p>
            Whether you are nursing late at night, moving through a busy day at work, or celebrating with
            family, we hope our pieces feel like a quiet, comforting second skin.
          </p>
        </div>
      </main>
    </div>
  );
}
