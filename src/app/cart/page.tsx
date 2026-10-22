"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Media } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { SelvedgeDots } from "@/components/ui/selvedge-dots";
import { cartStore } from "@/lib/cart-store";
import { brandConfig } from "@/../brand.config";
import {
  Trash,
  ArrowCounterClockwise,
  WhatsappLogo,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { lookupPincode } from "@/lib/pincodes";

export default function CartPage() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const [undoMessage, setUndoMessage] = useState<string | null>(null);
  const [pincode, setPincode] = useState("");
  const [pincodeFeedback, setPincodeFeedback] = useState<string | null>(null);

  const handleRemove = (slug: string, size: string, name: string) => {
    const removed = cartStore.removeItem(slug, size);
    if (removed) {
      setUndoMessage(`Removed ${name}`);
      setTimeout(() => setUndoMessage(null), 5000);
    }
  };

  const handleUndo = () => {
    cartStore.undoRemove();
    setUndoMessage(null);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const info = lookupPincode(pincode);
    if (!info.valid) {
      setPincodeFeedback("That pincode needs 6 digits.");
    } else {
      setPincodeFeedback(`Delivery to ${info.city}, ${info.state} in ${info.etaDays}. Free shipping.`);
    }
  };

  const subtotalPaise = cartStore.getSubtotalPaise();
  const subtotalInr = Math.round(subtotalPaise / 100);
  const itemCount = cartStore.getItemCount();

  return (
    <div className="w-full min-h-[70vh] bg-[var(--canvas)] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Header */}
        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--ink-muted)]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[var(--ink-primary)] font-medium">Cart</span>
          <span>·</span>
          <SelvedgeDots colors={["#943843", "#A67C38", "#3D5A80"]} size="sm" />
        </div>

        <h1 className="text-display-title font-display text-[var(--ink-primary)] mb-8">
          Your Cart {itemCount > 0 && <span className="text-xl font-normal text-[var(--ink-muted)]">({itemCount} {itemCount === 1 ? "piece" : "pieces"})</span>}
        </h1>

        {/* Undo Banner */}
        {undoMessage && (
          <div className="bg-[var(--surface-subtle)] p-4 rounded-[var(--radius-control)] border border-[var(--border-subtle)] flex items-center justify-between text-xs mb-6">
            <span className="text-[var(--ink-primary)]">{undoMessage}</span>
            <button
              type="button"
              onClick={handleUndo}
              className="text-[var(--accent-madder)] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowCounterClockwise size={14} />
              Undo removal
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-[var(--surface-subtle)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-12 text-center flex flex-col items-center justify-center">
            <Image
              src={brandConfig.assets.emblem}
              alt=""
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 object-contain mb-4"
            />
            <h2 className="text-xl font-display text-[var(--ink-primary)] mb-2">
              Nothing here yet.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-md mb-6 leading-relaxed">
              Your cart is currently empty. Explore our collection of breathable Jaipur kurtas, coordinated 2-piece sets, and authentic Banarasi silk ensembles.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Explore Shop Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] overflow-hidden">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="p-4 sm:p-6 flex gap-4">
                    <div className="w-20 h-26 sm:w-24 sm:h-32 relative shrink-0 rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
                      <Media
                        src={item.image}
                        alt={item.name}
                        fill
                        aspectRatio="auto"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold text-[var(--ink-primary)] hover:underline line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.slug, item.size, item.name)}
                            aria-label={`Remove ${item.name}`}
                            className="text-[var(--ink-faint)] hover:text-[var(--accent-madder)] p-1 transition-colors interactive-press"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                        <div className="text-xs text-[var(--ink-muted)] mt-1">
                          Size: <span className="font-mono font-medium text-[var(--ink-primary)]">{item.size}</span>
                          {item.fabric && <span> · {item.fabric}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-[var(--border-strong)] rounded-[var(--radius-control)] bg-[var(--canvas)]">
                          <button
                            type="button"
                            onClick={() => cartStore.updateQuantity(item.slug, item.size, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-bold interactive-press"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-mono text-xs text-[var(--ink-primary)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => cartStore.updateQuantity(item.slug, item.size, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-bold interactive-press"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm sm:text-base font-semibold tabular-numbers text-[var(--ink-primary)]">
                          ₹{(item.price_paise * item.quantity) / 100}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Pincode Checker */}
              <div className="p-4 sm:p-5 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--ink-primary)]">
                  Delivery Turnaround &amp; COD Availability
                </span>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit PIN code"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""));
                      setPincodeFeedback(null);
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium bg-[var(--ink-primary)] text-[var(--canvas)] rounded-[var(--radius-control)] hover:opacity-90 transition-opacity interactive-press"
                  >
                    Check PIN
                  </button>
                </form>
                {pincodeFeedback && (
                  <span className="text-xs text-[var(--accent-brass)] font-medium mt-1">
                    ✓ {pincodeFeedback}
                  </span>
                )}
              </div>
            </div>

            {/* Summary & Checkout Actions */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
              <div className="bg-[var(--surface-card)] rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="text-sm font-semibold text-[var(--ink-primary)] pb-3 border-b border-[var(--border-subtle)]">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between text-[var(--ink-secondary)]">
                    <span>Items Subtotal</span>
                    <span className="tabular-numbers font-medium text-[var(--ink-primary)]">
                      ₹{subtotalInr}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--ink-secondary)]">
                    <span>Shipping across India</span>
                    <span className="text-[var(--accent-brass)] font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-[var(--ink-muted)] text-[11px]">
                    <span>Statutory GST</span>
                    <span>Inclusive in all prices</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[var(--ink-primary)] pt-3 border-t border-[var(--border-subtle)]">
                    <span>Total Due</span>
                    <span className="tabular-numbers">₹{subtotalInr}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/checkout" className="w-full">
                    <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>

                  <a
                    href={cartStore.getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <button
                      type="button"
                      className="w-full py-3 px-4 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-xs font-semibold text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] flex items-center justify-center gap-2 transition-colors interactive-press"
                    >
                      <WhatsappLogo size={16} weight="regular" className="text-[#25D366]" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </a>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col gap-3 text-xs text-[var(--ink-secondary)]">
                <div className="flex items-center gap-2.5">
                  <Truck size={18} className="text-[var(--accent-madder)] shrink-0" />
                  <span>Free tracked courier delivery across all Indian pincodes.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ArrowsClockwise size={18} className="text-[var(--accent-brass)] shrink-0" />
                  <span>7-day easy exchange for size adjustment with 1.5&quot; internal seam margins.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-[var(--accent-ink)] shrink-0" />
                  <span>Authentic Jaipur workshop craftsmanship. 100% genuine cottons &amp; silks.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
