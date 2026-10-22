import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";

export const metadata = {
  title: "Shipping & Delivery Policy — Eskort Creations",
  description: "Transit timelines, dispatch protocols, and delivery terms for Eskort Creations Jaipur.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      title="Shipping & Delivery Policy"
      subtitle="Last updated: 22 October 2026 · Built for Indian Commerce compliance · ⟦OWNER TO CONFIRM⟧"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">1. Dispatch from Jaipur Workshop</h2>
        <p>
          All garments are pressed, thread-finished, and inspected at our Jaipur workshop prior to packaging.
          Orders dispatch within 24 to 48 hours of confirmation (excluding Sundays and national holidays).
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">2. Shipping Charges</h2>
        <p>
          <strong>Prepaid Orders (UPI, Cards, Netbanking):</strong> Free standard shipping across India on all orders of ₹999 or above. Orders below ₹999 incur a flat nominal shipping fee of ₹70.
        </p>
        <p>
          <strong>Cash on Delivery (COD):</strong> Available for eligible Indian pincodes with a flat ₹50 verification fee clearly displayed before order placement.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">3. Transit Estimates by Region</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li><strong>Rajasthan &amp; NCR:</strong> 2 to 3 business days</li>
          <li><strong>Major Metros (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad):</strong> 3 to 4 business days</li>
          <li><strong>Rest of India:</strong> 4 to 6 business days</li>
          <li><strong>North-East &amp; Remote Pincodes:</strong> 5 to 8 business days via express air or Speed Post</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">4. Tracking &amp; WhatsApp Updates</h2>
        <p>
          As soon as your shipment is dispatched, a tracking link is generated and sent directly to your registered WhatsApp number and email.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
