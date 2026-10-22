import { describe, it, expect } from "vitest";
import {
  getAllProducts,
  getProductBySlug,
  getFilteredProducts,
  getAllMoments,
  getAllFabrics,
  getAllSizes,
} from "../src/server/catalog";

describe("Catalog Data Repository & CSV Parser", () => {
  it("should successfully parse brand/products.csv without errors", () => {
    const products = getAllProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it("should calculate integer paise for all prices", () => {
    const products = getAllProducts();
    for (const p of products) {
      expect(Number.isInteger(p.price_paise)).toBe(true);
      expect(Number.isInteger(p.mrp_paise)).toBe(true);
      expect(p.price_paise).toBe(Math.round(p.price_inr * 100));
      expect(p.mrp_paise).toBe(Math.round(p.mrp_inr * 100));
    }
  });

  it("should parse measurements in inches", () => {
    const products = getAllProducts();
    for (const p of products) {
      expect(typeof p.garment_measurements_in).toBe("object");
      const sizeKeys = Object.keys(p.garment_measurements_in);
      expect(sizeKeys.length).toBeGreaterThan(0);
      const firstSize = p.garment_measurements_in[sizeKeys[0]];
      expect(firstSize.length).toBeGreaterThan(0);
      expect(firstSize.bust).toBeGreaterThan(0);
    }
  });

  it("should parse authentic print registration colors", () => {
    const products = getAllProducts();
    for (const p of products) {
      expect(Array.isArray(p.print_colours)).toBe(true);
      expect(p.print_colours.length).toBeGreaterThan(0);
      for (const hex of p.print_colours) {
        expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it("should fetch specific product by slug", () => {
    const p = getProductBySlug("ekc-1501-banarasi-silk-3piece-set");
    expect(p).toBeDefined();
    expect(p?.name).toContain("Banarasi Soft Silk");
    expect(p?.price_inr).toBe(1799);
    expect(p?.price_paise).toBe(179900);
  });

  it("should filter products by moment and size", () => {
    const dailyItems = getFilteredProducts({ moment: "Daily Comfort" });
    expect(dailyItems.length).toBeGreaterThan(0);
    for (const item of dailyItems) {
      expect(item.moment).toBe("Daily Comfort");
    }

    const xlItems = getFilteredProducts({ size: "XL" });
    expect(xlItems.length).toBeGreaterThan(0);
    for (const item of xlItems) {
      expect(item.sizes).toContain("XL");
    }
  });

  it("should search products by text query", () => {
    const results = getFilteredProducts({ query: "banarasi" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe("ekc-1501-banarasi-silk-3piece-set");
  });

  it("should sort products by price ascending and descending", () => {
    const asc = getFilteredProducts({ sort: "price-asc" });
    expect(asc[0].price_inr).toBeLessThanOrEqual(asc[asc.length - 1].price_inr);

    const desc = getFilteredProducts({ sort: "price-desc" });
    expect(desc[0].price_inr).toBeGreaterThanOrEqual(desc[desc.length - 1].price_inr);
  });

  it("should extract moments, fabrics, and sizes list", () => {
    const moments = getAllMoments();
    expect(moments).toContain("Daily Comfort");
    expect(moments).toContain("Festive Celebrations");

    const fabrics = getAllFabrics();
    expect(fabrics.length).toBeGreaterThan(0);

    const sizes = getAllSizes();
    expect(sizes).toContain("M");
    expect(sizes).toContain("XL");
  });

});

