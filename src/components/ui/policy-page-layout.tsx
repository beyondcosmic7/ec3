import React from "react";
import Link from "next/link";
import { SelvedgeDots } from "./selvedge-dots";

interface PolicyPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PolicyPageLayout({
  title,
  subtitle,
  children,
}: PolicyPageLayoutProps) {
  return (
    <div className="w-full flex flex-col bg-[var(--canvas)] min-h-screen">
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6 text-xs text-[var(--ink-muted)]">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--ink-primary)]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--ink-primary)] font-medium">{title}</li>
        </ol>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
            Policy &amp; Legal Compliance
          </span>
          <span className="text-[var(--ink-faint)]">·</span>
          <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
        </div>

        <h1 className="text-display-title font-display text-[var(--ink-primary)] mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] mb-8">
            {subtitle}
          </p>
        )}

        <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed flex flex-col gap-6 pt-4 border-t border-[var(--border-subtle)]">
          {children}
        </div>
      </main>
    </div>
  );
}
