import React from "react";
import Link from "next/link";
import { brandConfig } from "@/../brand.config";
import {
  WhatsappLogo,
  Phone,
  EnvelopeSimple,
  Truck,
  ArrowsClockwise,
  Ruler,
  Drop,
  Question,
  ChatCircleText,
  ShieldCheck,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Atelier Help & Customer Care Hub — Eskort Creations",
  description:
    "Direct Jaipur atelier assistance. Honest sizing guidance, live order tracking, fabric care, and simple return policies.",
};

export default function HelpHubPage() {
  const quickHelpCards = [
    {
      title: "Track Your Order",
      desc: "Check live dispatch progress, courier docket details, and estimated delivery dates.",
      href: "/track",
      icon: <Truck size={22} className="text-[var(--accent-madder)]" />,
      actionText: "Track Parcel",
    },
    {
      title: "Sizing & Measurements",
      desc: "Every garment measured in exact inches (bust, waist, hip, length). No guesswork.",
      href: "/guide/sizing",
      icon: <Ruler size={22} className="text-[var(--accent-brass)]" />,
      actionText: "View Size Tables",
    },
    {
      title: "Fabric Care Guidelines",
      desc: "Care techniques for 60×60 cambric cotton, viscose rayon, and Banarasi zari pieces.",
      href: "/guide/care",
      icon: <Drop size={22} className="text-[var(--accent-indigo)]" />,
      actionText: "Read Care Rules",
    },
    {
      title: "Returns & Exchanges",
      desc: "Simple 7-day pickup window for size swaps or honest returns. Zero hassle.",
      href: "/policies/returns",
      icon: <ArrowsClockwise size={22} className="text-[var(--ink-secondary)]" />,
      actionText: "Return Policy",
    },
    {
      title: "Frequently Asked Questions",
      desc: "Clear answers on Cash on Delivery fees, dispatch timelines, and fabric quality.",
      href: "/faq",
      icon: <Question size={22} className="text-[var(--accent-madder)]" />,
      actionText: "Read FAQs",
    },
    {
      title: "Write to Our Workroom",
      desc: "Send a direct message or custom tailoring inquiry to our Jaipur workshop team.",
      href: "/contact",
      icon: <ChatCircleText size={22} className="text-[var(--accent-brass)]" />,
      actionText: "Open Contact Form",
    },
  ];

  return (
    <div className="w-full bg-[var(--canvas)] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs text-[var(--ink-muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--ink-primary)]">Home</Link>
          <span>/</span>
          <span className="text-[var(--ink-primary)] font-medium">Help &amp; Customer Care</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        {/* Page Title */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase font-medium tracking-wide text-[var(--accent-brass)]">
            Jaipur Atelier Assistance
          </span>
          <h1 className="text-display-title font-display text-[var(--ink-primary)] mt-1">
            How can our workroom assist you?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-3 leading-relaxed">
            Real human answers directly from our tailoring workroom. Whether you need exact garment measurements
            before ordering, help with fabric selection, or tracking assistance, we are ready to help.
          </p>
        </div>

        {/* Direct Contact Banner (WCAG 3.2.6 Consistent Contact Channels) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {/* WhatsApp Direct */}
          <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#128C7E]">
                <WhatsappLogo size={20} weight="regular" />
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  WhatsApp Concierge
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
                Fastest channel for sizing advice, photos, or custom fabric lengths.
              </p>
            </div>
            <a
              href={brandConfig.contact.whatsapp.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#128C7E] hover:underline"
            >
              Chat on WhatsApp ({brandConfig.contact.whatsapp.displayNumber})
            </a>
          </div>

          {/* Voice Calls */}
          <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[var(--ink-primary)]">
                <Phone size={20} />
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  Direct Phone Lines
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
                Speak directly with our workroom team during business hours.
              </p>
            </div>
            <div className="flex flex-col gap-1 text-xs font-medium text-[var(--ink-primary)]">
              {brandConfig.contact.voicePhones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:underline">
                  {phone}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Email */}
          <div className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[var(--ink-primary)]">
                <EnvelopeSimple size={20} />
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  Email Support
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
                For order receipts, tax invoices, and formal inquiries.
              </p>
            </div>
            <a
              href={`mailto:${brandConfig.contact.email}`}
              className="text-xs font-semibold text-[var(--accent-madder)] hover:underline"
            >
              {brandConfig.contact.email}
            </a>
          </div>
        </div>

        {/* Quick Help Categories Grid */}
        <div className="mb-14">
          <h2 className="text-heading font-display text-[var(--ink-primary)] mb-6">
            Helpful resources &amp; self-service guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickHelpCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="p-5 rounded-[var(--radius-control)] bg-[var(--surface-card)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-madder)] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-[var(--accent-madder)]">
                  {card.actionText} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Common Help Questions (Accordion Details) */}
        <div className="max-w-3xl">
          <h2 className="text-heading font-display text-[var(--ink-primary)] mb-4">
            Commonly asked questions
          </h2>
          <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
            <details className="py-4 group">
              <summary className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)] cursor-pointer list-none flex items-center justify-between">
                <span>How accurate are your garment measurements?</span>
                <span className="text-[var(--ink-muted)] group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-xs text-[var(--ink-secondary)] mt-2 leading-relaxed pl-1">
                Every single garment listing displays exact physical measurements in inches (bust, waist, hip, and length).
                Our pieces include an internal 1.5-inch let-out seam allowance for easy local tailoring if ever needed.
              </p>
            </details>

            <details className="py-4 group">
              <summary className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)] cursor-pointer list-none flex items-center justify-between">
                <span>What are your delivery times across India?</span>
                <span className="text-[var(--ink-muted)] group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-xs text-[var(--ink-secondary)] mt-2 leading-relaxed pl-1">
                Orders are packed and dispatched from Jaipur within 24 to 48 hours. Metro cities typically receive deliveries
                within 3 to 5 business days, while other regions take 4 to 7 business days. You will receive a tracking link via email and WhatsApp.
              </p>
            </details>

            <details className="py-4 group">
              <summary className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)] cursor-pointer list-none flex items-center justify-between">
                <span>Do you offer Cash on Delivery (COD)?</span>
                <span className="text-[var(--ink-muted)] group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-xs text-[var(--ink-secondary)] mt-2 leading-relaxed pl-1">
                Yes, COD is available for eligible Indian pincodes on orders up to ₹10,000. A transparent nominal ₹50 handling
                fee is displayed upfront before selection. All prepaid payments (UPI, Cards, Netbanking) enjoy zero fee.
              </p>
            </details>

            <details className="py-4 group">
              <summary className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)] cursor-pointer list-none flex items-center justify-between">
                <span>What is your return or exchange policy?</span>
                <span className="text-[var(--ink-muted)] group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-xs text-[var(--ink-secondary)] mt-2 leading-relaxed pl-1">
                We accept returns and size exchanges within 7 calendar days of delivery for unworn, unwashed pieces with original tags attached.
                Doorstep pickup is arranged through our national courier partners.
              </p>
            </details>
          </div>
        </div>

        {/* Legal Policies Quick Links Footer Bar */}
        <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-4 text-xs text-[var(--ink-muted)]">
          <span>Official Policies:</span>
          <Link href="/policies/shipping" className="hover:text-[var(--ink-primary)] underline">
            Shipping &amp; Delivery
          </Link>
          <span>·</span>
          <Link href="/policies/returns" className="hover:text-[var(--ink-primary)] underline">
            Returns &amp; Exchanges
          </Link>
          <span>·</span>
          <Link href="/policies/privacy" className="hover:text-[var(--ink-primary)] underline">
            Privacy Policy (DPDP)
          </Link>
          <span>·</span>
          <Link href="/policies/terms" className="hover:text-[var(--ink-primary)] underline">
            Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}
