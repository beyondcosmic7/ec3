import React from "react";

interface Review {
  id: string;
  author: string;
  verifiedOrder: boolean;
  comment: string;
  rating: number;
  date: string;
  imageUrl?: string;
}

interface CustomerVoiceProps {
  reviews?: Review[];
}

export function CustomerVoice({ reviews = [] }: CustomerVoiceProps) {
  // Operating Rule 4 & Section 8.2: "The section is hidden entirely until at least three exist."
  if (reviews.length < 3) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-24 bg-[var(--canvas)] border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
            Verified Purchase Notes
          </span>
          <h2 className="text-heading font-display text-[var(--ink-primary)] mt-1">
            From our patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] italic mb-4">
                &ldquo;{r.comment}&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                <span className="font-semibold text-[var(--ink-primary)]">{r.author}</span>
                <span className="text-[10px] bg-[var(--surface-card)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                  Verified Order
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
