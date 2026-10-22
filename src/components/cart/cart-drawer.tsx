"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Media } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { cartStore } from "@/lib/cart-store";
import { brandConfig } from "@/../brand.config";
import { X, Trash, ArrowCounterClockwise, WhatsappLogo, ArrowRight } from "@phosphor-icons/react";
import { lookupPincode } from "@/lib/pincodes";

export function CartDrawer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const [undoMessage, setUndoMessage] = useState<string | null>(null);
  const [pincode, setPincode] = useState("");
  const [pincodeFeedback, setPincodeFeedback] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      dialogRef.current?.showModal();
    };

    window.addEventListener("cart:add", handleOpen);
    window.addEventListener("cart:open", handleOpen);

    return () => {
      window.removeEventListener("cart:add", handleOpen);
      window.removeEventListener("cart:open", handleOpen);
    };
  }, []);

  const closeDrawer = () => {
    dialogRef.current?.close();
  };

  const handleRemove = (slug: string, size: string, name: string) => {
    const removed = cartStore.removeItem(slug, size);
    if (removed) {
      setUndoMessage(`Removed ${name}`);
      setTimeout(() => {
        setUndoMessage((current) => (current === `Removed ${name}` ? null : current));
      }, 5000);
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
    <dialog
      ref={dialogRef}
      onClose={() => {}}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === dialogRef.current) closeDrawer();
      }}
      className="m-0 p-0 max-w-none max-h-none w-full h-full bg-black/40 backdrop-blur-none backdrop:bg-black/40 z-50 fixed inset-0 overflow-hidden open:flex open:justify-end border-none"
    >
      <div
        className="w-full sm:max-w-md h-full bg-[var(--canvas)] flex flex-col justify-between border-l border-[var(--border-subtle)] shadow-2xl transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <Image
              src={brandConfig.assets.emblem}
              alt=""
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6 object-contain shrink-0"
            />
            <h2 className="text-base font-semibold text-[var(--ink-primary)]">Cart</h2>
            {mounted && itemCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--canvas)] border border-[var(--border-subtle)] font-mono text-[var(--ink-secondary)]">
                {itemCount} {itemCount === 1 ? "piece" : "pieces"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-control)] hover:bg-[var(--canvas)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors interactive-press"
          >
            <X size={18} />
          </button>
        </div>

        {/* Undo Notification Bar */}
        {undoMessage && (
          <div className="bg-[var(--surface-card)] px-5 py-2.5 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs animate-fadeIn">
            <span className="text-[var(--ink-secondary)] truncate max-w-[240px]">
              {undoMessage}
            </span>
            <button
              type="button"
              onClick={handleUndo}
              className="text-[var(--accent-madder)] hover:underline flex items-center gap-1 font-medium"
            >
              <ArrowCounterClockwise size={13} />
              Undo
            </button>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
              <span className="text-base font-medium text-[var(--ink-primary)] mb-1">
                Nothing here yet.
              </span>
              <p className="text-xs text-[var(--ink-muted)] mb-6 max-w-xs leading-relaxed">
                Explore hand-tailored Kurtas, pure Banarasi silk sets, and breathable combed cottons.
              </p>
              <Link href="/shop" onClick={closeDrawer}>
                <Button variant="primary" size="md">
                  Explore Shop
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 divide-y divide-[var(--border-subtle)]">
              {items.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="pt-4 first:pt-0 flex gap-3.5">
                  <div className="w-16 h-20 relative shrink-0 rounded-[var(--radius-media)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
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
                          onClick={closeDrawer}
                          className="text-xs font-semibold text-[var(--ink-primary)] hover:underline line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.slug, item.size, item.name)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[var(--ink-faint)] hover:text-[var(--accent-madder)] p-1 transition-colors interactive-press"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                      <div className="text-[11px] text-[var(--ink-muted)] mt-0.5">
                        Size: <span className="font-mono text-[var(--ink-primary)]">{item.size}</span>
                        {item.fabric && <span> · {item.fabric}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[var(--border-strong)] rounded-[var(--radius-control)] bg-[var(--canvas)]">
                        <button
                          type="button"
                          onClick={() =>
                            cartStore.updateQuantity(item.slug, item.size, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-6 h-6 flex items-center justify-center text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-bold interactive-press"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-mono text-xs text-[var(--ink-primary)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            cartStore.updateQuantity(item.slug, item.size, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-6 h-6 flex items-center justify-center text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-bold interactive-press"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold tabular-numbers text-[var(--ink-primary)]">
                        ₹{(item.price_paise * item.quantity) / 100}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Totals & CTAs) */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)] flex flex-col gap-3.5">
            {/* Pincode Estimator */}
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                placeholder="Enter delivery PIN"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ""));
                  setPincodeFeedback(null);
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-[var(--ink-primary)] font-mono focus:outline-none focus:border-[var(--ink-primary)]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium bg-[var(--ink-primary)] text-[var(--canvas)] rounded-[var(--radius-control)] hover:opacity-90 transition-opacity interactive-press"
              >
                Estimate
              </button>
            </form>
            {pincodeFeedback && (
              <span className="text-[11px] text-[var(--accent-brass)] -mt-1 font-medium">
                {pincodeFeedback}
              </span>
            )}

            {/* Price Breakdown */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>Subtotal ({itemCount} items)</span>
                <span className="tabular-numbers font-medium text-[var(--ink-primary)]">
                  ₹{subtotalInr}
                </span>
              </div>
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>Delivery across India</span>
                <span className="text-[var(--accent-brass)] font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-[var(--ink-muted)] text-[10px]">
                <span>Taxes</span>
                <span>Inclusive of all GST</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[var(--ink-primary)] pt-1.5 border-t border-[var(--border-subtle)]">
                <span>Total Amount</span>
                <span className="tabular-numbers">₹{subtotalInr}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/checkout" onClick={closeDrawer} className="w-full">
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
                  className="w-full py-2.5 px-4 rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--canvas)] text-xs font-medium text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] flex items-center justify-center gap-2 transition-colors interactive-press"
                >
                  <WhatsappLogo size={16} weight="regular" className="text-[#25D366]" />
                  <span>Order on WhatsApp</span>
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
