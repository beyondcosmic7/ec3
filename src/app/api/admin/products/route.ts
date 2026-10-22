import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/server/catalog";
import { saveProduct } from "@/server/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Auto-compute price_paise and mrp_paise if not provided
    if (body.price_inr && !body.price_paise) {
      body.price_paise = Math.round(Number(body.price_inr) * 100);
    }
    if (body.mrp_inr && !body.mrp_paise) {
      body.mrp_paise = Math.round(Number(body.mrp_inr) * 100);
    }

    const result = saveProduct(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: result.product }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, size, stock } = body;
    if (!slug || !size || typeof stock !== "number") {
      return NextResponse.json(
        { success: false, error: "slug, size and numeric stock are required" },
        { status: 400 }
      );
    }
    const { updateProductStock } = await import("@/server/admin");
    const result = updateProductStock(slug, size, stock);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, product: result.product });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ success: false, error: "slug query param is required" }, { status: 400 });
    }
    const { deleteProduct } = await import("@/server/admin");
    const success = deleteProduct(slug);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

