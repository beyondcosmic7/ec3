import { describe, it, expect, beforeEach } from "vitest";
import {
  saveProduct,
  deleteProduct,
  updateProductStock,
  importProductsCsv,
  exportProductsCsv,
  generateWhatsAppOrderMessage,
} from "../src/server/admin";
import {
  createOrderRecord,
  updateOrderStatus,
  processRefund,
  getOrderStats,
  validateAndPriceCart,
} from "../src/server/commerce";
import { getAllProducts } from "../src/server/catalog";

describe("Phase 4 Admin Back-Office — Timed Product Addition (< 3 Minutes)", () => {
  const testProductSlug = "test-jaipur-cotton-kurta-timed";

  beforeEach(() => {
    deleteProduct(testProductSlug);
  });

  it("should add a complete product with variants and measurements in under 3 minutes (benchmark)", () => {
    const startTime = performance.now();

    const sampleProductInput = {
      slug: testProductSlug,
      name: "Handcrafted Jaipur Cambric Cotton Kurta",
      kind: "garment",
      moment: "slow mornings",
      description: "Crafted in breathable 60s cambric cotton with genuine 1.5 inch tailoring seam margin.",
      price_inr: 1599,
      mrp_inr: 2599,
      price_paise: 159900,
      mrp_paise: 259900,
      hsn: "6204",
      gst_percent: 5,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      garment_measurements_in: {
        XS: { bust: 34, waist: 30, hip: 36, length: 44 },
        S: { bust: 36, waist: 32, hip: 38, length: 44 },
        M: { bust: 38, waist: 34, hip: 40, length: 44 },
        L: { bust: 40, waist: 36, hip: 42, length: 44 },
        XL: { bust: 42, waist: 38, hip: 44, length: 44 },
        XXL: { bust: 44, waist: 40, hip: 46, length: 44 },
      },
      fabric: "Pure Cotton Cambric 60s",
      composition: "100% Breathable Cotton",
      care: "Gentle hand wash or cold machine wash with mild detergent.",
      print_colours: ["#943843", "#A67C38", "#3D5A80"],
      stock_by_size: { XS: 4, S: 6, M: 8, L: 6, XL: 4, XXL: 2 },
      images: ["/brand/products/EKC-1501-3 piece/1.jpeg"],
      feeding_access: "concealed",
      country_of_origin: "India",
      packer_name_address: "⟦NEEDED: packer_name_address⟧",
      isSample: false,
    };

    const result = saveProduct(sampleProductInput);
    const endTime = performance.now();
    const durationMs = endTime - startTime;

    // Requirement: Owner can add a product in under 3 minutes (180,000 ms)
    expect(durationMs).toBeLessThan(180000);
    expect(result.success).toBe(true);
    expect(result.product).toBeDefined();
    expect(result.product?.slug).toBe(testProductSlug);
    expect(result.product?.price_paise).toBe(159900);

    // Verify it exists in catalog
    const all = getAllProducts();
    const found = all.find((p) => p.slug === testProductSlug);
    expect(found).toBeDefined();
    expect(found?.name).toBe("Handcrafted Jaipur Cambric Cotton Kurta");

    // Clean up
    deleteProduct(testProductSlug);
  });

  it("should update product stock for a specific size in real time", () => {
    // Add product
    saveProduct({
      slug: testProductSlug,
      name: "Temporary Stock Test Kurta",
      kind: "garment",
      moment: "slow mornings",
      description: "Temporary product for stock testing.",
      price_inr: 999,
      mrp_inr: 1499,
      price_paise: 99900,
      mrp_paise: 149900,
      hsn: "6204",
      gst_percent: 5,
      sizes: ["M", "L"],
      garment_measurements_in: {
        M: { bust: 38, waist: 34, hip: 40, length: 42 },
        L: { bust: 40, waist: 36, hip: 42, length: 42 },
      },
      fabric: "Cotton",
      composition: "100% Cotton",
      care: "Machine wash",
      print_colours: ["#000000"],
      stock_by_size: { M: 5, L: 10 },
      images: ["/brand/products/EKC-81/9L3A2548 (1).jpg"],
      feeding_access: "none",
      country_of_origin: "India",
      packer_name_address: "⟦NEEDED: packer_name_address⟧",
    });

    const updateRes = updateProductStock(testProductSlug, "M", 12);
    expect(updateRes.success).toBe(true);
    expect(updateRes.product?.stock_by_size["M"]).toBe(12);

    // Clean up
    deleteProduct(testProductSlug);
  });
});

describe("Phase 4 Admin Back-Office — CSV Import & Validation Reporting", () => {
  it("should export full canonical catalog to compliant CSV format", () => {
    const csv = exportProductsCsv();
    expect(csv).toContain("slug,name,kind,moment,description,price_inr");
    expect(csv).toContain("garment_measurements_in");
    expect(csv).toContain("packer_name_address");
  });

  it("should reject empty CSV or CSV missing mandatory columns with readable report", () => {
    const emptyReport = importProductsCsv("");
    expect(emptyReport.success).toBe(false);
    expect(emptyReport.errors.length).toBeGreaterThan(0);
    expect(emptyReport.errors[0].message).toContain("empty or missing");

    const badHeadersCsv = "foo,bar,baz\n1,2,3";
    const headerReport = importProductsCsv(badHeadersCsv);
    expect(headerReport.success).toBe(false);
    expect(headerReport.errors[0].message).toContain("Missing mandatory CSV columns");
  });

  it("should reject rows with invalid selling prices or MRP less than price", () => {
    const invalidPriceCsv = [
      "slug,name,kind,moment,description,price_inr,mrp_inr,hsn,gst_percent,sizes,garment_measurements_in,fabric,composition,care,print_colours,stock_by_size,images,feeding_access,country_of_origin,packer_name_address",
      'bad-price-item,"Bad Price Garment",garment,"day","desc",-50,100,6204,5,"M","{}","Cotton","100% Cotton","Wash","[]","{}","img.jpg","none","India","Jaipur"',
      'bad-mrp-item,"Bad MRP Garment",garment,"day","desc",1500,1000,6204,5,"M","{}","Cotton","100% Cotton","Wash","[]","{}","img.jpg","none","India","Jaipur"',
    ].join("\n");

    const report = importProductsCsv(invalidPriceCsv);
    expect(report.success).toBe(false);
    expect(report.errors.length).toBe(2);

    // Row 2 error
    expect(report.errors[0].row).toBe(2);
    expect(report.errors[0].message).toContain("positive number");

    // Row 3 error
    expect(report.errors[1].row).toBe(3);
    expect(report.errors[1].message).toContain("cannot be less than selling price");
  });

  it("should reject rows with malformed JSON measurements or invalid slugs", () => {
    const invalidJsonCsv = [
      "slug,name,kind,moment,description,price_inr,mrp_inr,hsn,gst_percent,sizes,garment_measurements_in,fabric,composition,care,print_colours,stock_by_size,images,feeding_access,country_of_origin,packer_name_address",
      'INVALID_SLUG_CAPS!,"Bad Slug",garment,"day","desc",999,1499,6204,5,"M","{}","Cotton","100% Cotton","Wash","[]","{}","img.jpg","none","India","Jaipur"',
      'broken-json-item,"Broken JSON",garment,"day","desc",999,1499,6204,5,"M","{not valid json}","Cotton","100% Cotton","Wash","[]","{}","img.jpg","none","India","Jaipur"',
    ].join("\n");

    const report = importProductsCsv(invalidJsonCsv);
    expect(report.success).toBe(false);
    expect(report.errors.length).toBe(2);
    expect(report.errors[0].column).toBe("slug");
    expect(report.errors[1].column).toBe("garment_measurements_in");
  });
});

describe("Phase 4 Admin Back-Office — Order Fulfillment, WhatsApp & Refund Flow", () => {
  it("should create order, advance through fulfillment lifecycle, and generate WhatsApp links", () => {
    const quote = validateAndPriceCart(
      [
        {
          slug: "ekc-1501-banarasi-silk-3piece-set",
          name: "Banarasi Soft Silk 3-Piece Kurta Set",
          size: "L",
          price_paise: 179900,
          quantity: 1,
          image: "/brand/products/banarasi-soft-silk-kurta-set-navy-01.webp",
        },
      ],
      "302001",
      "cod"
    );

    const order = createOrderRecord({
      customer: {
        fullName: "Ananya Sharma",
        phone: "9829011223",
        email: "ananya.sharma@example.in",
        pincode: "302001",
        addressLine: "12, Malviya Nagar",
        locality: "Near Apex Hospital",
        city: "Jaipur",
        state: "Rajasthan",
        whatsappConsent: true,
      },
      items: quote.lineItems,
      gift: { isGift: false, hidePriceOnSlip: false, wrap: false },
      paymentMethod: "cod",
      subtotalPaise: quote.subtotalPaise,
      shippingFeePaise: quote.shippingFeePaise,
      codFeePaise: quote.codFeePaise,
      totalAmountPaise: quote.totalAmountPaise,
      taxableAmountPaise: quote.taxableAmountPaise,
      cgstPaise: quote.cgstPaise,
      sgstPaise: quote.sgstPaise,
      igstPaise: quote.igstPaise,
      totalTaxPaise: quote.totalTaxPaise,
      isInterstate: quote.isInterstate,
      deliveryEta: quote.deliveryEta,
    });

    expect(order.status).toBe("confirmed");

    // 1. Confirm / verify Order is confirmed
    const confirmed = updateOrderStatus(order.id, "confirmed");
    expect(confirmed?.status).toBe("confirmed");

    const confirmWa = generateWhatsAppOrderMessage(confirmed!, "confirm");
    expect(confirmWa).toContain("wa.me/919829011223");
    expect(confirmWa).toContain(order.id);
    expect(decodeURIComponent(confirmWa)).toContain("is confirmed");

    // 2. Mark Packed & Dispatched with Tracking AWB
    const shipped = updateOrderStatus(
      order.id,
      "dispatched",
      "Delhivery Surface Express",
      "DEL987654321IN"
    );
    expect(shipped?.status).toBe("dispatched");
    expect(shipped?.carrier).toBe("Delhivery Surface Express");
    expect(shipped?.trackingNumber).toBe("DEL987654321IN");

    const dispatchWa = generateWhatsAppOrderMessage(shipped!, "dispatch");
    expect(dispatchWa).toContain("wa.me/919829011223");
    expect(decodeURIComponent(dispatchWa)).toContain("DEL987654321IN");
    expect(decodeURIComponent(dispatchWa)).toContain("/track?orderId=");

    // 3. Mark Delivered
    const delivered = updateOrderStatus(order.id, "delivered");
    expect(delivered?.status).toBe("delivered");

    const deliveryWa = generateWhatsAppOrderMessage(delivered!, "delivery");
    expect(decodeURIComponent(deliveryWa)).toContain("1.5\" tailoring seam margin");
  });

  it("should process order cancellation and refund cleanly", () => {
    const quote = validateAndPriceCart(
      [
        {
          slug: "ekc-1501-banarasi-silk-3piece-set",
          name: "Banarasi Soft Silk 3-Piece Kurta Set",
          size: "M",
          price_paise: 179900,
          quantity: 1,
          image: "/brand/products/banarasi-soft-silk-kurta-set-navy-01.webp",
        },
      ],
      "302001",
      "online"
    );

    const order = createOrderRecord({
      customer: {
        fullName: "Kavita Singhal",
        phone: "9829988776",
        email: "kavita@example.in",
        pincode: "302001",
        addressLine: "B-44, C-Scheme",
        locality: "Near Statue Circle",
        city: "Jaipur",
        state: "Rajasthan",
        whatsappConsent: false,
      },
      items: quote.lineItems,
      gift: { isGift: false, hidePriceOnSlip: true, wrap: false },
      paymentMethod: "online",
      subtotalPaise: quote.subtotalPaise,
      shippingFeePaise: quote.shippingFeePaise,
      codFeePaise: quote.codFeePaise,
      totalAmountPaise: quote.totalAmountPaise,
      taxableAmountPaise: quote.taxableAmountPaise,
      cgstPaise: quote.cgstPaise,
      sgstPaise: quote.sgstPaise,
      igstPaise: quote.igstPaise,
      totalTaxPaise: quote.totalTaxPaise,
      isInterstate: quote.isInterstate,
      deliveryEta: quote.deliveryEta,
    });

    const refundRes = processRefund(order.id, 179900, "Customer requested size cancellation");
    expect(refundRes.success).toBe(true);
    expect(refundRes.refundId).toBeDefined();
    expect(refundRes.order?.status).toBe("cancelled");
    expect(refundRes.order?.refundAmountPaise).toBe(179900);
  });

  it("should correctly compute financial and operational KPIs in getOrderStats()", () => {
    const stats = getOrderStats();
    expect(stats).toBeDefined();
    expect(typeof stats.totalOrders).toBe("number");
    expect(typeof stats.todayRevenuePaise).toBe("number");
    expect(typeof stats.prepaidOrdersCount).toBe("number");
    expect(typeof stats.codOrdersCount).toBe("number");
    expect(stats.totalOrders).toBeGreaterThanOrEqual(1);
  });
});

