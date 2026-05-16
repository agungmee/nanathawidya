"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

function uploadFile(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText).url);
      else {
        try { reject(new Error(JSON.parse(xhr.responseText).error || "Upload gagal")); }
        catch { reject(new Error("Upload gagal")); }
      }
    };
    xhr.onerror = () => reject(new Error("Upload gagal"));
    xhr.send(fd);
  });
}

export default function NewBannerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    title: "", subtitle: "", image: "", url: "", isActive: true,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadProgress(0);
    setUploading(true);
    try {
      const url = await uploadFile(file, setUploadProgress);
      setForm({ ...form, image: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload gambar");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err.error || "Gagal menyimpan banner");
      }
    } catch {
      setSubmitError("Gagal menyimpan banner");
    }
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
          <label className="text-xs font-semibold text-muted block mb-1">Gambar *</label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="https://... atau upload" />
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-gray-100 text-muted px-4 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all disabled:opacity-50">
                <Upload size={16} />
                {uploading ? `${uploadProgress}%` : "Upload"}
              </button>
            </div>
          </div>
          {uploading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-accent h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          {form.image && (
            <div className="mt-2 rounded-xl overflow-hidden bg-gray-50">
              <img src={form.image} alt="preview" className="w-full h-32 object-cover" />
            </div>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Link URL (opsional)</label>
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="/category/karung-plastik" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
          Aktif
        </label>
        {submitError && <p className="text-sm text-red-500">{submitError}</p>}
        <button type="submit" disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50">
          {saved ? "Tersimpan!" : loading ? "Menyimpan..." : "Simpan Banner"}
        </button>
      </form>
    </div>
  );
}
