"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Phone, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function BottomNav() {
  const pathname = usePathname();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = useCartStore((s) => s.totalItems());

  const links = [
    { href: "/", icon: Home, label: "Beranda" },
    { href: "/category/karung-plastik", icon: Grid3X3, label: "Katalog" },
    { href: "/contact", icon: Phone, label: "Kontak" },
    { href: "#", icon: ShoppingCart, label: `Keranjang${itemCount > 0 ? ` (${itemCount})` : ""}`, onClick: toggleCart },

  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          if (link.onClick) {
            return (
              <button key={link.label} onClick={link.onClick} className="flex flex-col items-center gap-0.5 px-3 py-1">
                <link.icon size={22} className={isActive ? "text-accent" : "text-muted"} />
                <span className={`text-[10px] ${isActive ? "text-accent font-semibold" : "text-muted"}`}>{link.label}</span>
              </button>
            );
          }
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <link.icon size={22} className={isActive ? "text-accent" : "text-muted"} />
              <span className={`text-[10px] ${isActive ? "text-accent font-semibold" : "text-muted"}`}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
