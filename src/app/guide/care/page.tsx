import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";

export const metadata = {
  title: "Fabric Care Guide — Eskort Creations",
  description: "Artisanal care guidelines for pure combed cotton, viscose rayon, and Banarasi soft silk.",
};

export default function CareGuidePage() {
  return (
    <PolicyPageLayout
      title="Textile & Fabric Care Guide"
      subtitle="Preserving the weave, natural drape, and artisanal dye vibrancy of your Jaipur garments"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">1. Viscose Rayon Kurtas &amp; Co-ord Sets</h2>
        <p>
          Rayon is a breathable regenerated cellulose fibre with exceptional drape. To prolong its lifespan:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Wash:</strong> Gentle machine wash in cold water or mild hand wash.</li>
          <li><strong>Detergent:</strong> Use liquid detergent free of optical brighteners.</li>
          <li><strong>Drying:</strong> Dry flat or hang on a padded hanger in the shade. Do not wring aggressively.</li>
          <li><strong>Ironing:</strong> Warm iron on reverse while slightly damp.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">2. 100% Pure Combed Cotton</h2>
        <p>
          Our cottons are breathable 60×60 cambric weaves. They soften beautifully with each wash:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>First Wash:</strong> Wash separately in cold water with a pinch of rock salt to set natural dye pigments.</li>
          <li><strong>Shrinkage:</strong> All fabrics are pre-washed and stabilized to ensure less than 2% shrinkage.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">3. Banarasi Soft Silk &amp; Woven Zari Pieces</h2>
        <p>
          Ensembles featuring metallic Zari threads and silk brocade require dedicated care:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Cleaning:</strong> Professional dry cleaning only.</li>
          <li><strong>Storage:</strong> Wrap in pure unbleached muslin cloth with natural neem leaves. Avoid plastic zip covers that trap moisture.</li>
        </ul>
      </section>
    </PolicyPageLayout>
  );
}
