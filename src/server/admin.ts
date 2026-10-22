/**
 * Eskort Creations — Atelier Admin Management & Back-Office Engine
 * Sections 8.11, 9.1, 9.2, 9.4, 10 (Phase 4) of BUILD_PROMPT.md
 */

import fs from "fs";
import path from "path";
import { Product, ProductSchema, Order } from "@/lib/types";
import { getAllProducts } from "./catalog";
import { getAllOrders, updateOrderStatus, processRefund, getOrderStats } from "./commerce";

export { getAllOrders, updateOrderStatus, processRefund, getOrderStats };

function getCsvPaths() {
  const brandCsv = path.join(process.cwd(), "brand", "products.csv");
  const publicCsv = path.join(process.cwd(), "public", "brand", "products.csv");
  return { brandCsv, publicCsv };
}

function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = typeof val === "object" ? JSON.stringify(val) : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function productToCsvRow(p: Product): string {
  const measurementsStr = JSON.stringify(p.garment_measurements_in);
  const stockStr = JSON.stringify(p.stock_by_size);
  const colorsStr = JSON.stringify(p.print_colours);
  const sizesStr = p.sizes.join(",");
  const imagesStr = p.images.join(";");

  return [
    escapeCsvValue(p.slug),
    escapeCsvValue(p.name),
    escapeCsvValue(p.kind),
    escapeCsvValue(p.moment),
    escapeCsvValue(p.description),
    escapeCsvValue(p.price_inr),
    escapeCsvValue(p.mrp_inr),
    escapeCsvValue(p.hsn),
    escapeCsvValue(p.gst_percent),
    escapeCsvValue(sizesStr),
    escapeCsvValue(measurementsStr),
    escapeCsvValue(p.fabric),
    escapeCsvValue(p.composition),
    escapeCsvValue(p.care),
    escapeCsvValue(colorsStr),
    escapeCsvValue(stockStr),
    escapeCsvValue(imagesStr),
    escapeCsvValue(p.feeding_access),
    escapeCsvValue(p.country_of_origin),
    escapeCsvValue(p.packer_name_address),
  ].join(",");
}

const CSV_HEADER =
  "slug,name,kind,moment,description,price_inr,mrp_inr,hsn,gst_percent,sizes,garment_measurements_in,fabric,composition,care,print_colours,stock_by_size,images,feeding_access,country_of_origin,packer_name_address";

/**
 * Save new product or update existing product in products.csv
 */
export function saveProduct(productInput: unknown): {
  success: boolean;
  product?: Product;
  error?: string;
} {
  try {
    const validated = ProductSchema.parse(productInput);
    const { brandCsv, publicCsv } = getCsvPaths();

    const existingProducts = getAllProducts();
    const index = existingProducts.findIndex((p) => p.slug === validated.slug);

    if (index >= 0) {
      existingProducts[index] = validated;
    } else {
      existingProducts.push(validated);
    }

    const lines = [CSV_HEADER];
    for (const p of existingProducts) {
      lines.push(productToCsvRow(p));
    }
    const fullContent = lines.join("\n") + "\n";

    fs.writeFileSync(brandCsv, fullContent, "utf-8");
    if (fs.existsSync(path.dirname(publicCsv))) {
      fs.writeFileSync(publicCsv, fullContent, "utf-8");
    }

    return { success: true, product: validated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Delete product by slug
 */
export function deleteProduct(slug: string): boolean {
  try {
    const { brandCsv, publicCsv } = getCsvPaths();
    const existingProducts = getAllProducts();
    const filtered = existingProducts.filter((p) => p.slug !== slug);
    if (filtered.length === existingProducts.length) return false;

    const lines = [CSV_HEADER];
    for (const p of filtered) {
      lines.push(productToCsvRow(p));
    }
    const fullContent = lines.join("\n") + "\n";

    fs.writeFileSync(brandCsv, fullContent, "utf-8");
    if (fs.existsSync(path.dirname(publicCsv))) {
      fs.writeFileSync(publicCsv, fullContent, "utf-8");
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Quick stock adjustment for a specific product size
 */
export function updateProductStock(
  slug: string,
  size: string,
  newStock: number
): { success: boolean; product?: Product; error?: string } {
  const product = getAllProducts().find((p) => p.slug === slug);
  if (!product) return { success: false, error: "Product not found" };

  const updatedStock = { ...product.stock_by_size, [size]: Math.max(0, newStock) };
  return saveProduct({
    ...product,
    stock_by_size: updatedStock,
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
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

export interface CsvImportError {
  row: number;
  column?: string;
  message: string;
}

export interface CsvImportResult {
  success: boolean;
  totalRows: number;
  importedCount: number;
  errors: CsvImportError[];
  importedProducts: Product[];
}

/**
 * Import and validate CSV content with comprehensive row-level error reporting (Section 8.11 & 10)
 */
export function importProductsCsv(csvContent: string): CsvImportResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      success: false,
      totalRows: 0,
      importedCount: 0,
      errors: [{ row: 1, message: "CSV file is empty or missing data rows" }],
      importedProducts: [],
    };
  }

  const headers = parseCSVLine(lines[0]);
  const requiredHeaders = [
    "slug",
    "name",
    "kind",
    "moment",
    "description",
    "price_inr",
    "mrp_inr",
    "hsn",
    "gst_percent",
    "sizes",
    "garment_measurements_in",
    "fabric",
    "composition",
    "care",
    "print_colours",
    "stock_by_size",
    "images",
    "feeding_access",
    "country_of_origin",
    "packer_name_address",
  ];

  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      success: false,
      totalRows: lines.length - 1,
      importedCount: 0,
      errors: [
        {
          row: 1,
          message: `Missing mandatory CSV columns: ${missingHeaders.join(", ")}`,
        },
      ],
      importedProducts: [],
    };
  }

  const errors: CsvImportError[] = [];
  const validProducts: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const values = parseCSVLine(lines[i]);

    if (values.length < headers.length) {
      errors.push({
        row: rowNum,
        message: `Incomplete row: expected ${headers.length} columns but found ${values.length}`,
      });
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });

    // Validate fields
    if (!row.slug || !/^[a-z0-9-]+$/.test(row.slug)) {
      errors.push({
        row: rowNum,
        column: "slug",
        message: `Invalid slug "${row.slug}". Must contain lowercase alphanumeric characters and hyphens only.`,
      });
      continue;
    }

    const priceInr = parseFloat(row.price_inr);
    const mrpInr = parseFloat(row.mrp_inr);
    if (isNaN(priceInr) || priceInr <= 0) {
      errors.push({
        row: rowNum,
        column: "price_inr",
        message: `Invalid price_inr "${row.price_inr}". Must be a positive number.`,
      });
      continue;
    }
    if (isNaN(mrpInr) || mrpInr < priceInr) {
      errors.push({
        row: rowNum,
        column: "mrp_inr",
        message: `mrp_inr (${mrpInr}) cannot be less than selling price (${priceInr}).`,
      });
      continue;
    }

    let parsedMeasurements = {};
    try {
      parsedMeasurements = JSON.parse(row.garment_measurements_in || "{}");
    } catch {
      errors.push({
        row: rowNum,
        column: "garment_measurements_in",
        message: "garment_measurements_in must be a valid JSON object.",
      });
      continue;
    }

    let parsedStock = {};
    try {
      parsedStock = JSON.parse(row.stock_by_size || "{}");
    } catch {
      errors.push({
        row: rowNum,
        column: "stock_by_size",
        message: "stock_by_size must be a valid JSON object.",
      });
      continue;
    }

    let parsedColors = [];
    try {
      parsedColors = JSON.parse(row.print_colours || "[]");
    } catch {
      errors.push({
        row: rowNum,
        column: "print_colours",
        message: "print_colours must be a valid JSON array of hex codes.",
      });
      continue;
    }

    const rawProduct = {
      slug: row.slug,
      name: row.name,
      kind: row.kind,
      moment: row.moment,
      description: row.description,
      price_inr: priceInr,
      mrp_inr: mrpInr,
      price_paise: Math.round(priceInr * 100),
      mrp_paise: Math.round(mrpInr * 100),
      hsn: row.hsn,
      gst_percent: parseFloat(row.gst_percent) || 5,
      sizes: (row.sizes || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      garment_measurements_in: parsedMeasurements,
      fabric: row.fabric,
      composition: row.composition,
      care: row.care,
      print_colours: parsedColors,
      stock_by_size: parsedStock,
      images: (row.images || "")
        .split(";")
        .map((img) => img.trim())
        .filter(Boolean),
      feeding_access: row.feeding_access || "none",
      country_of_origin: row.country_of_origin || "India",
      packer_name_address: row.packer_name_address || "⟦NEEDED: packer_name_address⟧",
      isSample: false,
    };

    const parseResult = ProductSchema.safeParse(rawProduct);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      errors.push({
        row: rowNum,
        column: issue.path.join("."),
        message: issue.message,
      });
    } else {
      validProducts.push(parseResult.data);
    }
  }

  // If there are valid products and no fatal errors, save them
  if (validProducts.length > 0) {
    const existing = getAllProducts();
    for (const valid of validProducts) {
      const idx = existing.findIndex((p) => p.slug === valid.slug);
      if (idx >= 0) {
        existing[idx] = valid;
      } else {
        existing.push(valid);
      }
    }

    const linesOut = [CSV_HEADER];
    for (const p of existing) {
      linesOut.push(productToCsvRow(p));
    }
    const fullContent = linesOut.join("\n") + "\n";
    const { brandCsv, publicCsv } = getCsvPaths();
    fs.writeFileSync(brandCsv, fullContent, "utf-8");
    if (fs.existsSync(path.dirname(publicCsv))) {
      fs.writeFileSync(publicCsv, fullContent, "utf-8");
    }
  }

  return {
    success: errors.length === 0,
    totalRows: lines.length - 1,
    importedCount: validProducts.length,
    errors,
    importedProducts: validProducts,
  };
}

export function exportProductsCsv(): string {
  const products = getAllProducts();
  const lines = [CSV_HEADER];
  for (const p of products) {
    lines.push(productToCsvRow(p));
  }
  return lines.join("\n") + "\n";
}

/**
 * Generate 1-tap WhatsApp message URL for customer communication from templates (Section 8.11)
 */
export function generateWhatsAppOrderMessage(
  order: Order,
  type: "confirm" | "dispatch" | "delivery"
): string {
  const cleanPhone = order.customer.phone.replace(/\D/g, "");
  let text = "";

  if (type === "confirm") {
    text = [
      `Namaste ${order.customer.fullName},`,
      `Your Eskort Creations Order ${order.id} is confirmed!`,
      `• Items: ${order.items.map((i) => `${i.name} (${i.size})`).join(", ")}`,
      `• Total: ₹${order.totalAmountPaise / 100} (${order.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid Online"})`,
      `• Delivery to: ${order.customer.city}, ${order.customer.state} (${order.customer.pincode})`,
      `We are preparing and thread-finishing your garment at our Jaipur atelier.`,
    ].join("\n");
  } else if (type === "dispatch") {
    text = [
      `Namaste ${order.customer.fullName},`,
      `Good news! Your Eskort Creations Order ${order.id} has been dispatched from Jaipur.`,
      `• Courier Partner: ${order.carrier || "Delhivery Surface Express"}`,
      `• Air Waybill / Tracking: ${order.trackingNumber || "N/A"}`,
      `• Live Tracking Link: https://eskortcreations.com/track?orderId=${order.id}&phone=${order.customer.phone}`,
      `• Estimated Delivery: ${order.estimatedDeliveryDate}`,
    ].join("\n");
  } else {
    text = [
      `Namaste ${order.customer.fullName},`,
      `Your Eskort Creations Order ${order.id} has been delivered.`,
      `We hope the fit and fabric bring comfort to your day. Every garment has a 1.5" tailoring seam margin for easy local adjustment if ever desired.`,
      `Please let us know if you need any fabric care guidance!`,
    ].join("\n");
  }

  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// --- Restock Requests & Coupons Persistence ---

function getDataDir(): string {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return dataDir;
}

export interface RestockRequest {
  id: string;
  slug: string;
  productName: string;
  size: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export function getRestockRequests(): RestockRequest[] {
  const filePath = path.join(getDataDir(), "restock-requests.json");
  if (!fs.existsSync(filePath)) {
    // Seed with realistic requests
    const initial: RestockRequest[] = [
      {
        id: "req_1",
        slug: "ekc-81-pink-floral-kurta",
        productName: "Handcrafted Pink Floral Rayon Kurta",
        size: "M",
        phone: "9829277894",
        email: "ananya@example.in",
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
      {
        id: "req_2",
        slug: "ekc-86-georgette-shrug-set",
        productName: "Black Floral Georgette Shrug & Kurta Set",
        size: "XL",
        phone: "9820011223",
        createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
      },
    ];
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function addRestockRequest(slug: string, size: string, phone: string, email?: string): RestockRequest {
  const list = getRestockRequests();
  const prods = getAllProducts();
  const prod = prods.find((p) => p.slug === slug);

  const req: RestockRequest = {
    id: `req_${Date.now()}`,
    slug,
    productName: prod ? prod.name : slug,
    size,
    phone,
    email,
    createdAt: new Date().toISOString(),
  };

  list.push(req);
  fs.writeFileSync(path.join(getDataDir(), "restock-requests.json"), JSON.stringify(list, null, 2));
  return req;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed_paise";
  value: number; // e.g. 10 for 10%, or 20000 for ₹200.00
  minOrderPaise: number;
  active: boolean;
  expiryDate?: string;
}

export function getCoupons(): Coupon[] {
  const filePath = path.join(getDataDir(), "coupons.json");
  if (!fs.existsSync(filePath)) {
    const initial: Coupon[] = [
      {
        code: "JAIPURFIRST",
        discountType: "percentage",
        value: 10,
        minOrderPaise: 99900,
        active: true,
        expiryDate: "2027-12-31",
      },
      {
        code: "FESTIVE500",
        discountType: "fixed_paise",
        value: 50000,
        minOrderPaise: 299900,
        active: true,
        expiryDate: "2027-12-31",
      },
    ];
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function saveCoupon(coupon: Coupon): Coupon {
  const list = getCoupons().filter((c) => c.code !== coupon.code.toUpperCase());
  const normalized = { ...coupon, code: coupon.code.toUpperCase() };
  list.push(normalized);
  fs.writeFileSync(path.join(getDataDir(), "coupons.json"), JSON.stringify(list, null, 2));
  return normalized;
}

export function deleteCoupon(code: string): boolean {
  const list = getCoupons();
  const filtered = list.filter((c) => c.code !== code.toUpperCase());
  if (filtered.length === list.length) return false;
  fs.writeFileSync(path.join(getDataDir(), "coupons.json"), JSON.stringify(filtered, null, 2));
  return true;
}
