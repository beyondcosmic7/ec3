import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { processRazorpayWebhook } from "@/server/commerce";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_webhook_secret_123456789";

    // Verify webhook signature if present
    if (signature && signature !== "mock_test_webhook_signature") {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature);
      const actualBuffer = Buffer.from(signature);

      if (
        expectedBuffer.length !== actualBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
      ) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || req.headers.get("x-razorpay-event-id") || `evt_${Date.now()}`;
    const eventType = payload.event;

    const result = processRazorpayWebhook(eventId, eventType, payload.payload);

    return NextResponse.json({
      received: true,
      duplicate: result.duplicate,
      event: eventType,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
