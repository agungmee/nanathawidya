"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", subtitle: "", image: "", url: "", isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/admin/banners");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/banners" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-4">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 className="text-xl font-bold text-primary mb-6">Tambah Banner</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Judul</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Subjudul</label>
          <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Image URL *</label>
          <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Link URL (opsional)</label>
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="/category/karung-plastik" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
          Aktif
        </label>
        <button type="submit" disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Banner"}
        </button>
      </form>
    </div>
  );
}
