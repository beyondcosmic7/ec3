import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Media } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { brandConfig } from "@/../brand.config";

interface HeroSectionProps {
  heroProduct: Product;
}

export function HeroSection({ heroProduct }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[82vh] flex items-end overflow-hidden bg-[var(--surface-subtle)] border-b border-[var(--border-subtle)]">
      {/* Background authentic photograph with subtle Drape effect */}
      <div className="absolute inset-0 z-0">
        <Media
          src={`/brand/products/${heroProduct.images[0] || "EKC-1501-3 piece/1.jpeg"}`}
          alt={`${heroProduct.name} Tailored in Jaipur`}
          fill
          isLcp
          priority
          aspectRatio="auto"
          className="w-full h-full object-cover object-top scale-100 hover:scale-[1.01] transition-transform duration-1000 ease-out"
        />

        {/* Functional gradient scrim for text legibility (Section 6.5 allowed exception) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
      </div>

      {/* Off-axis lower-left content container with Rise motion */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 text-white">
        <div className="max-w-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
              Jaipur Workroom · Authentic Tailoring
            </span>
            <span className="text-white/40">·</span>
            <SelvedgeDots colors={["#C73E1D", "#F4A261", "#DDA15E"]} size="sm" />
          </div>

          <h1 className="text-display-hero font-display text-white">
            Unrushed cotton, measured in inches.
          </h1>

          <p className="text-body text-white/90 max-w-xl text-sm sm:text-base leading-relaxed">
            Pure Banarasi soft silk, breathable combed cotton, and tailored rayon.
            Real seam margins, honest garment measurements, and zero synthetic hype.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={`/product/${heroProduct.slug}`}>
              <Button variant="primary" size="lg">
                Explore Festive Set — ₹{heroProduct.price_inr}
              </Button>
            </Link>
            <a
              href={brandConfig.contact.whatsapp.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                Ask Atelier on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
