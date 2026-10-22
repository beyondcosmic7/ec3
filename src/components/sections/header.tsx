"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { brandConfig } from "../../../brand.config";
import { cartStore } from "@/lib/cart-store";

interface HeaderProps {
  cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveCartCount, setLiveCartCount] = useState(cartCount);

  useEffect(() => {
    const syncCount = () => setLiveCartCount(cartStore.getItemCount());
    syncCount();
    window.addEventListener("cart:update", syncCount);
    window.addEventListener("cart:add", syncCount);
    return () => {
      window.removeEventListener("cart:update", syncCount);
      window.removeEventListener("cart:add", syncCount);
    };
  }, []);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "By the hour", href: "/#by-the-hour" },
    ...(brandConfig.featureFlags.fabricByMetre
      ? [{ label: "Fabric by Metre", href: "/fabric" }]
      : []),
    { label: "Story", href: "/story" },
    { label: "Help", href: "/help" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full bg-[var(--surface-card)] border-b border-[var(--border-subtle)]"
        style={{ viewTransitionName: "site-header" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 md:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Registration Accent */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group text-decoration-none py-1"
              aria-label={`${brandConfig.name} Home`}
            >
              <Image
                src={brandConfig.assets.emblem}
                alt=""
                width={56}
                height={56}
                priority
                unoptimized
                className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 object-contain shrink-0"
              />
              <Image
                src={brandConfig.assets.textLogo}
                alt={brandConfig.name}
                width={260}
                height={120}
                priority
                unoptimized
                className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain brand-text-logo shrink-0"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-4 lg:gap-6"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors py-1 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Search, WhatsApp Concierge, Cart, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("search:toggle"));
                }
              }}
              aria-label="Open search"
              className="p-2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors rounded-[var(--radius-control)] hover:bg-[var(--surface-subtle)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              href={brandConfig.contact.whatsapp.chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center text-xs font-medium text-[var(--accent-madder)] bg-[var(--surface-subtle)] px-2.5 py-1.5 rounded-[var(--radius-control)] hover:bg-[var(--border-subtle)] transition-colors"
              aria-label="Ask concierge on WhatsApp"
            >
              WhatsApp
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("cart:open"))}
              className="relative p-2 text-[var(--ink-primary)] hover:text-[var(--accent-madder)] transition-colors flex items-center gap-1.5 interactive-press"
              aria-label={`Shopping cart containing ${liveCartCount} items`}
            >
              <span className="text-sm font-medium hidden sm:inline">Cart</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold tabular-numbers rounded-full bg-[var(--accent-madder)] text-white">
                {liveCartCount}
              </span>
            </button>


            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--ink-primary)] rounded-[var(--radius-control)] hover:bg-[var(--surface-subtle)]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Full-Screen Sheet */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-[var(--surface-card)] md:hidden flex flex-col p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-4 text-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[var(--border-subtle)] font-medium text-[var(--ink-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-3">
            <span className="text-xs text-[var(--ink-muted)]">
              Direct Atelier Assistance:
            </span>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <a href={`tel:${brandConfig.contact.voicePhones[0]}`}>
                {brandConfig.contact.voicePhones[0]}
              </a>
              <a
                href={brandConfig.contact.whatsapp.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-madder)]"
              >
                Chat on WhatsApp (+91 99291 91655)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
