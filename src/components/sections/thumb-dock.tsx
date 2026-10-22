"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "../../../brand.config";
import { cartStore } from "@/lib/cart-store";

interface ThumbDockProps {
  cartCount?: number;
}

export function ThumbDock({ cartCount = 0 }: ThumbDockProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [liveCartCount, setLiveCartCount] = useState(cartCount);

  // Absent on checkout pages
  const isCheckout = pathname?.startsWith("/checkout");

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

  useEffect(() => {
    if (isCheckout) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down -> hide
        setVisible(false);
      } else {
        // Scrolling up -> show
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isCheckout]);

  if (isCheckout) return null;

  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--surface-card)] border-t border-[var(--border-subtle)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-label="Quick mobile navigation"
    >
      <div className="grid grid-cols-4 h-14 items-center text-center text-xs">
        <Link
          href="/shop"
          className="flex flex-col items-center justify-center h-full text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Shop</span>
        </Link>

        <Link
          href="/search"
          className="flex flex-col items-center justify-center h-full text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
        </Link>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("cart:open"))}
          aria-label={`Shopping cart containing ${liveCartCount} items`}
          className="relative flex flex-col items-center justify-center h-full text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] interactive-press"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Cart</span>
          {liveCartCount > 0 && (
            <span className="absolute top-1 right-1/4 min-w-[16px] h-4 text-[10px] leading-4 px-1 font-bold text-white bg-[var(--accent-madder)] rounded-full">
              {liveCartCount}
            </span>
          )}
        </button>

        <a
          href={brandConfig.contact.whatsapp.chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-full text-[var(--accent-madder)] font-medium"
        >
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}

export default ThumbDock;
