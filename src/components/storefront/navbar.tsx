"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Phone, Printer } from "lucide-react";
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

      {menuOpen && (
        <div className="lg:hidden bg-primary-light border-t border-white/10">
          <nav className="flex flex-col py-2 px-4 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 hover:text-accent">Beranda</Link>
            <Link href="/category/karung-plastik" onClick={() => setMenuOpen(false)} className="py-3 hover:text-accent">Katalog Produk</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="py-3 hover:text-accent">Kontak Kami</Link>
            <a href={`https://wa.me/${WA_PHONE}`} onClick={() => setMenuOpen(false)} className="py-3 hover:text-accent">Konsultasi Gratis</a>
          </nav>
        </div>
      )}
    </header>
  );
}
