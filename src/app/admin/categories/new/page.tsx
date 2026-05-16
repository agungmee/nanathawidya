"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload gagal");
  const data = await res.json();
  return data.url;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm({ ...form, image: url });
    } catch {
      setUploadError("Gagal upload gambar. Coba file lain.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/admin/categories");
      else {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err.error || "Gagal menyimpan kategori");
      }
    } catch {
      setSubmitError("Gagal menyimpan kategori");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/categories" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-4">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 className="text-xl font-bold text-primary mb-6">Tambah Kategori</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Nama *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" />
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
          <label className="text-xs font-semibold text-muted block mb-1">Gambar</label>
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
          {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          {form.image && (
            <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img src={form.image} alt="preview" className="h-12 w-auto rounded" />
              <span className="text-xs text-muted">Preview</span>
            </div>
          )}
        </div>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <button type="submit" disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Kategori"}
        </button>
      </form>
    </div>
  );
}
