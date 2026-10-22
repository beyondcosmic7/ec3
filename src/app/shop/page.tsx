import React from "react";
import Link from "next/link";
import {
  getFilteredProducts,
  getAllMoments,
  getAllSizes,
} from "@/server/catalog";
import { FilterBar } from "@/components/shop/filter-bar";
import { Media } from "@/components/ui/media";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";

interface ShopPageProps {
  searchParams: Promise<{
    moment?: string;
    size?: string;
    sort?: "price-asc" | "price-desc" | "newest";
    access?: "zipless" | "concealed" | "none";
  }>;
}

export const metadata = {
  title: "Shop Tailored Ethnic Sets & Kurtas — Eskort Creations",
  description:
    "Explore our complete Jaipur workshop catalogue: pure cotton suits, rayon kurtas, 3-piece Banarasi ensembles, and longline shrug sets with honest inch sizing.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = getFilteredProducts({
    moment: params.moment,
    size: params.size,
    sort: params.sort,
    feeding_access: params.access,
  });

  const moments = getAllMoments();
  const sizes = getAllSizes();

  return (
    <div className="w-full flex flex-col min-h-screen bg-[var(--canvas)]">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-12 pb-6">
        <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
          The Jaipur Atelier Collection
        </span>
        <h1 className="text-display-title font-display text-[var(--ink-primary)] mt-1">
          Tailored pieces, honest drape
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-2xl mt-2">
          Every piece is measured across the bust, waist, hip, and length in exact inches.
          No synthetic sizing codes, no vanity measurements.
        </p>
      </div>

      {/* URL-driven Filter Bar */}
      <FilterBar
        moments={moments}
        sizes={sizes}
        activeMoment={params.moment}
        activeSize={params.size}
        activeSort={params.sort}
        activeAccess={params.access}
        totalCount={products.length}
      />

      {/* Product Catalog Grid (Irregular rhythm per Section 8.3) */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {products.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <span className="text-sm font-display text-[var(--ink-primary)] text-lg mb-2">
              Nothing here yet.
            </span>
            <p className="text-xs text-[var(--ink-muted)] mb-6">
              No garments match your selected filters. Try clearing your filters or exploring our standard sizes.
            </p>
            <Link
              href="/shop"
              className="text-xs font-semibold px-4 py-2 bg-[var(--ink-primary)] text-[var(--canvas)] rounded-[var(--radius-control)]"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, idx) => {
              const firstImage = p.images[0]
                ? `/brand/products/${p.images[0]}`
                : "";
              // Irregular row rhythm: alternate aspect ratios (4:5 and 3:4)
              const isTall = idx % 3 === 0;

              return (
                <article
                  key={p.slug}
                  className="group flex flex-col bg-[var(--surface-card)] rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all"
                >
                  <Link
                    href={`/product/${p.slug}`}
                    className={`relative block w-full overflow-hidden bg-[var(--surface-subtle)] ${
                      isTall ? "aspect-[4/5]" : "aspect-[3/4]"
                    }`}
                  >
                    {firstImage && (
                      <Media
                        src={firstImage}
                        alt={p.name}
                        fill
                        aspectRatio="auto"
                        className="group-hover:scale-[1.025] transition-transform duration-700 object-cover"
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                      <span className="bg-[var(--canvas)]/90 text-[var(--ink-primary)] text-[10px] font-semibold px-2 py-0.5 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
                        {p.fabric.split(" ")[0]}
                      </span>
                      {p.feeding_access !== "none" && (
                        <span className="bg-[var(--accent-brass)] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-[var(--radius-pill)]">
                          Feeding Access
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <SelvedgeDots colors={p.print_colours} size="sm" />
                        <span className="text-[10px] text-[var(--ink-muted)]">
                          {p.moment}
                        </span>
                      </div>

                      <h2 className="text-xs sm:text-sm font-medium line-clamp-2 text-[var(--ink-primary)] group-hover:text-[var(--accent-madder)] transition-colors">
                        <Link href={`/product/${p.slug}`}>{p.name}</Link>
                      </h2>
                    </div>

                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-semibold tabular-numbers text-[var(--ink-primary)]">
                          ₹{p.price_inr}
                        </span>
                        {p.mrp_inr > p.price_inr && (
                          <span className="text-[10px] sm:text-xs text-[var(--ink-muted)] line-through tabular-numbers">
                            ₹{p.mrp_inr}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--ink-faint)]">
                        GST incl.
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
