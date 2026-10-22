"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface FilterBarProps {
  moments: string[];
  sizes: string[];
  activeMoment?: string;
  activeSize?: string;
  activeSort?: string;
  activeAccess?: string;
  totalCount: number;
}

export function FilterBar({
  moments,
  sizes,
  activeMoment,
  activeSize,
  activeSort,
  activeAccess,
  totalCount,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, val: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    activeMoment || activeSize || activeAccess || activeSort
  );

  return (
    <div className="w-full py-4 border-b border-[var(--border-subtle)] bg-[var(--canvas)] sticky top-[57px] z-20 backdrop-blur-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Moment Filter */}
          <select
            value={activeMoment || "all"}
            onChange={(e) => updateParam("moment", e.target.value)}
            aria-label="Filter by moment"
            className="px-2.5 py-1.5 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink-primary)] font-medium focus:outline-none focus:border-[var(--ink-primary)]"
          >
            <option value="all">All Moments</option>
            {moments.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Size Filter */}
          <select
            value={activeSize || "all"}
            onChange={(e) => updateParam("size", e.target.value)}
            aria-label="Filter by size"
            className="px-2.5 py-1.5 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink-primary)] font-medium focus:outline-none focus:border-[var(--ink-primary)]"
          >
            <option value="all">All Sizes</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                Size {s}
              </option>
            ))}
          </select>

          {/* Feeding Access Filter */}
          <select
            value={activeAccess || "all"}
            onChange={(e) => updateParam("access", e.target.value)}
            aria-label="Filter by feeding access"
            className="px-2.5 py-1.5 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink-primary)] font-medium focus:outline-none focus:border-[var(--ink-primary)]"
          >
            <option value="all">Feeding: All</option>
            <option value="none">Standard Garment</option>
            <option value="concealed">Concealed Access</option>
            <option value="zipless">Zipless Overlap</option>
          </select>

          {/* Sort Selector */}
          <select
            value={activeSort || "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
            aria-label="Sort products"
            className="px-2.5 py-1.5 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink-primary)] font-medium focus:outline-none focus:border-[var(--ink-primary)]"
          >
            <option value="newest">Featured &amp; Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-[var(--accent-madder)] hover:underline ml-1"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Total Count Note */}
        <div className="text-xs text-[var(--ink-muted)]">
          Showing <span className="font-semibold text-[var(--ink-primary)]">{totalCount}</span>{" "}
          tailored designs
        </div>
      </div>
    </div>
  );
}
