import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col bg-[var(--canvas)] animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[60vh] bg-[var(--surface-subtle)] flex items-end p-8">
        <div className="max-w-xl w-full flex flex-col gap-4">
          <div className="w-32 h-4 bg-[var(--border-subtle)] rounded-full" />
          <div className="w-3/4 h-10 bg-[var(--border-subtle)] rounded-[var(--radius-media)]" />
          <div className="w-1/2 h-5 bg-[var(--border-subtle)] rounded-[var(--radius-media)]" />
          <div className="w-40 h-10 bg-[var(--border-subtle)] rounded-[var(--radius-control)]" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="w-48 h-6 bg-[var(--surface-subtle)] rounded-[var(--radius-media)] mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[4/5] bg-[var(--surface-subtle)] rounded-[var(--radius-media)]" />
              <div className="w-3/4 h-4 bg-[var(--surface-subtle)] rounded-[var(--radius-media)]" />
              <div className="w-1/3 h-4 bg-[var(--surface-subtle)] rounded-[var(--radius-media)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
