"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brandConfig } from "@/../brand.config";
import { Button } from "@/components/ui/button";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { cartStore } from "@/lib/cart-store";
import { Check, WhatsappLogo, Scissors, Ruler, ShieldCheck } from "@phosphor-icons/react";

interface FabricVariety {
  id: string;
  name: string;
  weave: string;
  composition: string;
  ratePerMetreInr: number;
  ratePerMetrePaise: number;
  image: string;
  colors: string[];
  description: string;
}

const FABRIC_VARIETIES: FabricVariety[] = [
  {
    id: "cambric-pink-floral",
    name: "Pure Cambric 60×60 Pink Floral",
    weave: "60×60 High-Density Cambric",
    composition: "100% Combed Indian Cotton",
    ratePerMetreInr: 240,
    ratePerMetrePaise: 24000,
    image: "/brand/products/EKC-81/9L3A2548 (1).jpg",
    colors: ["#E87A90", "#F4ACB7", "#FAF8F5"],
    description: "Lightweight, breathable weave ideal for summer kurtas, breezy day dresses, and children's wear. Softens noticeably with each wash.",
  },
  {
    id: "slub-indigo-geometric",
    name: "Artisan Slub Indigo Weave",
    weave: "Handloom Textured Slub",
    composition: "100% Ring-Spun Cotton",
    ratePerMetreInr: 280,
    ratePerMetrePaise: 28000,
    image: "/brand/products/EKC-1502-3 Piece/1.jpeg",
    colors: ["#3D5A80", "#2F3E46", "#FAF8F5"],
    description: "Distinct organic slub texture with rich natural indigo depth. Structural drape suited for straight-cut kurtis, palazzos, and shrugs.",
  },
  {
    id: "banarasi-silk-brocade",
    name: "Banarasi Soft Silk Brocade",
    weave: "Woven Jacquard with Zari Border",
    composition: "Banarasi Art Silk & Pure Cotton Lining",
    ratePerMetreInr: 360,
    ratePerMetrePaise: 36000,
    image: "/brand/products/EKC-1501-3 piece/2.jpeg",
    colors: ["#943843", "#A67C38", "#1C1E24"],
    description: "Lustrous woven brocade featuring traditional metallic motifs. Celebrated for celebratory dupattas, festive blouses, and bespoke waistcoats.",
  },
];

export default function FabricPage() {
  const [selectedFabric, setSelectedFabric] = useState<FabricVariety>(FABRIC_VARIETIES[0]);
  const [metres, setMetres] = useState<number>(2.5);
  const [added, setAdded] = useState<boolean>(false);

  const increment = () => setMetres((m) => Math.min(15, +(m + 0.5).toFixed(1)));
  const decrement = () => setMetres((m) => Math.max(1.0, +(m - 0.5).toFixed(1)));

  const totalPriceInr = Math.round(metres * selectedFabric.ratePerMetreInr);
  const totalPricePaise = Math.round(metres * selectedFabric.ratePerMetrePaise);

  const handleAddToCart = () => {
    cartStore.addItem({
      slug: `fabric-${selectedFabric.id}`,
      name: `${selectedFabric.name} (${metres}m Cut)`,
      price_paise: totalPricePaise,
      image: selectedFabric.image,
      size: `${metres}m`,
      quantity: 1,
      fabric: selectedFabric.weave,
      isFabricCut: true,
      metres: metres,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const whatsappInquiryUrl = `https://wa.me/919929191655?text=${encodeURIComponent(
    `Namaste Eskort Creations, I would like to order a custom cut of ${selectedFabric.name} (${metres} metres @ ₹${selectedFabric.ratePerMetreInr}/m = ₹${totalPriceInr}). Please confirm availability.`
  )}`;

  return (
    <div className="w-full bg-[var(--canvas)] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs text-[var(--ink-muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--ink-primary)]">Home</Link>
          <span>/</span>
          <span className="text-[var(--ink-primary)] font-medium">Fabric by Metre</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
              Jaipur Loom Workshop
            </span>
            <span className="text-[var(--ink-faint)]">·</span>
            <SelvedgeDots colors={selectedFabric.colors} size="sm" />
          </div>
          <h1 className="text-display-title font-display text-[var(--ink-primary)]">
            Pure printed cotton by the metre
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-3 leading-relaxed">
            Running yardage sheared directly from our looms. Measured and cut with 0.5-metre precision
            for matching mother-daughter sets, custom kurtas, or bespoke home tailoring.
          </p>
        </div>

        {/* Workshop Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Fabric Visual & Varieties Selection */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Active Fabric Image */}
            <div className="relative aspect-[4/3] w-full rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
              <Image
                src={selectedFabric.image}
                alt={selectedFabric.name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[var(--canvas)]/95 text-[var(--ink-primary)] text-[11px] font-semibold px-3 py-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
                  Standard Indian Panna: 44 Inches (112 cm)
                </span>
              </div>
            </div>

            {/* Variety Selector Cards */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)] mb-3">
                Select Fabric Weave
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FABRIC_VARIETIES.map((variety) => {
                  const isSelected = variety.id === selectedFabric.id;
                  return (
                    <button
                      key={variety.id}
                      type="button"
                      onClick={() => setSelectedFabric(variety)}
                      className={`text-left p-3.5 rounded-[var(--radius-control)] border transition-all ${
                        isSelected
                          ? "border-[var(--accent-madder)] bg-[var(--surface-card)] ring-1 ring-[var(--accent-madder)] shadow-xs"
                          : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-card)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <SelvedgeDots colors={variety.colors} size="sm" />
                        <span className="text-xs font-semibold text-[var(--ink-primary)]">
                          ₹{variety.ratePerMetreInr}/m
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[var(--ink-primary)] line-clamp-1">
                        {variety.name}
                      </p>
                      <p className="text-[11px] text-[var(--ink-muted)] mt-0.5 line-clamp-1">
                        {variety.weave}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical Textile Specifications */}
            <div className="bg-[var(--surface-subtle)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)] mb-3">
                Textile Truth &amp; Quality Facts
              </h3>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <dt className="text-[var(--ink-muted)]">Weave Density</dt>
                  <dd className="font-medium text-[var(--ink-primary)] mt-0.5">{selectedFabric.weave}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Composition</dt>
                  <dd className="font-medium text-[var(--ink-primary)] mt-0.5">{selectedFabric.composition}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Bolt Width</dt>
                  <dd className="font-medium text-[var(--ink-primary)] mt-0.5">44&quot; (Standard Panna)</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Pre-Shrinkage</dt>
                  <dd className="font-medium text-[var(--ink-primary)] mt-0.5">&lt; 2% wash tested</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Dye Process</dt>
                  <dd className="font-medium text-[var(--ink-primary)] mt-0.5">Azo-free artisanal dyes</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Minimum Cut</dt>
                  <dd className="font-medium text-[var(--ink-primary)] mt-0.5">1.0 Metre</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Interactive Cut Stepper & Order Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-strong)] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="text-xs text-[var(--ink-muted)]">Selected Cut</span>
                  <h3 className="text-base font-semibold text-[var(--ink-primary)]">{selectedFabric.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--ink-muted)] block">Running Total</span>
                  <span className="text-2xl font-semibold tabular-numbers text-[var(--ink-primary)]">
                    ₹{totalPriceInr}
                  </span>
                  <span className="text-[10px] text-[var(--ink-muted)] block">GST incl. (5%)</span>
                </div>
              </div>

              {/* Length Stepper */}
              <div className="py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="cut-stepper" className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)]">
                    Length in Metres (Min 1.0m)
                  </label>
                  <span className="text-xs text-[var(--ink-muted)]">0.5m increments</span>
                </div>

                <div className="flex items-center justify-between bg-[var(--surface-subtle)] p-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)]">
                  <span className="text-xs font-medium text-[var(--ink-secondary)]">Custom Cut</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={decrement}
                      disabled={metres <= 1.0}
                      className="w-8 h-8 rounded-full border border-[var(--border-strong)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--ink-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--border-subtle)] transition-colors"
                      aria-label="Decrease length by 0.5 metres"
                    >
                      -
                    </button>
                    <span id="cut-stepper" className="text-base font-semibold tabular-numbers min-w-[54px] text-center text-[var(--ink-primary)]">
                      {metres} m
                    </span>
                    <button
                      type="button"
                      onClick={increment}
                      disabled={metres >= 15.0}
                      className="w-8 h-8 rounded-full border border-[var(--border-strong)] bg-[var(--surface-card)] text-sm font-semibold text-[var(--ink-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--border-subtle)] transition-colors"
                      aria-label="Increase length by 0.5 metres"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Ruler graphic representation */}
                <div className="py-3 px-2 border-t border-[var(--border-subtle)]">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--ink-faint)] pb-1">
                    <span>0m</span>
                    <span>2.5m</span>
                    <span>5m</span>
                    <span>7.5m</span>
                    <span>10m</span>
                  </div>
                  <div className="relative h-4 w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xs overflow-hidden flex items-center">
                    <div
                      className="h-full bg-[var(--accent-madder)]/25 transition-all duration-200"
                      style={{ width: `${Math.min(100, (metres / 10) * 100)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[var(--accent-madder)]"
                      style={{ left: `${Math.min(100, (metres / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {added ? (
                    <>
                      <Check size={18} weight="bold" />
                      <span>Added {metres}m to Cart</span>
                    </>
                  ) : (
                    <>
                      <Scissors size={18} />
                      <span>Add {metres}m to Cart — ₹{totalPriceInr}</span>
                    </>
                  )}
                </Button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-[var(--radius-control)] border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <WhatsappLogo size={18} weight="regular" />
                  <span>Order Cut via WhatsApp</span>
                </a>
              </div>

              {/* Assurance Trust Badges */}
              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex flex-col gap-2.5 text-[11px] text-[var(--ink-secondary)]">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-[var(--accent-brass)] shrink-0" />
                  <span>Exact shears from the bolt — zero measurement shortening.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[var(--accent-madder)] shrink-0" />
                  <span>Pre-washed &amp; stabilized against excessive shrinkage.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
