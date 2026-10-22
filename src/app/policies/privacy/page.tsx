import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";
import { brandConfig } from "@/../brand.config";

export const metadata = {
  title: "Privacy Notice & Data Protection — Eskort Creations",
  description: "Digital Personal Data Protection Act (DPDP Act 2023) compliant privacy policy for Eskort Creations.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      title="Privacy Notice & Data Protection"
      subtitle="Last updated: 22 October 2026 · Digital Personal Data Protection Act (DPDP 2023) compliant · ⟦OWNER TO CONFIRM⟧"
    >
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">1. Purpose-Specific Data Collection</h2>
        <p>
          We collect and process personal data exclusively for the purpose of executing orders and delivering garments to your home:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Identity &amp; Contact:</strong> Name, 10-digit mobile number, and email address.</li>
          <li><strong>Delivery Address:</strong> Street address, city, state, and 6-digit Indian PIN code.</li>
          <li><strong>Payment Tokens:</strong> Secure tokenized transaction IDs processed by RBI-licensed gateways (Razorpay). We never capture or store raw credit card numbers or banking passwords.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">2. No Third-Party Data Brokering</h2>
        <p>
          We hold a zero-tolerance policy against data brokering. Your contact information is never sold, rented, or distributed to advertising syndicates.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--ink-primary)]">3. Data Principal Rights &amp; Grievance Redressal</h2>
        <p>
          Under the DPDP Act 2023, you have the right to access your personal data, request corrections, or request deletion of non-statutory records. For any privacy queries or erasure requests, contact our Grievance Officer:
        </p>
        <div className="p-4 bg-[var(--surface-subtle)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] text-xs">
          <p><strong>Grievance Officer:</strong> {brandConfig.legal.grievanceOfficer.name}</p>
          <p><strong>Email:</strong> {brandConfig.legal.grievanceOfficer.email}</p>
          <p><strong>Physical Address:</strong> {brandConfig.legal.grievanceOfficer.address}</p>
        </div>

      </section>
    </PolicyPageLayout>
  );
}
