"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Upload } from "lucide-react";

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
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).url);
      } else {
        try { reject(new Error(JSON.parse(xhr.responseText).error || "Upload gagal")); }
        catch { reject(new Error("Upload gagal")); }
      }
    };
    xhr.onerror = () => reject(new Error("Upload gagal"));
    xhr.send(fd);
  });
}

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    logo: "",
    description: "",
    tagline: "",
    wa_phone: "",
    company_email: "",
    company_address: "",
    company_city: "",
    company_province: "",
    company_desc: "",
    operational_hours: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : {})
      .then((data: Record<string, unknown>) => {
        setForm((prev) => ({
          ...prev,
          company_name: String(data.company_name || prev.company_name),
          logo: String(data.logo || prev.logo),
          description: String(data.description || prev.description),
          tagline: String(data.tagline || ""),
          wa_phone: String(data.wa_phone || prev.wa_phone),
          company_email: String(data.company_email || prev.company_email),
          company_address: String(data.company_address || prev.company_address),
          company_city: String(data.company_city || prev.company_city),
          company_province: String(data.company_province || prev.company_province),
          company_desc: String(data.company_desc || prev.company_desc),
          operational_hours: String(data.operational_hours || prev.operational_hours),
        }));
        setInitialLoading(false);
      });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadProgress(0);
    setUploading(true);
    try {
      const url = await uploadFile(file, setUploadProgress);
      setForm({ ...form, logo: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload logo");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  if (initialLoading) return <div className="text-center py-10 text-muted">Memuat...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-primary mb-6">Pengaturan</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {/* Company Name */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Nama Perusahaan</label>
          <input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="PT. Nirwasita Athawidya Nusantara" />
        </div>

        {/* Tagline */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Tagline / Slogan</label>
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Produsen karung plastik dan plastik packing" />
        </div>

        {/* Logo */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Logo Perusahaan</label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="https://... atau upload" />
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
          {form.logo && (
            <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img src={form.logo} alt="logo preview" className="h-10 w-auto" />
              <span className="text-xs text-muted">Preview</span>
            </div>
          )}
        </div>

        {/* Description (meta) */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Deskripsi Singkat (SEO)</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" placeholder="Produsen karung plastik PP woven..." />
        </div>

        <hr className="border-gray-100" />

        {/* WhatsApp */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Nomor WhatsApp</label>
          <input value={form.wa_phone} onChange={(e) => setForm({ ...form, wa_phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="6282139742007" />
          <p className="text-xs text-muted mt-1">Gunakan format internasional tanpa +</p>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Email Perusahaan</label>
          <input value={form.company_email} onChange={(e) => setForm({ ...form, company_email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="ajpnirwasita@gmail.com" />
        </div>

        {/* Address */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-semibold text-muted block mb-1">Alamat</label>
            <input value={form.company_address} onChange={(e) => setForm({ ...form, company_address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Bandarejo Tama 47" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Kota</label>
            <input value={form.company_city} onChange={(e) => setForm({ ...form, company_city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Surabaya" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Provinsi</label>
            <input value={form.company_province} onChange={(e) => setForm({ ...form, company_province: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Jawa Timur" />
          </div>
        </div>

        {/* Company Description */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Deskripsi Perusahaan (tentang)</label>
          <textarea rows={4} value={form.company_desc} onChange={(e) => setForm({ ...form, company_desc: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
        </div>

        {/* Operational Hours */}
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Jam Operasional</label>
          <input value={form.operational_hours} onChange={(e) => setForm({ ...form, operational_hours: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Senin - Sabtu: 08.00 - 18.00" />
        </div>

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50">
          {saved ? "Tersimpan!" : <><Save size={16} /> Simpan Pengaturan</>}
        </button>
      </form>
    </div>
  );
}
