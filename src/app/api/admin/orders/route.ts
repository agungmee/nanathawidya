import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function getAdminToken() {
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;
  const res = await fetch(`${PB_URL()}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.token || "";
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const role = (session.user as any).role;
    const storeId = (session.user as any).storeId;

    let filter = '';
    if (role !== 'admin' && storeId) {
      filter = `storeId = "${storeId}"`;
    }
    const qs = filter ? `filter=${encodeURIComponent(filter)}` : '';
    const res = await fetch(`${PB_URL()}/api/collections/orders/records?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const pageData = await res.json();
    const orders = pageData.items || [];

    const mapped = await Promise.all(orders.map(async (o: any) => {
      let logs: any[] = [];
      try {
        const logParamsStr = `filter=${encodeURIComponent(`orderId = "${o.id}"`)}`;
        const logRes = await fetch(`${PB_URL()}/api/collections/orderLogs/records?${logParamsStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (logRes.ok) {
          const logData = await logRes.json();
          logs = logData.items || [];
        }
      } catch {}

      return {
        ...o,
        items: o.items || [],
        logs,
        createdAt: o.created,
      };
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
