import React from "react";
import Link from "next/link";
import Image from "next/image";
import { brandConfig } from "../../../brand.config";
import { SelvedgeDots } from "../ui/selvedge-dots";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--surface-subtle)] border-t border-[var(--border-subtle)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={brandConfig.assets.emblem}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0"
              />
              <Image
                src={brandConfig.assets.textLogo}
                alt={brandConfig.name}
                width={220}
                height={100}
                unoptimized
                className="h-8 sm:h-10 w-auto object-contain brand-text-logo shrink-0"
              />
            </Link>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              {brandConfig.tagline} Honest measurements, pure fabrics, and
              respect for everyday women.
            </p>
          </div>

          {/* Customer Care & WCAG 3.2.6 Consistent Contact Block */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
              Direct Contact
            </h4>
            <ul className="text-xs text-[var(--ink-secondary)] space-y-1.5">
              <li>
                Voice:{" "}
                <a
                  href={`tel:${brandConfig.contact.voicePhones[0]}`}
                  className="hover:underline"
                >
                  {brandConfig.contact.voicePhones[0]}
                </a>
              </li>
              <li>
                Voice:{" "}
                <a
                  href={`tel:${brandConfig.contact.voicePhones[1]}`}
                  className="hover:underline"
                >
                  {brandConfig.contact.voicePhones[1]}
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href={brandConfig.contact.whatsapp.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-madder)] hover:underline font-medium"
                >
                  {brandConfig.contact.whatsapp.displayNumber}
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href={`mailto:${brandConfig.contact.email}`}
                  className="hover:underline"
                >
                  {brandConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Commerce Terms */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
              Policies
            </h4>
            <ul className="text-xs text-[var(--ink-secondary)] space-y-1.5">
              <li>
                <Link href="/policies/shipping" className="hover:underline">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:underline">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:underline">
                  Privacy Policy (DPDP)
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:underline font-medium text-[var(--accent-madder)]">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Metrology & Statutory Info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
              Statutory Declarations
            </h4>
            <div className="text-xs text-[var(--ink-muted)] space-y-1">
              <p>Legal Name: {brandConfig.legal.registeredBusinessName}</p>
              <p>GSTIN: {brandConfig.legal.gstin}</p>
              <p>Registered Address: {brandConfig.legal.registeredOfficeAddress}</p>
              <p>Country of Origin: India</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-wrap justify-between items-center gap-4 text-xs text-[var(--ink-muted)]">
          <p>© {new Date().getFullYear()} {brandConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Prices inclusive of all taxes (GST)</span>
            <span>·</span>
            <SelvedgeDots size="sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
