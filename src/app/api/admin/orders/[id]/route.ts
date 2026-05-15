import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pb = await getAdminClient();
    const body = await req.json();

    const current = await pb.collection('orders').getOne(params.id);

    if (body.status && body.status !== current.status) {
      const store = await pb.collection('stores').getFirstListItem(`slug="${process.env.POCKETBASE_STORE_SLUG || 'nanathawidya'}"`);

      await pb.collection('orders').update(params.id, { status: body.status });

      await pb.collection('orderLogs').create({
        orderId: params.id,
        fromStatus: current.status,
        toStatus: body.status,
        note: body.note || null,
        userId: session.user?.id || null,
        storeId: store.id,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
