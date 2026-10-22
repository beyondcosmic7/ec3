import { NextRequest, NextResponse } from "next/server";
import { exportProductsCsv, importProductsCsv } from "@/server/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const csvData = exportProductsCsv();
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products.csv"`,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const csvContent = body.csvContent;

    if (typeof csvContent !== "string" || !csvContent.trim()) {
      return NextResponse.json(
        { success: false, error: "csvContent string is required" },
        { status: 400 }
      );
    }

    const report = importProductsCsv(csvContent);
    return NextResponse.json(report, { status: report.success ? 200 : 422 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
