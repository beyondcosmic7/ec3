import { NextRequest, NextResponse } from "next/server";
import {
  validateAndPriceCart,
  createOrderRecord,
  commitReservation,
} from "@/server/commerce";
import { CustomerDetailsSchema, GiftOptionsSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, gift, reservationId } = body;

    // 1. Validate Customer and Gift
    const parsedCustomer = CustomerDetailsSchema.parse(customer);
    const parsedGift = GiftOptionsSchema.parse(gift || {});

    // 2. Server re-pricing with COD validation
    const pricing = validateAndPriceCart(items, parsedCustomer.pincode, "cod");
    if (!pricing.valid) {
      return NextResponse.json({ success: false, error: pricing.error }, { status: 400 });
    }

    // 3. Commit Inventory Reservation
    if (reservationId) {
      commitReservation(reservationId);
    }

    // 4. Create Order Record
    const order = createOrderRecord({
      customer: parsedCustomer,
      items: pricing.lineItems,
      gift: parsedGift,
      paymentMethod: "cod",
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
    });

    // 5. Post-order WhatsApp confirmation link (Section 9.4)
    const whatsappConfirmText = [
      `Namaste Eskort Creations, I have placed COD Order ${order.id}.`,
      `• Total Amount: ₹${order.totalAmountPaise / 100} (including ₹50 COD fee)`,
      `• Delivery to: ${order.customer.fullName}, ${order.customer.city}, ${order.customer.state} (${order.customer.pincode})`,
      `Please confirm my dispatch turnaround.`,
    ].join("\n");

    const whatsappConfirmUrl = `https://wa.me/919929191655?text=${encodeURIComponent(
      whatsappConfirmText
    )}`;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
      whatsappConfirmUrl,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
