import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";


export const metadata = {
  title: "Returns & Exchange Policy — Eskort Creations",
  description: "7-day return and size exchange guidelines with doorstep reverse pickup across India.",
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyPageLayout
      title="Returns & Exchange Policy"
      subtitle="Last updated: 22 October 2026 · Fair, transparent terms · ⟦OWNER TO CONFIRM⟧"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">1. 7-Day Exchange Window</h2>
        <p>
          We want you to feel confident in the drape and comfort of your piece. If the size or silhouette is not right, you may initiate a return or exchange within <strong>7 days of delivery</strong>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">2. Hygiene &amp; Garment Condition</h2>
        <p>
          To maintain hygiene standards for our entire community, returned pieces must be:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Unworn, unwashed, and free of perfume or deodorant marks.</li>
          <li>Accompanied by all original fabric brand tags and intact selvedge labels.</li>
          <li>Neatly folded in original workshop packaging.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">3. How to Request an Exchange</h2>
        <p>
          Simply message our atelier concierge on WhatsApp at{" "}
          <a href="https://wa.me/919929191655" className="text-[var(--accent-madder)] underline">
            +91 99291 91655
          </a>{" "}
          with your Order ID and preferred replacement size. We will book a reverse courier pickup from your doorstep.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">4. Refund Processing</h2>
        <p>
          Refunds for prepaid orders are credited back to the source bank account, UPI ID, or card within 5 to 7 working days after receipt and physical inspection at our Jaipur workshop.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
