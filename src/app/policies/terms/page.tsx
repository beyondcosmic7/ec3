import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";
import { brandConfig } from "@/../brand.config";

export const metadata = {
  title: "Terms & Conditions of Service — Eskort Creations",
  description: "Official statutory terms and conditions for orders placed on Eskort Creations Jaipur.",
};

export default function TermsPolicyPage() {
  return (
    <PolicyPageLayout
      title="Terms of Service & Sale"
      subtitle="Last updated: 22 October 2026 · Indian Contract Act & Legal Metrology compliant · ⟦OWNER TO CONFIRM⟧"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">1. Business Identity</h2>
        <p>
          This website is owned and operated by Eskort Creations.
        </p>
        <div className="p-4 bg-[var(--surface-subtle)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] text-xs font-mono space-y-1">
          <p>Legal Entity: {brandConfig.legal.registeredBusinessName}</p>
          <p>GSTIN: {brandConfig.legal.gstin}</p>
          <p>Registered Address: {brandConfig.legal.registeredOfficeAddress}</p>
        </div>

      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">2. Transparent Pricing &amp; GST Invoicing</h2>
        <p>
          All product prices are quoted in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST).
          A valid tax invoice containing our GSTIN, HSN classification, and state tax split (CGST+SGST or IGST) is generated sequentially for every confirmed order.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">3. Prohibition of Dark Patterns</h2>
        <p>
          In accordance with the Central Consumer Protection Authority (CCPA) Guidelines for Prevention and Regulation of Dark Patterns 2023, Eskort Creations does not engage in false urgency, drip pricing, disguised advertising, basket sneaking, or confirm shaming.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">4. Governing Jurisdiction</h2>
        <p>
          All purchase contracts, disputes, or arbitrations shall be governed exclusively by the laws of India and subject to the jurisdiction of the competent courts in Jaipur, Rajasthan.
        </p>
      </section>
    </PolicyPageLayout>
  );
}
