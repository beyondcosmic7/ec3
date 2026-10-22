import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, processRefund } from "@/server/commerce";
import { generateWhatsAppOrderMessage } from "@/server/admin";
import { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const whatsappLinks = {
      confirm: generateWhatsAppOrderMessage(order, "confirm"),
      dispatch: generateWhatsAppOrderMessage(order, "dispatch"),
      delivery: generateWhatsAppOrderMessage(order, "delivery"),
    };

    return NextResponse.json({
      success: true,
      order,
      whatsappLinks,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, carrier, trackingNumber } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updated = updateOrderStatus(id, status as OrderStatus, carrier, trackingNumber);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const whatsappLinks = {
      confirm: generateWhatsAppOrderMessage(updated, "confirm"),
      dispatch: generateWhatsAppOrderMessage(updated, "dispatch"),
      delivery: generateWhatsAppOrderMessage(updated, "delivery"),
    };

    return NextResponse.json({
      success: true,
      order: updated,
      whatsappLinks,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, amountPaise, reason } = body;

    if (action === "refund") {
      const result = processRefund(id, amountPaise, reason);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        refundId: result.refundId,
        order: result.order,
      });
    }

    return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
