"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    wa_phone: "", company_email: "", company_address: "",
    company_city: "", company_province: "", company_desc: "",
    operational_hours: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : {})
      .then((data: Record<string, unknown>) => {
        if (data.wa_phone) setForm((prev) => ({ ...prev, wa_phone: String(data.wa_phone) }));
        if (data.company_email) setForm((prev) => ({ ...prev, company_email: String(data.company_email) }));
        if (data.company_address) setForm((prev) => ({ ...prev, company_address: String(data.company_address) }));
        if (data.company_city) setForm((prev) => ({ ...prev, company_city: String(data.company_city) }));
        if (data.company_province) setForm((prev) => ({ ...prev, company_province: String(data.company_province) }));
        if (data.company_desc) setForm((prev) => ({ ...prev, company_desc: String(data.company_desc) }));
        if (data.operational_hours) setForm((prev) => ({ ...prev, operational_hours: String(data.operational_hours) }));
        setInitialLoading(false);
      });
  }, []);

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
        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Nomor WhatsApp</label>
          <input value={form.wa_phone} onChange={(e) => setForm({ ...form, wa_phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="6282139742007" />
          <p className="text-xs text-muted mt-1">Gunakan format internasional tanpa +</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Email Perusahaan</label>
          <input value={form.company_email} onChange={(e) => setForm({ ...form, company_email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="ajpnirwasita@gmail.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Alamat</label>
            <input value={form.company_address} onChange={(e) => setForm({ ...form, company_address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Bandarejo Tama 47" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Kota</label>
            <input value={form.company_city} onChange={(e) => setForm({ ...form, company_city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Surabaya" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Provinsi</label>
          <input value={form.company_province} onChange={(e) => setForm({ ...form, company_province: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent" placeholder="Jawa Timur" />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted block mb-1">Deskripsi Perusahaan</label>
          <textarea rows={4} value={form.company_desc} onChange={(e) => setForm({ ...form, company_desc: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent resize-none" />
        </div>

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
