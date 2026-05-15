"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string | null;
  url: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/admin/banners");
    if (res.ok) setBanners(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner ini?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[idx].sortOrder;
    newBanners[idx] = { ...newBanners[idx], sortOrder: newBanners[swapIdx].sortOrder };
    newBanners[swapIdx] = { ...newBanners[swapIdx], sortOrder: temp };
    newBanners.sort((a, b) => a.sortOrder - b.sortOrder);

    await Promise.all([
      fetch(`/api/admin/banners/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sortOrder: newBanners.findIndex((b) => b.id === id) + 1 }) }),
      fetch(`/api/admin/banners/${newBanners[swapIdx].id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sortOrder: swapIdx + 1 }) }),
    ]);

    setBanners(newBanners);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">Banner</h1>
        <Link href="/admin/banners/new" className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-hover transition-all">
          <Plus size={16} /> Tambah Banner
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-10 text-muted">Belum ada banner</div>
      ) : (
        <div className="space-y-3">
          {banners.map((b, idx) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => handleReorder(b.id, "up")} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => handleReorder(b.id, "down")} disabled={idx === banners.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                  <ArrowDown size={14} />
                </button>
              </div>
              <div className="w-20 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {b.image && <img src={b.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary truncate">{b.title || "Tanpa judul"}</p>
                {b.subtitle && <p className="text-xs text-muted truncate">{b.subtitle}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${b.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {b.isActive ? "Aktif" : "Nonaktif"}
              </span>
              <div className="flex items-center gap-1">
                <Link href={`/admin/banners/${b.id}/edit`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Pencil size={14} className="text-muted" />
                </Link>
                <button onClick={() => handleDelete(b.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
