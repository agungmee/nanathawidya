import { NextRequest, NextResponse } from "next/server";
import { pb, resolveStoreId, buildStoreFilter } from "@/lib/pocketbase";

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) return NextResponse.json([]);

    const storeId = await resolveStoreId();
    if (!storeId) return NextResponse.json([]);

    const variants = await pb.collection('variants').getFullList({
      filter: buildStoreFilter(storeId, `productId = "${productId}"`),
      sort: 'name',
    });

    return NextResponse.json(variants);
  } catch {
    return NextResponse.json([]);
  }
}
