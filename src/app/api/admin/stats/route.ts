import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function getAdminToken() {
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;
  if (!email || !password) return "";
  const res = await fetch(`${PB_URL()}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.token || "";
}

async function fetchWithToken(url: string, token: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return { items: [] };
  return res.json();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function groupByPeriod(items: any[], field: string, period: string) {
  const map = new Map<string, { count: number; revenue: number }>();

  if (period === "daily") {
    for (const item of items) {
      const d = new Date((item as any)[field]);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
      const entry = map.get(key) || { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += (item as any).totalAmount || 0;
      map.set(key, entry);
    }
  } else if (period === "weekly") {
    for (const item of items) {
      const d = new Date((item as any)[field]);
      const dayOfWeek = d.getDay();
      const key = DAYS[dayOfWeek];
      const entry = map.get(key) || { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += (item as any).totalAmount || 0;
      map.set(key, entry);
    }
  } else {
    for (const item of items) {
      const d = new Date((item as any)[field]);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = MONTHS[d.getMonth()];
      const entry = map.get(key) || { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += (item as any).totalAmount || 0;
      map.set(key, entry);
    }
  }

  return Array.from(map.entries()).map(([key, data]) => ({ key, ...data }));
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const token = await getAdminToken();
    const slug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
    const storeRes = await fetchWithToken(
      `${PB_URL()}/api/collections/stores/records?filter=${encodeURIComponent(`slug="${slug}"`)}`, token
    );
    const store = storeRes.items?.[0];
    if (!store) throw new Error('Store not found');
    const storeId = store.id;

    const period = req.nextUrl.searchParams.get("period") || "monthly";

    const [productsData, categoriesData, bannersData, messagesData, ordersData] = await Promise.all([
      fetchWithToken(
        `${PB_URL()}/api/collections/products/records?filter=${encodeURIComponent(`storeId = "${storeId}"`)}&fields=id`, token
      ),
      fetchWithToken(
        `${PB_URL()}/api/collections/categories/records?filter=${encodeURIComponent(`storeId = "${storeId}"`)}&fields=id`, token
      ),
      fetchWithToken(
        `${PB_URL()}/api/collections/banners/records?filter=${encodeURIComponent(`storeId = "${storeId}" && isActive = true`)}&fields=id`, token
      ),
      fetchWithToken(
        `${PB_URL()}/api/collections/contactMessages/records?filter=${encodeURIComponent(`storeId = "${storeId}"`)}&fields=id,isRead,created`, token
      ),
      fetchWithToken(
        `${PB_URL()}/api/collections/orders/records?filter=${encodeURIComponent(`storeId = "${storeId}"`)}&fields=id,status,created,totalAmount`, token
      ),
    ]);

    const totalProducts = productsData.items?.length || 0;
    const totalCategories = categoriesData.items?.length || 0;
    const totalBanners = bannersData.items?.length || 0;
    const allMessages = messagesData.items || [];
    const allOrders = ordersData.items || [];

    const totalMessages = allMessages.length;
    const unreadMessages = allMessages.filter((m: any) => !m.isRead).length;
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter((o: any) => o.status === "pending").length;

    const orderTimeline = groupByPeriod(allOrders, "created", period);
    const messageTimeline = groupByPeriod(allMessages, "created", period);
    const revenueByPeriod = orderTimeline.map((o) => ({ key: o.key, revenue: o.revenue }));

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalBanners,
      totalMessages,
      unreadMessages,
      totalOrders,
      pendingOrders,
      orderTimeline,
      messageTimeline,
      revenueByPeriod,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
