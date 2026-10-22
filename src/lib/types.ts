import { z } from "zod";

export const GarmentMeasurementSchema = z.record(
  z.string(),
  z.object({
    bust: z.number(),
    waist: z.number().optional(),
    hip: z.number().optional(),
    length: z.number(),
  })
);

export const ProductSchema = z.object({
  slug: z.string(),
  name: z.string(),
  kind: z.enum(["garment", "fabric", "baby"]),
  moment: z.string(),
  description: z.string(),
  price_inr: z.number().positive(),
  mrp_inr: z.number().positive(),
  price_paise: z.number().int().positive(), // integer paise (1 INR = 100 paise)
  mrp_paise: z.number().int().positive(),
  hsn: z.string(),
  gst_percent: z.number().nonnegative(),
  sizes: z.array(z.string()),
  garment_measurements_in: GarmentMeasurementSchema,
  fabric: z.string(),
  composition: z.string(),
  care: z.string(),
  print_colours: z.array(z.string()),
  stock_by_size: z.record(z.string(), z.number().int().nonnegative()),
  images: z.array(z.string()),
  feeding_access: z.enum(["zipless", "concealed", "none"]),
  country_of_origin: z.string(),
  packer_name_address: z.string(),
  isSample: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductSchema>;
export type GarmentMeasurements = z.infer<typeof GarmentMeasurementSchema>;

// --- Commerce & Checkout Schemas (Section 8.6, 8.7 & 9.1) ---

export const CartItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
  price_paise: z.number().int().positive(), // integer paise (client snapshot, server re-verifies)
  image: z.string(),
  fabric: z.string().optional(),
  isFabricCut: z.boolean().optional(),
  metres: z.number().positive().optional(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CustomerDetailsSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Please enter a valid email address for your GST receipt"),
  pincode: z.string().regex(/^\d{6}$/, "That pincode needs 6 digits."),
  addressLine: z.string().min(5, "Please provide complete street/house address"),
  locality: z.string().min(2, "Please specify locality or area"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  whatsappConsent: z.boolean().default(false), // DPDP explicit separate consent
});
export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;

export const GiftOptionsSchema = z.object({
  isGift: z.boolean().default(false),
  recipientName: z.string().optional(),
  giftMessage: z.string().max(200, "Gift message cannot exceed 200 characters").optional(),
  hidePriceOnSlip: z.boolean().default(true),
  wrap: z.boolean().default(false),
});
export type GiftOptions = z.infer<typeof GiftOptionsSchema>;

export const PaymentMethodSchema = z.enum(["online", "cod"]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const OrderLineItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
  unitPricePaise: z.number().int().positive(),
  totalPaise: z.number().int().positive(),
  hsn: z.string(),
  gstPercent: z.number(),
  image: z.string(),
  metres: z.number().optional(),
});
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

export const OrderStatusSchema = z.enum([
  "pending_payment",
  "confirmed",
  "packed",
  "dispatched",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
  id: z.string(), // e.g. "ESK-2026-000101"
  createdAt: z.string(),
  items: z.array(OrderLineItemSchema),
  customer: CustomerDetailsSchema,
  gift: GiftOptionsSchema,
  paymentMethod: PaymentMethodSchema,
  status: OrderStatusSchema,
  subtotalPaise: z.number().int().positive(),
  shippingFeePaise: z.number().int().nonnegative(),
  codFeePaise: z.number().int().nonnegative(),
  totalAmountPaise: z.number().int().positive(),
  taxableAmountPaise: z.number().int().positive(),
  cgstPaise: z.number().int().nonnegative(),
  sgstPaise: z.number().int().nonnegative(),
  igstPaise: z.number().int().nonnegative(),
  totalTaxPaise: z.number().int().nonnegative(),
  isInterstate: z.boolean(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  estimatedDeliveryDate: z.string(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  refundId: z.string().optional(),
  refundAmountPaise: z.number().int().optional(),
  refundReason: z.string().optional(),
});
export type Order = z.infer<typeof OrderSchema>;

export const InventoryReservationSchema = z.object({
  reservationId: z.string(),
  expiresAt: z.number(), // timestamp ms
  items: z.array(
    z.object({
      slug: z.string(),
      size: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});
export type InventoryReservation = z.infer<typeof InventoryReservationSchema>;

