import React from "react";
import { getAllProducts } from "@/server/catalog";
import { HeroSection } from "@/components/sections/hero-section";
import { NewInRail } from "@/components/sections/new-in-rail";
import { ByTheHour } from "@/components/sections/by-the-hour";
import { TheCloth } from "@/components/sections/the-cloth";
import { CutToLength } from "@/components/sections/cut-to-length";
import { FitInInches } from "@/components/sections/fit-in-inches";
import { CustomerVoice } from "@/components/sections/customer-voice";

export const metadata = {
  title: "Eskort Creations — Women's Ethnic Kurta Sets & Fusion Wear Tailored in Jaipur",
  description:
    "Calm, breathable women's ethnic and fusion wear. Banarasi soft silk suits, Rayon kurti sets, and cotton fabrics measured in exact inches.",
};

export default function HomePage() {
  const products = getAllProducts();
  const heroProduct =
    products.find((p) => p.slug === "ekc-1501-banarasi-silk-3piece-set") ||
    products[0];

  return (
    <div className="w-full flex flex-col">
      {/* Moment 1: Hero (Editorial Off-Axis) */}
      <HeroSection heroProduct={heroProduct} />

      {/* Moment 2: New In (Horizontal Scroll-Snap Rail) */}
      <NewInRail products={products} />

      {/* Moment 3: By the Hour (Oversized Typographic Index) */}
      <ByTheHour products={products} />

      {/* Moment 4: The Cloth (Macro Textile Focus & Care Label) */}
      <TheCloth />

      {/* Moment 5: Cut to Length (Fabric Metre Stepper) */}
      <CutToLength />

      {/* Moment 6: Fit in Inches (Inline Size Finder & Ruler) */}
      <FitInInches />

      {/* Moment 7: From Customers (Honest Reviews, hidden until 3 verified exist) */}
      <CustomerVoice reviews={[]} />
    </div>
  );
}
