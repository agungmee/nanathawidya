import Link from "next/link";
import { Package, Tags, Image, MessageSquare, ShoppingBag, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { DashboardCharts } from "./dashboard-charts";

export const dynamic = "force-dynamic";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function fetchWithToken(url: string, token: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return { items: [] };
  return res.json();
}

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

async function getStats() {
  try {
    const session = await auth();
    if (!session?.user) return null;

    const token = await getAdminToken();
    const slug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
    const storeRes = await fetchWithToken(
      `${PB_URL()}/api/collections/stores/records?filter=${encodeURIComponent(`slug="${slug}"`)}`, token
    );
    const store = storeRes.items?.[0];
    if (!store) return null;
    const storeId = store.id;

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
        `${PB_URL()}/api/collections/contactMessages/records?filter=${encodeURIComponent(`storeId = "${storeId}"`)}&fields=id,isRead`, token
      ),
      fetchWithToken(
        `${PB_URL()}/api/collections/orders/records?filter=${encodeURIComponent(`storeId = "${storeId}"`)}&sort=-created&fields=id,status,invoiceNumber,totalAmount,items,created`, token
      ),
    ]);

    const messages = messagesData.items || [];
    const orders = ordersData.items || [];

    const unreadMessages = messages.filter((m: any) => !m.isRead).length;
    const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

    return {
      totalProducts: productsData.items?.length || 0,
      totalCategories: categoriesData.items?.length || 0,
      totalBanners: bannersData.items?.length || 0,
      totalMessages: messages.length,
      unreadMessages,
      totalOrders: orders.length,
      pendingOrders,
      recentOrders: orders.slice(0, 5),
    };
  } catch (e) {
    console.error('Dashboard stats error:', e);
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  if (!stats) {
    return <div className="text-center py-10 text-muted">Gagal memuat data. Pastikan PocketBase tersedia.</div>;
  }

  const cards = [
    { label: "Total Produk", value: stats.totalProducts, icon: Package, href: "/admin/products", color: "bg-blue-500" },
    { label: "Kategori", value: stats.totalCategories, icon: Tags, href: "/admin/categories", color: "bg-green-500" },
    { label: "Pesanan", value: stats.totalOrders, icon: ShoppingBag, href: "/admin/orders", color: "bg-indigo-500", badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : undefined },
    { label: "Banner Aktif", value: stats.totalBanners, icon: Image, href: "/admin/banners", color: "bg-purple-500" },
    { label: "Pesan Masuk", value: stats.totalMessages, icon: MessageSquare, href: "/admin/messages", color: "bg-amber-500", badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} baru` : undefined },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon size={18} className="text-white" />
              </div>
              {card.badge && (
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">{card.badge}</span>
              )}
            </div>
            <p className="text-xl font-bold text-primary">{card.value}</p>
            <p className="text-xs text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <DashboardCharts />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-primary">Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted text-sm">Belum ada pesanan</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentOrders.map((order: any) => (
                <Link key={order.id} href="/admin/orders" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-primary">{order.invoiceNumber || "-"}</p>
                    <p className="text-xs text-muted">{(order.items || []).length} item</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">Rp {(order.totalAmount || 0).toLocaleString("id-ID")}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      order.status === "pending" ? "bg-amber-100 text-amber-600" :
                      order.status === "completed" ? "bg-green-100 text-green-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
