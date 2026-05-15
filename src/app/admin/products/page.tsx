"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  image: string | null;
  isActive: boolean;
  isFeatured: boolean;
  stock: number | null;
  sku: string | null;
  category: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts(products.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">Produk ({products.length})</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-all">
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-muted">Belum ada produk</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted">Produk</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted hidden sm:table-cell">Kategori</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted">Harga</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted hidden md:table-cell">Stok</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted hidden md:table-cell">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const discount = p.originalPrice && p.originalPrice > p.price
                    ? Math.round((1 - p.price / p.originalPrice) * 100)
                    : 0;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-semibold text-primary">{p.name}</p>
                            <p className="text-xs text-muted">{p.sku || p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted hidden sm:table-cell">{p.category?.name || "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-semibold">
                          {formatPrice(p.price)}
                          {discount > 0 && (
                            <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">-{discount}%</span>
                          )}
                        </div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-[11px] text-muted line-through">{formatPrice(p.originalPrice)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-muted hidden md:table-cell">
                        {p.stock !== null ? p.stock : "∞"}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-2">
                          {p.isFeatured && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">F</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                            {p.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${p.id}/edit`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil size={14} className="text-muted" />
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
