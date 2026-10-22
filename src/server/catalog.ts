import fs from "fs";
import path from "path";
import { Product, ProductSchema } from "@/lib/types";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function getAllProducts(): Product[] {
  const csvPath = path.join(process.cwd(), "brand", "products.csv");
  if (!fs.existsSync(csvPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(csvPath, "utf-8");
  const lines = fileContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const headers = parseCSVLine(lines[0]);
  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    try {
      const priceInr = parseFloat(row.price_inr);
      const mrpInr = parseFloat(row.mrp_inr);
      const pricePaise = Math.round(priceInr * 100);
      const mrpPaise = Math.round(mrpInr * 100);

      const parsedMeasurements = JSON.parse(row.garment_measurements_in || "{}");
      const parsedStock = JSON.parse(row.stock_by_size || "{}");
      const parsedColors = JSON.parse(row.print_colours || "[]");
      const parsedSizes = (row.sizes || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedImages = (row.images || "")
        .split(";")
        .map((img) => img.trim())
        .filter(Boolean);

      const productData = {
        slug: row.slug,
        name: row.name,
        kind: row.kind as "garment" | "fabric" | "baby",
        moment: row.moment,
        description: row.description,
        price_inr: priceInr,
        mrp_inr: mrpInr,
        price_paise: pricePaise,
        mrp_paise: mrpPaise,
        hsn: row.hsn,
        gst_percent: parseFloat(row.gst_percent) || 5,
        sizes: parsedSizes,
        garment_measurements_in: parsedMeasurements,
        fabric: row.fabric,
        composition: row.composition,
        care: row.care,
        print_colours: parsedColors,
        stock_by_size: parsedStock,
        images: parsedImages,
        feeding_access: (row.feeding_access || "none") as "zipless" | "concealed" | "none",
        country_of_origin: row.country_of_origin || "India",
        packer_name_address: row.packer_name_address,
        isSample: false,
      };

      const validated = ProductSchema.parse(productData);
      products.push(validated);
    } catch (err) {
      console.error(`Error parsing product row ${i}:`, err);
    }
  }

  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export interface CatalogFilterOptions {
  moment?: string;
  size?: string;
  fabric?: string;
  feeding_access?: "zipless" | "concealed" | "none";
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  sort?: "price-asc" | "price-desc" | "newest";
}

export function getFilteredProducts(options: CatalogFilterOptions = {}): Product[] {
  let products = getAllProducts();

  if (options.query) {
    const q = options.query.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.moment.toLowerCase().includes(q)
    );
  }

  if (options.moment) {
    products = products.filter(
      (p) => p.moment.toLowerCase() === options.moment?.toLowerCase()
    );
  }

  if (options.size) {
    products = products.filter((p) =>
      p.sizes.map((s) => s.toLowerCase()).includes(options.size!.toLowerCase())
    );
  }

  if (options.fabric) {
    products = products.filter(
      (p) => p.fabric.toLowerCase().includes(options.fabric!.toLowerCase())
    );
  }

  if (options.feeding_access) {
    products = products.filter(
      (p) => p.feeding_access === options.feeding_access
    );
  }

  if (options.minPrice !== undefined) {
    products = products.filter((p) => p.price_inr >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    products = products.filter((p) => p.price_inr <= options.maxPrice!);
  }

  if (options.sort === "price-asc") {
    products.sort((a, b) => a.price_inr - b.price_inr);
  } else if (options.sort === "price-desc") {
    products.sort((a, b) => b.price_inr - a.price_inr);
  }

  return products;
}

export function getAllMoments(): string[] {
  const products = getAllProducts();
  const set = new Set<string>();
  for (const p of products) {
    if (p.moment) set.add(p.moment);
  }
  return Array.from(set);
}

export function getAllFabrics(): string[] {
  const products = getAllProducts();
  const set = new Set<string>();
  for (const p of products) {
    if (p.fabric) set.add(p.fabric);
  }
  return Array.from(set);
}

export function getAllSizes(): string[] {
  const products = getAllProducts();
  const set = new Set<string>();
  for (const p of products) {
    for (const s of p.sizes) {
      set.add(s);
    }
  }
  return Array.from(set);
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const all = getAllProducts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);

  const related = all
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      // Prioritize same fabric or same moment
      const aScore = (a.fabric === current.fabric ? 2 : 0) + (a.moment === current.moment ? 1 : 0);
      const bScore = (b.fabric === current.fabric ? 2 : 0) + (b.moment === current.moment ? 1 : 0);
      return bScore - aScore;
    });

  return related.slice(0, limit);
}

