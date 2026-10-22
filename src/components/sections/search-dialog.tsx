"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchResultItem {
  slug: string;
  name: string;
  fabric: string;
  price_inr: number;
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchResultItem[]>([]);
  const router = useRouter();

  // Listen for search toggle events from header or thumb dock
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("search:toggle", handleToggle);
    return () => window.removeEventListener("search:toggle", handleToggle);
  }, []);

  // Preload catalog once when dialog is opened
  useEffect(() => {
    if (!isOpen) return;
    fetch("/brand/products.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split(/\r?\n/).slice(1);
        const items: SearchResultItem[] = [];
        for (const line of lines) {
          if (!line.trim()) continue;
          const parts = line.split(",");
          const slug = parts[0];
          const name = parts[1]?.replace(/^"|"$/g, "");
          const fabric = parts[11]?.replace(/^"|"$/g, "");
          const price = parseFloat(parts[5]);
          if (slug && name) {
            items.push({ slug, name, fabric: fabric || "Textile", price_inr: price || 0 });
          }
        }
        setCatalog(items);
      })
      .catch(() => {});
  }, [isOpen]);

  const suggestions = query.trim()
    ? catalog
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.fabric.toLowerCase().includes(query.toLowerCase()) ||
            item.slug.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catalogue Search"
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-16 sm:pt-24 px-4"
    >
      <div className="bg-[var(--canvas)] rounded-[var(--radius-control)] border border-[var(--border-strong)] max-w-xl w-full p-4 sm:p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <span className="text-xs font-semibold uppercase text-[var(--accent-brass)]">
            Workshop Catalogue Search
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close search"
            className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <MagnifyingGlass
            size={18}
            weight="regular"
            className="absolute left-3 text-[var(--ink-muted)] pointer-events-none"
          />
          <input
            type="search"
            autoFocus
            placeholder="Search by fabric, cut, or occasion (e.g. Banarasi, Rayon, Cotton)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search query"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--ink-primary)] focus:outline-none focus:border-[var(--ink-primary)]"
          />
        </form>

        {/* Instant Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] pt-2">
            <span className="text-[10px] text-[var(--ink-muted)] pb-2 font-mono uppercase">
              Instant Matches
            </span>
            {suggestions.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-2 flex items-center justify-between hover:bg-[var(--surface-subtle)] rounded-[var(--radius-media)] transition-colors text-xs"
              >
                <div>
                  <span className="font-medium text-[var(--ink-primary)] block">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[var(--ink-muted)]">
                    {item.fabric}
                  </span>
                </div>
                <span className="font-semibold tabular-numbers text-[var(--ink-primary)]">
                  ₹{item.price_inr}
                </span>
              </Link>
            ))}
          </div>
        )}

        {query.trim() && suggestions.length === 0 && (
          <div className="text-center py-4 text-xs text-[var(--ink-muted)]">
            Press Enter to search all results for &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
