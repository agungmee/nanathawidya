"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, Tags, Image, Settings, MessageSquare, LogOut, Menu, X, Printer, ShoppingBag, Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/banners", label: "Banner", icon: Image },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { href: "/admin/messages", label: "Pesan Masuk", icon: MessageSquare },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/admin" className="flex items-center gap-2 font-bold text-sm">
              <Printer size={20} className="text-accent" />
              Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-white/70 hover:text-white transition-colors" target="_blank">Lihat Situs</Link>
            <button onClick={() => import("next-auth/react").then((m) => m.signOut({ callbackUrl: "/login" }))} className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors">
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 pt-14 lg:pt-0 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="p-3 space-y-1 pt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-accent text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
