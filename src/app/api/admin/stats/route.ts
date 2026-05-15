import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pb = await getAdminClient();

    const store = await pb.collection('stores').getFirstListItem(`slug="${process.env.POCKETBASE_STORE_SLUG || 'nanathawidya'}"`);
    const storeId = store.id;

    const [products, categories, banners, messages, orders] = await Promise.all([
      pb.collection('products').getFullList({ filter: `storeId = "${storeId}"`, fields: 'id' }),
      pb.collection('categories').getFullList({ filter: `storeId = "${storeId}"`, fields: 'id' }),
      pb.collection('banners').getFullList({ filter: `storeId = "${storeId}" && isActive = true`, fields: 'id' }),
      pb.collection('contactMessages').getFullList({ filter: `storeId = "${storeId}"`, fields: 'id,isRead' }),
      pb.collection('orders').getFullList({ filter: `storeId = "${storeId}"`, fields: 'id,status,created,totalAmount' }),
    ]);

    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalBanners = banners.length;
    const totalMessages = messages.length;
    const unreadMessages = messages.filter((m: any) => !m.isRead).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

    // Group by month
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthlyMap = new Map<string, { count: number; revenue: number }>();
    months.forEach((m) => monthlyMap.set(m, { count: 0, revenue: 0 }));

    for (const o of orders as any[]) {
      const month = months[new Date(o.created).getMonth()];
      const existing = monthlyMap.get(month) || { count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += o.totalAmount || 0;
      monthlyMap.set(month, existing);
    }

    const monthlyOrders = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }));

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalBanners,
      totalMessages,
      unreadMessages,
      totalOrders,
      pendingOrders,
      monthlyOrders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
