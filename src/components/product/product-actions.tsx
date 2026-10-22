"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { brandConfig } from "@/../brand.config";
import { Check, WhatsappLogo } from "@phosphor-icons/react";
import { cartStore } from "@/lib/cart-store";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  // Select first in-stock size by default
  const defaultSize =
    product.sizes.find((s) => (product.stock_by_size[s] ?? 0) > 0) ||
    product.sizes[0] ||
    "M";

  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [isAdded, setIsAdded] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const currentStock = product.stock_by_size[selectedSize] ?? 0;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdded(true);

    const firstImage = product.images[0]
      ? `/brand/products/${product.images[0]}`
      : "/brand/assets/logo.svg";

    cartStore.addItem({
      slug: product.slug,
      name: product.name,
      size: selectedSize,
      quantity: 1,
      price_paise: product.price_paise,
      image: firstImage,
      fabric: product.fabric,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const whatsappAskUrl = brandConfig.contact.whatsapp.createAskUrl(
    product.name,
    product.slug,
    selectedSize
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Size Selector */}
      <div>
        <div className="flex justify-between items-baseline mb-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)]">
            Select Size
          </label>
          <span className="text-xs text-[var(--ink-muted)]">
            {isOutOfStock ? (
              <span className="text-[var(--accent-madder)]">Out of stock</span>
            ) : (
              <span>In stock ({currentStock} available)</span>
            )}
          </span>
        </div>

        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Available sizes">
          {product.sizes.map((size) => {
            const stock = product.stock_by_size[size] ?? 0;
            const isOOS = stock === 0;
            const isSelected = size === selectedSize;

            return (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isOOS}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] h-11 px-3.5 flex items-center justify-center text-xs font-semibold rounded-[var(--radius-control)] border transition-all interactive-press ${
                  isSelected
                    ? "border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--canvas)]"
                    : isOOS
                    ? "border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--ink-faint)] line-through opacity-50 cursor-not-allowed"
                    : "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--ink-primary)] hover:border-[var(--border-strong)]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {isOutOfStock ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowNotifyModal(true)}
            className="flex-1"
          >
            Size {selectedSize} is out of stock. Tell us when it&apos;s back?
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isAdded ? (
              <>
                <Check size={18} weight="bold" />
                <span>Added to Cart</span>
              </>
            ) : (
              <span>Add to Cart — ₹{product.price_inr}</span>
            )}
          </Button>
        )}

        {/* WhatsApp Direct Enquiry Button */}
        <a
          href={whatsappAskUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            <WhatsappLogo size={18} weight="regular" className="text-[#25D366]" />
            <span>Ask on WhatsApp</span>
          </Button>
        </a>
      </div>

      {/* Sticky Mobile Add Bar (Section 8.4) */}
      <div className="sm:hidden fixed bottom-[57px] inset-x-0 bg-[var(--canvas)] p-3 border-t border-[var(--border-subtle)] z-30 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-[var(--ink-muted)] block">Selected: Size {selectedSize}</span>
          <span className="text-sm font-semibold tabular-numbers text-[var(--ink-primary)]">
            ₹{product.price_inr}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={whatsappAskUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enquire on WhatsApp"
            className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-card)]"
          >
            <WhatsappLogo size={20} weight="regular" className="text-[#25D366]" />
          </a>
          <Button
            variant="primary"
            size="md"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isAdded ? "Added" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Restock Notification Dialog */}
      {showNotifyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-[var(--canvas)] p-6 rounded-[var(--radius-control)] border border-[var(--border-strong)] max-w-sm w-full">
            <h3 className="text-base font-display font-semibold text-[var(--ink-primary)] mb-2">
              Notify me when Size {selectedSize} is back
            </h3>
            <p className="text-xs text-[var(--ink-muted)] mb-4 leading-relaxed">
              We tailor pieces in small workshop batches. Enter your WhatsApp or phone number
              to receive a one-time message when this piece is replenished.
            </p>

            {notifySubmitted ? (
              <div className="p-3 bg-[var(--surface-subtle)] rounded-[var(--radius-media)] text-xs text-[var(--ink-primary)]">
                Thank you. We have logged your interest and will message you when restocked.
                <button
                  type="button"
                  onClick={() => setShowNotifyModal(false)}
                  className="mt-3 block text-xs underline font-semibold text-[var(--accent-madder)]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (notifyPhone.length >= 10) setNotifySubmitted(true);
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={notifyPhone}
                  onChange={(e) => setNotifyPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  required
                  aria-label="Mobile number for restock notification"
                  className="px-3 py-2 text-xs rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--ink-primary)]"
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="sm" className="flex-1">
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowNotifyModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
