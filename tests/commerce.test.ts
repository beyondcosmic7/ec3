import { describe, it, expect } from "vitest";
import { lookupPincode, calculateGstSplit } from "../src/lib/pincodes";
import {
  getAvailableStock,
  reserveInventory,
  releaseReservation,
  commitReservation,
  validateAndPriceCart,
  verifyRazorpaySignature,
  processRazorpayWebhook,
  createOrderRecord,
  getOrderById,
  getOrderByPhoneAndId,
  generateGstInvoice,
} from "../src/server/commerce";
import { CartItem } from "../src/lib/types";
import crypto from "crypto";

describe("Phase 3 Commerce Core — Pincodes, Logistics & GST Split", () => {
  it("should look up valid Rajasthan pincode and detect intra-state delivery", () => {
    const pin = lookupPincode("302001"); // Jaipur, Rajasthan
    expect(pin.valid).toBe(true);
    expect(pin.state).toBe("Rajasthan");
    expect(pin.stateCode).toBe("RJ");
    expect(pin.isRajasthan).toBe(true);
    expect(pin.etaDays).toBe("2–3 business days");
    expect(pin.codAvailable).toBe(true);
  });

  it("should look up valid Metro inter-state pincodes (Delhi, Mumbai, Bengaluru)", () => {
    const delhiPin = lookupPincode("110001");
    expect(delhiPin.valid).toBe(true);
    expect(delhiPin.state).toBe("Delhi");
    expect(delhiPin.isRajasthan).toBe(false);
    expect(delhiPin.etaDays).toBe("3–4 business days");

    const mumbaiPin = lookupPincode("400001");
    expect(mumbaiPin.valid).toBe(true);
    expect(mumbaiPin.state).toBe("Maharashtra");
    expect(mumbaiPin.etaDays).toBe("3–4 business days");

    const blrPin = lookupPincode("560001");
    expect(blrPin.valid).toBe(true);
    expect(blrPin.state).toBe("Karnataka");
    expect(blrPin.etaDays).toBe("3–4 business days");
  });

  it("should reject invalid pincodes (non-numeric, not 6 digits)", () => {
    expect(lookupPincode("3020").valid).toBe(false);
    expect(lookupPincode("abcdef").valid).toBe(false);
    expect(lookupPincode("").valid).toBe(false);
    expect(lookupPincode("1234567").valid).toBe(false);
  });

  it("should correctly split GST for intra-state Rajasthan delivery (CGST 2.5% + SGST 2.5%)", () => {
    // ₹1,799 inclusive = 179900 paise
    const totalInclusivePaise = 179900;
    const split = calculateGstSplit(totalInclusivePaise, 5, "Rajasthan");

    expect(split.isInterstate).toBe(false);
    expect(split.gstPercent).toBe(5);
    // Taxable + Tax = Total
    expect(split.taxablePaise + split.totalTaxPaise).toBe(totalInclusivePaise);
    // Rajasthan split: CGST + SGST = totalTaxPaise, IGST = 0
    expect(split.cgstPaise + split.sgstPaise).toBe(split.totalTaxPaise);
    expect(split.igstPaise).toBe(0);
    expect(Math.abs(split.cgstPaise - split.sgstPaise)).toBeLessThanOrEqual(1); // odd paise rounding difference <= 1
  });

  it("should correctly calculate IGST 5% for inter-state delivery (e.g. Maharashtra)", () => {
    const totalInclusivePaise = 179900;
    const split = calculateGstSplit(totalInclusivePaise, 5, "Maharashtra");

    expect(split.isInterstate).toBe(true);
    expect(split.gstPercent).toBe(5);
    expect(split.taxablePaise + split.totalTaxPaise).toBe(totalInclusivePaise);
    expect(split.cgstPaise).toBe(0);
    expect(split.sgstPaise).toBe(0);
    expect(split.igstPaise).toBe(split.totalTaxPaise);
  });
});

describe("Phase 3 Commerce Core — Cart Re-pricing & COD Rules", () => {
  const sampleGarmentItem: CartItem = {
    slug: "ekc-1501-banarasi-silk-3piece-set",
    name: "Banarasi Soft Silk 3-Piece Kurta Set",
    size: "M",
    price_paise: 179900, // ₹1,799
    quantity: 1,
    image: "/brand/products/banarasi-soft-silk-kurta-set-navy-01.webp",
  };

  it("should reject empty cart", () => {
    const result = validateAndPriceCart([], "302001", "online");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Cart is empty");
  });

  it("should reject invalid pincode during quote", () => {
    const result = validateAndPriceCart([sampleGarmentItem], "0000", "online");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("6 digits");
  });

  it("should re-price cart using canonical database prices (prevent client price tampering)", () => {
    // Client attempts to pass price_paise: 100 (₹1) instead of ₹1,799
    const tamperedItem: CartItem = {
      ...sampleGarmentItem,
      price_paise: 100,
    };

    const result = validateAndPriceCart([tamperedItem], "302001", "online");
    expect(result.valid).toBe(true);
    // Server must enforce real price 179900
    expect(result.lineItems[0].unitPricePaise).toBe(179900);
    expect(result.subtotalPaise).toBe(179900);
    expect(result.totalAmountPaise).toBe(179900);
  });

  it("should calculate correct COD surcharge (₹50 fee)", () => {
    const result = validateAndPriceCart([sampleGarmentItem], "302001", "cod");
    expect(result.valid).toBe(true);
    expect(result.codFeePaise).toBe(5000); // ₹50.00
    expect(result.totalAmountPaise).toBe(179900 + 5000);
  });

  it("should reject COD if order is below minimum order value (min ₹250)", () => {
    // Mock item below ₹250 threshold if any exists or test with hypothetical cut
    const tinyItem: CartItem = {
      slug: "fabric-cut-chanderi",
      name: "Chanderi Fabric Cut",
      size: "0.5m",
      price_paise: 12000, // ₹120
      quantity: 1,
      image: "/brand/fabrics/chanderi.webp",
      isFabricCut: true,
      metres: 0.5, // 0.5m @ ₹240/m = ₹120
    };

    const result = validateAndPriceCart([tinyItem], "302001", "cod");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("minimum order value");
  });

  it("should correctly price running fabric cuts by metres", () => {
    const fabricItem: CartItem = {
      slug: "fabric-cut-silk-blend",
      name: "Silk Blend Fabric Cut",
      size: "2.5m",
      price_paise: 60000,
      quantity: 2,
      image: "/brand/fabrics/silk.webp",
      isFabricCut: true,
      metres: 2.5, // 2.5m @ ₹240/m = ₹600 per item
    };

    const result = validateAndPriceCart([fabricItem], "302001", "online");
    expect(result.valid).toBe(true);
    expect(result.lineItems[0].unitPricePaise).toBe(60000);
    expect(result.lineItems[0].totalPaise).toBe(120000); // 2 items = ₹1,200
    expect(result.lineItems[0].hsn).toBe("5208");
  });
});

describe("Phase 3 Commerce Core — Inventory Reservation & Race Conditions", () => {
  const testSlug = "ekc-1501-banarasi-silk-3piece-set";
  const testSize = "L";

  it("should report initial available stock", () => {
    const stock = getAvailableStock(testSlug, testSize);
    expect(stock).toBeGreaterThan(0);
  });

  it("should reserve stock and deduct from available stock during TTL hold", () => {
    const initialStock = getAvailableStock(testSlug, testSize);
    const reservation = reserveInventory([{ slug: testSlug, size: testSize, quantity: 1 }]);

    expect(reservation.success).toBe(true);
    expect(reservation.reservationId).toBeDefined();

    // Available stock immediately reduces by 1
    const stockAfterReservation = getAvailableStock(testSlug, testSize);
    expect(stockAfterReservation).toBe(initialStock - 1);

    // Release reservation restores stock
    if (reservation.reservationId) {
      releaseReservation(reservation.reservationId);
    }
    expect(getAvailableStock(testSlug, testSize)).toBe(initialStock);
  });

  it("should reject reservation when requested quantity exceeds available stock", () => {
    const available = getAvailableStock(testSlug, testSize);
    const failedReservation = reserveInventory([
      { slug: testSlug, size: testSize, quantity: available + 999 },
    ]);

    expect(failedReservation.success).toBe(false);
    expect(failedReservation.error).toContain("Insufficient stock");
  });

  it("should commit reservation permanently upon successful payment", () => {
    const initialStock = getAvailableStock(testSlug, testSize);
    const reservation = reserveInventory([{ slug: testSlug, size: testSize, quantity: 1 }]);
    expect(reservation.success).toBe(true);

    if (reservation.reservationId) {
      const committed = commitReservation(reservation.reservationId);
      expect(committed).toBe(true);
    }

    // After commit, stock remains decremented
    expect(getAvailableStock(testSlug, testSize)).toBe(initialStock - 1);
  });
});

describe("Phase 3 Commerce Core — Razorpay Security & Webhooks", () => {
  it("should verify valid HMAC-SHA256 Razorpay signature", () => {
    const secret = "mock_razorpay_secret_123456789";
    const orderId = "order_test_987654";
    const paymentId = "pay_test_123456";
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const isValid = verifyRazorpaySignature(orderId, paymentId, validSignature);
    expect(isValid).toBe(true);
  });

  it("should reject tampered Razorpay signatures", () => {
    const orderId = "order_test_987654";
    const paymentId = "pay_test_123456";
    const invalidSignature = "deadbeef1234567890abcdef";

    const isValid = verifyRazorpaySignature(orderId, paymentId, invalidSignature);
    expect(isValid).toBe(false);
  });

  it("should process webhook events idempotently", () => {
    const eventId = `evt_test_${Date.now()}`;
    const firstCall = processRazorpayWebhook(eventId, "payment.captured", {
      payment: { entity: { id: "pay_1", order_id: "order_1" } },
    });
    expect(firstCall.success).toBe(true);
    expect(firstCall.duplicate).toBe(false);

    // Second call with same eventId must be flagged as duplicate
    const secondCall = processRazorpayWebhook(eventId, "payment.captured", {
      payment: { entity: { id: "pay_1", order_id: "order_1" } },
    });
    expect(secondCall.success).toBe(true);
    expect(secondCall.duplicate).toBe(true);
  });
});

describe("Phase 3 Commerce Core — Order Creation, Legal Metrology & GST Invoice", () => {
  it("should create order with sequential ID and generate statutory Rule 6 GST Tax Invoice", () => {
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
        fullName: "Pooja Mehta",
        phone: "9829012345",
        email: "pooja.mehta@example.in",
        pincode: "302001",
        addressLine: "Flat 402, Royal Residency",
        locality: "Civil Lines",
        city: "Jaipur",
        state: "Rajasthan",
        whatsappConsent: true,
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

    expect(order.id).toMatch(/^ESK-\d{4}-\d{6}$/);
    expect(order.customer.fullName).toBe("Pooja Mehta");
    expect(order.totalAmountPaise).toBe(179900);

    // Retrieve order by ID
    const retrieved = getOrderById(order.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(order.id);

    // Test phone auth lookup for order tracking
    const trackedValid = getOrderByPhoneAndId(order.id, "9829012345");
    expect(trackedValid).toBeDefined();

    const trackedInvalid = getOrderByPhoneAndId(order.id, "9999999999");
    expect(trackedInvalid).toBeNull();

    // Verify statutory GST invoice output
    const invoice = generateGstInvoice(order);
    expect(invoice.invoiceNumber).toContain("INV-");
    expect(invoice.supplier.gstin).toBeDefined();
    expect(invoice.supplier.name).toBe("Eskort Creations");
    expect(invoice.buyer.name).toBe("Pooja Mehta");
    expect(invoice.items[0].hsn).toBe("6204");
    expect(invoice.summary.grandTotalInr).toBe(1799);
  });
});
