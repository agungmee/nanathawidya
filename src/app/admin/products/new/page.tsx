"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

interface VariantForm {
  name: string;
  value: string;
  additionalPrice: string;
  stock: string;
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload gagal");
  const data = await res.json();
  return data.url;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", categoryId: "", description: "",
    price: "", originalPrice: "", image: "", galleryUrls: "",
    videoUrl: "", videoFile: "", sku: "", stock: "", minOrder: "",
    isActive: true, isFeatured: false,
  });
  const [variants, setVariants] = useState<VariantForm[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.ok ? r.json() : []).then(setCategories);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm({ ...form, image: url });
    } catch {
      alert("Gagal upload gambar");
    }
    setUploading(false);
  };

  const addVariant = () => setVariants([...variants, { name: "", value: "", additionalPrice: "", stock: "" }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof VariantForm, val: string) => {
    const copy = [...variants];
    copy[i] = { ...copy[i], [field]: val };
    setVariants(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const galleryArr = form.galleryUrls.split("\n").map((u) => u.trim()).filter(Boolean);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price) || 0,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stock: form.stock ? parseInt(form.stock) : null,
        minOrder: form.minOrder ? parseInt(form.minOrder) : null,
        galleryUrls: galleryArr,
        variants: variants.filter((v) => v.name && v.value),
      }),
    });
    if (res.ok) router.push("/admin/products");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-4">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 className="text-xl font-bold text-primary mb-6">Tambah Produk</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-semibold text-muted block mb-1">Nama Produk *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-semibold text-muted block mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Kategori *</label>
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent">
            <option value="">Pilih kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Deskripsi</label>
          <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
        </div>

        {/* Price + Original Price + SKU */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Harga Jual (Rp) *</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Harga Normal (Rp)</label>
            <input type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Untuk harga coret" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Kode produk" />
          </div>
        </div>

        {/* Stock + Min Order */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Stok</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="0 = unlimited" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Min. Order</label>
            <input type="number" min="1" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Minimal pembelian" />
          </div>
        </div>

        {/* Image Upload + URL */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Gambar Utama</label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="https://... atau upload" />
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-gray-100 text-muted px-4 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all disabled:opacity-50">
                <Upload size={16} />
                {uploading ? "Upload..." : "Upload"}
              </button>
            </div>
          </div>
          {form.image && (
            <img src={form.image} alt="preview" className="mt-2 w-24 h-24 object-cover rounded-lg border" />
          )}
        </div>

        {/* Gallery */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Gallery URLs (satu URL per baris)</label>
          <textarea rows={3} value={form.galleryUrls} onChange={(e) => setForm({ ...form, galleryUrls: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" placeholder="https://...&#10;https://..." />
        </div>

        {/* Video */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Video URL (YouTube)</label>
            <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Video File URL (upload)</label>
            <input value={form.videoFile} onChange={(e) => setForm({ ...form, videoFile: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="https://..." />
          </div>
        </div>

        {/* Variants inline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-muted">Varian Produk</label>
            <button type="button" onClick={addVariant} className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
              <Plus size={14} /> Tambah Varian
            </button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2 items-end">
              <div className="flex-1">
                <input value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} placeholder="Nama (contoh: Ukuran)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-accent" />
              </div>
              <div className="flex-1">
                <input value={v.value} onChange={(e) => updateVariant(i, "value", e.target.value)} placeholder="Value (contoh: 50kg)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-accent" />
              </div>
              <div className="w-20">
                <input type="number" value={v.additionalPrice} onChange={(e) => updateVariant(i, "additionalPrice", e.target.value)} placeholder="+Rp" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-accent" />
              </div>
              <button type="button" onClick={() => removeVariant(i)} className="p-2 hover:bg-red-50 rounded-lg">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
            Aktif
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
            Featured (Unggulan)
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </form>
    </div>
  );
}
