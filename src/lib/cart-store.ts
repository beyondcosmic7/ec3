/**
 * Eskort Creations — Client Cart Store & Synchronization
 * Section 7.8 & Section 8.6 of BUILD_PROMPT.md
 */

import { CartItem } from "./types";
import { brandConfig } from "@/../brand.config";

const CART_STORAGE_KEY = "eskort_cart_v1";

let cachedItems: CartItem[] = [];
let cachedRaw = "";
let lastRemovedItem: { item: CartItem; index: number } | null = null;

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      if (cachedItems.length > 0) cachedItems = [];
      cachedRaw = "";
      return cachedItems;
    }
    if (raw === cachedRaw) {
      return cachedItems;
    }
    cachedRaw = raw;
    cachedItems = JSON.parse(raw);
    return cachedItems;
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(items);
    cachedRaw = raw;
    cachedItems = items;
    localStorage.setItem(CART_STORAGE_KEY, raw);
    window.dispatchEvent(new CustomEvent("cart:update", { detail: { items } }));
  } catch {
    // LocalStorage quota or privacy mode error handling
  }
}

const SERVER_EMPTY: CartItem[] = [];

export const cartStore = {
  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("cart:update", callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("cart:update", callback);
      window.removeEventListener("storage", callback);
    };
  },

  getSnapshot(): CartItem[] {
    return getStoredCart();
  },

  getServerSnapshot(): CartItem[] {
    return SERVER_EMPTY;
  },

  getItems(): CartItem[] {
    return getStoredCart();
  },

  getItemCount(): number {
    const items = getStoredCart();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotalPaise(): number {
    const items = getStoredCart();
    return items.reduce((sum, item) => sum + item.price_paise * item.quantity, 0);
  },

  addItem(item: CartItem): void {
    const items = getStoredCart();
    const existingIndex = items.findIndex(
      (i) => i.slug === item.slug && i.size === item.size
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push({ ...item });
    }

    saveCart(items);
  },

  updateQuantity(slug: string, size: string, quantity: number): void {
    const items = getStoredCart();
    const target = items.find((i) => i.slug === slug && i.size === size);

    if (target) {
      if (quantity <= 0) {
        this.removeItem(slug, size);
      } else {
        target.quantity = quantity;
        saveCart(items);
      }
    }
  },

  removeItem(slug: string, size: string): CartItem | null {
    const items = getStoredCart();
    const index = items.findIndex((i) => i.slug === slug && i.size === size);

    if (index > -1) {
      const removed = items.splice(index, 1)[0];
      lastRemovedItem = { item: removed, index };
      saveCart(items);
      return removed;
    }
    return null;
  },

  undoRemove(): boolean {
    if (!lastRemovedItem) return false;
    const items = getStoredCart();
    items.splice(lastRemovedItem.index, 0, lastRemovedItem.item);
    lastRemovedItem = null;
    saveCart(items);
    return true;
  },

  clearCart(): void {
    lastRemovedItem = null;
    saveCart([]);
  },

  /**
   * Section 8.6: "Order on WhatsApp as the secondary action (prefilled cart summary to wa.me/919929191655)"
   */
  getWhatsAppOrderUrl(): string {
    const items = getStoredCart();
    if (items.length === 0) {
      return brandConfig.contact.whatsapp.chatUrl;
    }

    const lines = items.map(
      (item) => `• ${item.name} (${item.size}) × ${item.quantity} — ₹${(item.price_paise * item.quantity) / 100}`
    );
    const totalInr = this.getSubtotalPaise() / 100;

    const message = [
      "Namaste Eskort Creations, I would like to order the following items from the Jaipur atelier:",
      "",
      ...lines,
      "",
      `Total: ₹${totalInr} (Tax inclusive)`,
      "Please let me know how to proceed with payment and delivery details.",
    ].join("\n");

    return `https://wa.me/919929191655?text=${encodeURIComponent(message)}`;
  },
};
