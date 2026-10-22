import { NextRequest, NextResponse } from "next/server";
import {
  validateAndPriceCart,
  verifyRazorpaySignature,
  createOrderRecord,
  commitReservation,
} from "@/server/commerce";
import { CustomerDetailsSchema, GiftOptionsSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      customer,
      gift,
      reservationId,
    } = body;

    // 1. Verify Payment Signature (Section 9.2)
    const isValidSignature = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid gateway signature." },
        { status: 400 }
      );
    }

    // 2. Validate Customer and Gift Details
    const parsedCustomer = CustomerDetailsSchema.parse(customer);
    const parsedGift = GiftOptionsSchema.parse(gift || {});

    // 3. Re-calculate server-authoritative totals
    const pricing = validateAndPriceCart(items, parsedCustomer.pincode, "online");
    if (!pricing.valid) {
      return NextResponse.json({ success: false, error: pricing.error }, { status: 400 });
    }

    // 4. Commit Inventory Reservation permanently
    if (reservationId) {
      commitReservation(reservationId);
    }

    // 5. Create Order Record
    const order = createOrderRecord({
      customer: parsedCustomer,
      items: pricing.lineItems,
      gift: parsedGift,
      paymentMethod: "online",
      subtotalPaise: pricing.subtotalPaise,
      shippingFeePaise: pricing.shippingFeePaise,
      codFeePaise: pricing.codFeePaise,
      totalAmountPaise: pricing.totalAmountPaise,
      taxableAmountPaise: pricing.taxableAmountPaise,
      cgstPaise: pricing.cgstPaise,
      sgstPaise: pricing.sgstPaise,
      igstPaise: pricing.igstPaise,
      totalTaxPaise: pricing.totalTaxPaise,
      isInterstate: pricing.isInterstate,
      deliveryEta: pricing.deliveryEta,
      reservationId,
      razorpayOrderId,
      razorpayPaymentId,
    });

    // Mark as confirmed
    order.status = "confirmed";

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
