import { NextRequest, NextResponse } from "next/server";
import { reserveInventory, releaseReservation } from "@/server/commerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Items are required" }, { status: 400 });
    }

    const reservation = reserveInventory(items);

    if (!reservation.success) {
      return NextResponse.json(
        { success: false, error: reservation.error },
        { status: 409 } // Conflict / Out-of-stock race condition
      );
    }

    return NextResponse.json({
      success: true,
      reservationId: reservation.reservationId,
      expiresAt: reservation.expiresAt,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get("reservationId");

    if (reservationId) {
      releaseReservation(reservationId);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message || "An unexpected error occurred" }, { status: 500 });
  }
}
