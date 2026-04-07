import { NextRequest, NextResponse } from "next/server";
import { getItemPriceOverview } from "@/lib/steam";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Missing name parameter" }, { status: 400 });
  }

  try {
    const data = await getItemPriceOverview(name);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Steam API error" },
      { status: 502 }
    );
  }
}
