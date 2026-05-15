import { NextRequest, NextResponse } from "next/server";
import { pb, resolveStoreId } from "@/lib/pocketbase";

export async function POST(req: NextRequest) {
  try {
    const storeId = await resolveStoreId();
    const body = await req.json();
    const message = await pb.collection('contactMessages').create({
      name: body.name,
      email: body.email || "",
      phone: body.phone || null,
      subject: body.subject || null,
      message: body.message,
      storeId: storeId || undefined,
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error('PocketBase contact API error:', error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
