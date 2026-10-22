import { NextRequest, NextResponse } from "next/server";
import { validateAndPriceCart, createRazorpayOrder } from "@/server/commerce";
import { CartItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, pincode } = body;

    const pricing = validateAndPriceCart(items as CartItem[], pincode || "302001", "online");
    if (!pricing.valid) {
      return NextResponse.json({ success: false, error: pricing.error }, { status: 400 });
    }

    const receiptId = `rcpt_${Date.now()}`;
    const rzpOrder = await createRazorpayOrder(pricing.totalAmountPaise, receiptId);

    return NextResponse.json({
      success: true,
      razorpayOrder: rzpOrder,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key_id",
      amountPaise: pricing.totalAmountPaise,
      currency: "INR",
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
