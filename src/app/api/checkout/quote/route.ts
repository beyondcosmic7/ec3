import { NextRequest, NextResponse } from "next/server";
import { validateAndPriceCart } from "@/server/commerce";
import { PaymentMethodSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, pincode, paymentMethod } = body;

    const parsedMethod = PaymentMethodSchema.catch("online").parse(paymentMethod);
    const result = validateAndPriceCart(items, pincode || "302001", parsedMethod);

    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      quote: {
        subtotalPaise: result.subtotalPaise,
        shippingFeePaise: result.shippingFeePaise,
        codFeePaise: result.codFeePaise,
        totalAmountPaise: result.totalAmountPaise,
        taxableAmountPaise: result.taxableAmountPaise,
        cgstPaise: result.cgstPaise,
        sgstPaise: result.sgstPaise,
        igstPaise: result.igstPaise,
        totalTaxPaise: result.totalTaxPaise,
        isInterstate: result.isInterstate,
        deliveryEta: result.deliveryEta,
        deliveryCity: result.deliveryCity,
        deliveryState: result.deliveryState,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
