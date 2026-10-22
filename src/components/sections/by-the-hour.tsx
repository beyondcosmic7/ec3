"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Media } from "@/components/ui/media";

interface ByTheHourProps {
  products: Product[];
}

interface MomentItem {
  hour: string;
  title: string;
  subtitle: string;
  momentTag: string;
  sampleProduct: Product;
}

export function ByTheHour({ products }: ByTheHourProps) {
  // Map moments to representative authentic products
  const momentEntries: MomentItem[] = [
    {
      hour: "07:00",
      title: "Slow Morning Rituals",
      subtitle: "Soft breathable rayon kurtas with natural ease",
      momentTag: "Daily Comfort",
      sampleProduct: products.find((p) => p.moment === "Daily Comfort") || products[0],
    },
    {
      hour: "11:30",
      title: "Work & Daytime Movement",
      subtitle: "Tailored V-neck striped kurti and trouser pairs",
      momentTag: "Work & Casual",
      sampleProduct: products.find((p) => p.slug === "ekc-86p-striped-kurta-pant-set") || products[1],
    },
    {
      hour: "15:00",
      title: "Afternoon Ease & Feeding",
      subtitle: "Pure combed cotton with gentle front access",
      momentTag: "Everyday Artisan",
      sampleProduct: products.find((p) => p.slug === "ekc-1503-cotton-fasri-3piece-set") || products[2],
    },
    {
      hour: "18:30",
      title: "Evening Chai & Gatherings",
      subtitle: "Coordinated longline shrugs and inner slip ensembles",
      momentTag: "Contemporary Fusion",
      sampleProduct: products.find((p) => p.slug === "ekc-398-striped-longline-shrug-set") || products[3],
    },
    {
      hour: "21:00",
      title: "Festive Twilight Celebrations",
      subtitle: "Royal Banarasi soft silk with pure cotton lining",
      momentTag: "Festive Celebrations",
      sampleProduct: products.find((p) => p.slug === "ekc-1501-banarasi-silk-3piece-set") || products[4],
    },
  ];

  const [activeMoment, setActiveMoment] = useState<MomentItem>(momentEntries[0]);

  return (
    <section
      id="by-the-hour"
      className="w-full py-16 sm:py-24 bg-[var(--surface-subtle)] border-b border-[var(--border-subtle)] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[var(--border-strong)]">
          <div>
            <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
              The Daily Rhythm
            </span>
            <h2 className="text-heading font-display text-[var(--ink-primary)] mt-1">
              By the hour: Wear what breathes
            </h2>
          </div>
          <p className="text-xs text-[var(--ink-muted)] max-w-sm mt-2 md:mt-0">
            From sunrise household flow to twilight gatherings, our garments are
            proportioned for movement, comfort, and unhurried days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Typographic Index Column */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[var(--border-subtle)]">
            {momentEntries.map((item) => {
              const isSelected = activeMoment.hour === item.hour;
              return (
                <div
                  key={item.hour}
                  onMouseEnter={() => setActiveMoment(item)}
                  onFocus={() => setActiveMoment(item)}
                  className={`group py-5 px-3 sm:px-4 flex items-center justify-between rounded-[var(--radius-control)] transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[var(--canvas)] shadow-xs"
                      : "hover:bg-[var(--canvas)]/60"
                  }`}
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="text-xs font-mono tabular-numbers text-[var(--accent-madder)]">
                      {item.hour}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-display text-[var(--ink-primary)] group-hover:text-[var(--accent-madder)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/shop?moment=${encodeURIComponent(item.momentTag)}`}
                    className="text-xs font-medium text-[var(--accent-brass)] underline sm:opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-[var(--radius-media)] overflow-hidden bg-[var(--canvas)] border border-[var(--border-subtle)]">
              {activeMoment.sampleProduct.images[0] && (
                <Media
                  key={activeMoment.sampleProduct.slug}
                  src={`/brand/products/${activeMoment.sampleProduct.images[0]}`}
                  alt={activeMoment.sampleProduct.name}
                  fill
                  aspectRatio="auto"
                  className="object-cover transition-opacity duration-300"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 text-white">
                <span className="text-[10px] uppercase font-semibold text-[var(--accent-brass)]">
                  {activeMoment.momentTag}
                </span>
                <h4 className="text-sm font-medium line-clamp-1 mt-0.5">
                  {activeMoment.sampleProduct.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-semibold tabular-numbers">
                    ₹{activeMoment.sampleProduct.price_inr}
                  </span>
                  <Link
                    href={`/product/${activeMoment.sampleProduct.slug}`}
                    className="text-xs underline text-white/90 hover:text-white ml-auto"
                  >
                    Garment specifications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
