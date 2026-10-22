import React from "react";
import { PolicyPageLayout } from "@/components/ui/policy-page-layout";
import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions — Eskort Creations",
  description: "Common questions about tailoring, ordering, WhatsApp concierge, and Indian delivery.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Where are Eskort Creations garments tailored?",
      a: "All our pieces are designed, hand-patterned, and tailored at our workshop in Jaipur, Rajasthan, using authentic weaves and local artisan stitching.",
    },
    {
      q: "How do I choose the right size?",
      a: "We recommend measuring your natural body bust in inches and adding 2 inches for standard ease. You can also view exact flat garment measurements for every size on any product page.",
    },
    {
      q: "What payment modes are supported?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all Debit and Credit Cards, Netbanking across 50+ banks via Razorpay, and Cash on Delivery (COD) for serviceable Indian pincodes.",
    },
    {
      q: "Why is there a ₹50 fee for Cash on Delivery?",
      a: "COD incurs extra courier cash-collection fees and verification steps. We maintain full transparency by showing the ₹50 fee before you choose COD. Prepaid orders above ₹999 ship free.",
    },
    {
      q: "Can I place an order or ask questions via WhatsApp?",
      a: "Yes! WhatsApp is our primary channel. You can message our Jaipur atelier directly at +91 99291 91655 for fabric close-ups, delivery updates, or custom sizing requests.",
    },
    {
      q: "What is your exchange and return policy?",
      a: "We offer an easy 7-day exchange and return window from the date of delivery. Pieces must be unworn and unwashed with original brand tags attached.",
    },
  ];

  return (
    <PolicyPageLayout
      title="Frequently Asked Questions"
      subtitle="Clear, direct answers about our garments, sizing, ordering, and Jaipur workshop dispatch"
    >
      <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-5 flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-[var(--ink-primary)]">
              {faq.q}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="p-5 mt-6 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-[var(--ink-primary)] block">
            Have a question not listed here?
          </span>
          <span className="text-[var(--ink-muted)]">
            Our workshop team is available on WhatsApp and telephone.
          </span>
        </div>
        <Link
          href="/contact"
          className="shrink-0 px-4 py-2 bg-[var(--ink-primary)] text-[var(--canvas)] rounded-[var(--radius-control)] text-xs font-semibold text-center"
        >
          Contact Atelier
        </Link>
      </div>
    </PolicyPageLayout>
  );
}
