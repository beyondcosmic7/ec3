import React from "react";
import Link from "next/link";
import { getFilteredProducts } from "@/server/catalog";
import { Media } from "@/components/ui/media";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const metadata = {
  title: "Search Tailored Garments — Eskort Creations",
  description: "Search handcrafted Indian women's ethnic and fusion wear by fabric, moment, or silhouette.",
};

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const products = query ? getFilteredProducts({ query }) : [];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[var(--canvas)]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
          Search Results
        </span>
        <h1 className="text-display-title font-display text-[var(--ink-primary)] mt-1">
          {query ? `Results for “${query}”` : "Search our workshop catalogue"}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-2">
          {products.length > 0
            ? `Found ${products.length} design${products.length === 1 ? "" : "s"} matching your search.`
            : query
            ? "No garments matched your query. Try searching for broader terms like Rayon, Cotton, Kurta, or Silk."
            : "Enter a search term in the box above to find tailored ethnic pieces."}
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {products.map((p) => {
              const img = p.images[0] ? `/brand/products/${p.images[0]}` : "";
              return (
                <article
                  key={p.slug}
                  className="group flex flex-col bg-[var(--surface-card)] rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all"
                >
                  <Link
                    href={`/product/${p.slug}`}
                    className="relative block aspect-[3/4] bg-[var(--surface-subtle)] overflow-hidden"
                  >
                    {img && (
                      <Media
                        src={img}
                        alt={p.name}
                        fill
                        aspectRatio="auto"
                        className="group-hover:scale-[1.02] transition-transform duration-500 object-cover"
                      />
                    )}
                  </Link>

                  <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2">
                    <div className="flex flex-col gap-1">
                      <SelvedgeDots colors={p.print_colours} size="sm" />
                      <h2 className="text-xs sm:text-sm font-medium line-clamp-2 text-[var(--ink-primary)]">
                        <Link href={`/product/${p.slug}`}>{p.name}</Link>
                      </h2>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-sm font-semibold tabular-numbers text-[var(--ink-primary)]">
                        ₹{p.price_inr}
                      </span>
                      <span className="text-[10px] text-[var(--ink-muted)]">
                        {p.fabric.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto">
            <Link
              href="/shop"
              className="inline-block px-4 py-2 text-xs font-semibold bg-[var(--ink-primary)] text-[var(--canvas)] rounded-[var(--radius-control)]"
            >
              Explore Full Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
