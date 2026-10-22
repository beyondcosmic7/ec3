import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/server/commerce";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let orders = getAllOrders();
    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
