import { NextRequest, NextResponse } from "next/server";
import { pb, resolveStoreId } from "@/lib/pocketbase";

export async function POST(req: NextRequest) {
  try {
    const storeId = await resolveStoreId();
    if (!storeId) return NextResponse.json({ error: "Store not found" }, { status: 400 });

    const body = await req.json();
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await pb.collection('orders').create({
      invoiceNumber,
      customerName: body.customerName || "",
      customerPhone: body.customerPhone || "",
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      status: "pending",
      whatsappSent: true,
      storeId,
    });

    // Create order log
    await pb.collection('orderLogs').create({
      orderId: order.id,
      toStatus: "pending",
      note: "Order dibuat via WhatsApp",
      storeId,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
