import { NextResponse } from "next/server";
import { DEMO_PRODUCTS } from "@/lib/store-data";

export async function GET() {
  return NextResponse.json(DEMO_PRODUCTS);
}
