"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.ok ? r.json() : [])
      .then((cats) => {
        const c = cats.find((cat: { id: string }) => cat.id === params.id);
        if (c) {
          setForm({ name: c.name, slug: c.slug, description: c.description || "", image: c.image || "" });
        }
        setInitialLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/categories/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/admin/categories");
    setLoading(false);
  };

  if (initialLoading) return <div className="text-center py-10 text-muted">Memuat...</div>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/categories" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-4">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 className="text-xl font-bold text-primary mb-6">Edit Kategori</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Nama *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Deskripsi</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Image URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
