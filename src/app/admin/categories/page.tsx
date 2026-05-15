"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      const err = await res.json();
      alert(err.error || "Gagal menghapus");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">Kategori</h1>
        <Link href="/admin/categories/new" className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-all">
          <Plus size={16} /> Tambah Kategori
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 text-muted">Belum ada kategori</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-muted">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-muted">Slug</th>
                <th className="text-center px-4 py-3 font-semibold text-muted">Jumlah Produk</th>
                <th className="text-right px-4 py-3 font-semibold text-muted">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.image && (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={c.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-semibold text-primary">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.slug}</td>
                  <td className="px-4 py-3 text-center font-semibold">{c._count.products}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/categories/${c.id}/edit`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Pencil size={14} className="text-muted" />
                      </Link>
                      <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
