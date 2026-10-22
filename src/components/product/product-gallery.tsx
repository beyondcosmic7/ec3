"use client";

import React, { useState } from "react";
import { Media } from "@/components/ui/media";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[selectedIndex]
    ? `/brand/products/${images[selectedIndex]}`
    : "/brand/assets/Text_Logo.png";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Primary Display Stage */}
      <div
        onClick={() => setIsZoomed(true)}
        className="relative aspect-[3/4] w-full bg-[var(--surface-subtle)] rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] cursor-zoom-in group"
      >
        <Media
          src={currentImage}
          alt={`${productName} — View ${selectedIndex + 1}`}
          fill
          isLcp
          priority
          aspectRatio="auto"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute bottom-3 right-3 z-10">
          <span className="bg-[var(--canvas)]/90 text-[var(--ink-secondary)] text-[10px] font-medium px-2 py-1 rounded-[var(--radius-pill)] border border-[var(--border-subtle)]">
            Tap to inspect (Zoom)
          </span>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Select photo ${idx + 1}`}
                className={`relative shrink-0 w-16 h-20 rounded-[var(--radius-media)] overflow-hidden border transition-all ${
                  isSelected
                    ? "border-[var(--accent-madder)] ring-1 ring-[var(--accent-madder)]"
                    : "border-[var(--border-subtle)] opacity-70 hover:opacity-100"
                }`}
              >
                <Media
                  src={`/brand/products/${img}`}
                  alt=""
                  fill
                  aspectRatio="auto"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Zoom Modal (Tap to zoom / pinch inspect) */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-resolution image zoom"
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full h-[85vh]">
            <Media
              src={currentImage}
              alt={productName}
              fill
              aspectRatio="auto"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1.5 rounded-full"
            >
              Close [Esc]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
