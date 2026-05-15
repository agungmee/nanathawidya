"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Phone, Printer, Home, Grid3X3 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useCartStore } from "@/lib/cart-store";
import { WA_PHONE } from "@/lib/store-data";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 hover:bg-primary-light rounded-lg">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center">
            <img
              src="https://everz-digital.site/wp-content/uploads/2026/05/70d9c3b2-65bf-4771-8d82-611a4b77aa13-removebg-preview.png"
              alt="PT. Nirwasita Athawidya Nusantara"
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-accent transition-colors">Beranda</Link>
            <Link href="/category/karung-plastik" className="hover:text-accent transition-colors">Katalog</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Kontak</Link>
            <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Konsultasi
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-primary-light rounded-lg">
              <Search size={20} />
            </button>
            <button onClick={toggleCart} className="p-2 hover:bg-primary-light rounded-lg relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-all">
              <Phone size={16} />
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`; }} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full bg-primary-light text-white placeholder-white/60 rounded-xl px-4 py-3 pl-12 outline-none"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-primary shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-bold text-sm">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-primary-light rounded-lg">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col py-2">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-primary-light transition-colors">
                <Home size={20} className="text-accent" />
                <span className="text-sm font-medium">Beranda</span>
              </Link>
              <Link href="/category/karung-plastik" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-primary-light transition-colors">
                <Grid3X3 size={20} className="text-accent" />
                <span className="text-sm font-medium">Katalog Produk</span>
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-primary-light transition-colors">
                <Phone size={20} className="text-accent" />
                <span className="text-sm font-medium">Kontak Kami</span>
              </Link>
              <a href={`https://wa.me/${WA_PHONE}`} onClick={() => setMenuOpen(false)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6 py-4 hover:bg-primary-light transition-colors">
                <WhatsAppIcon size={20} className="text-accent" />
                <span className="text-sm font-medium">Konsultasi Gratis</span>
              </a>
            </nav>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </header>
  );
}
