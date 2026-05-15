"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SORT_OPTIONS, PRICE_RANGES, type SortOption } from "@/types";
import type { Product } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      });
  }, []);

  const results = useMemo(() => {
    let filtered = allProducts;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }
    const range = PRICE_RANGES[priceRange];
    if (range) {
      filtered = filtered.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    const sorted = [...filtered];
    switch (sortBy) {
      case "cheapest": sorted.sort((a, b) => a.price - b.price); break;
      case "most_expensive": sorted.sort((a, b) => b.price - a.price); break;
      case "name_az": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name_za": sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return sorted;
  }, [query, sortBy, priceRange, allProducts]);

  return (
    <div className="p-4 sm:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
          setQuery(q);
          window.history.replaceState({}, "", `/search?q=${encodeURIComponent(q)}`);
        }}
        className="relative mb-4"
      >
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Cari produk..."
          className="w-full border border-gray-200 rounded-xl px-12 py-3.5 text-sm outline-none focus:border-accent transition-colors"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover">
          Cari
        </button>
      </form>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">
              {results.length > 0 ? `${results.length} produk ditemukan` : "Tidak ada produk"}
              {query && <> untuk &quot;<span className="font-semibold">{query}</span>&quot;</>}
            </p>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-muted hover:text-primary">
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>

          {showFilters && (
            <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted block mb-2">Urutkan</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted block mb-2">Rentang Harga</label>
                <select value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                  {PRICE_RANGES.map((r, i) => (
                    <option key={i} value={i}>{r.label}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => { setSortBy("newest"); setPriceRange(0); }} className="flex items-center gap-1 text-xs text-muted hover:text-primary self-end pb-2">
                <X size={14} /> Reset
              </button>
            </div>
          )}

          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="text-center py-20 text-muted">
              <Search size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="font-semibold">Produk tidak ditemukan</p>
              <p className="text-sm mt-2">Coba kata kunci lain atau hubungi kami untuk informasi produk</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
