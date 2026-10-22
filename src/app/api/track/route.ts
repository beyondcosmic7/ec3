import { NextRequest, NextResponse } from "next/server";
import { getOrderByPhoneAndId } from "@/server/commerce";

// Simple in-memory rate limiter: max 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return true;
  }

  if (entry.count >= 15) {
    return false;
  }

  entry.count++;
  return true;
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many tracking requests. Please wait a minute before retrying." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");

    if (!orderId || !phone) {
      return NextResponse.json(
        { success: false, error: "Order ID and phone number are required." },
        { status: 400 }
      );
    }

    const order = getOrderByPhoneAndId(orderId, phone);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "No order found matching that Order ID and phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
