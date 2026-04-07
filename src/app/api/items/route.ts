import { NextRequest, NextResponse } from "next/server";
import { searchMarketItems } from "@/lib/steam";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const start = parseInt(searchParams.get("start") || "0", 10);
  const count = Math.min(parseInt(searchParams.get("count") || "100", 10), 100);
  const sort = searchParams.get("sort") || "popular";
  const dir = searchParams.get("dir") || "desc";

  try {
    const data = await searchMarketItems(start, count, sort, dir, query);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Steam API error" },
      { status: 502 }
    );
  }
}
