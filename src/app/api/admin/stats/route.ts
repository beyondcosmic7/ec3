import { NextResponse } from "next/server";
import { getOrderStats } from "@/server/commerce";
import { getAllProducts } from "@/server/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = getOrderStats();
    const products = getAllProducts();

    // Calculate low stock items (stock <= 2 for any size)
    const lowStockItems: { slug: string; name: string; size: string; stock: number }[] = [];
    for (const p of products) {
      for (const [size, qty] of Object.entries(p.stock_by_size)) {
        if (qty <= 2) {
          lowStockItems.push({
            slug: p.slug,
            name: p.name,
            size,
            stock: qty,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        totalProducts: products.length,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems.slice(0, 8),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
