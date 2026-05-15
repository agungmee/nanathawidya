"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, Send, Mail, Printer, Globe } from "lucide-react";
import { WA_PHONE, getWAUrl } from "@/lib/store-data";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Halo PT. Nirwasita Athawidya Nusantara, saya ${form.name} (${form.email || form.phone}).\n\n${form.message}`;
    window.open(getWAUrl(msg), "_blank");

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
    }).catch(() => {});

    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Hubungi Kami</h1>
        <p className="text-muted mt-2">Konsultasikan kebutuhan kemasan plastik Anda dengan tim profesional kami</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone size={22} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary">WhatsApp / Telepon</h3>
              <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm">
                {WA_PHONE.replace(/(\d{3})(\d{4})(\d{4})/, "+62 $1-$2-$3")}
              </a>
              <p className="text-xs text-muted mt-1">Respon cepat via WhatsApp</p>
            </div>
          </div>

          <div className="card p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={22} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Alamat</h3>
              <p className="text-sm text-muted">Bandarejo Tama 47</p>
              <p className="text-sm text-muted">Kelurahan Sememi, Kecamatan Benowo, Surabaya</p>
            </div>
          </div>

          <div className="card p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail size={22} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Email</h3>
              <a href="mailto:ajpnirwasita@gmail.com" className="text-accent hover:underline text-sm">ajpnirwasita@gmail.com</a>
              <p className="text-xs text-muted mt-1">Respon via email dalam 1x24 jam</p>
            </div>
          </div>

          <div className="card p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe size={22} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Website</h3>
              <a href="https://www.ptnanathawidya.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm">www.ptnanathawidya.com</a>
              <p className="text-xs text-muted mt-1">Kunjungi website resmi kami</p>
            </div>
          </div>

          <div className="card p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={22} className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Jam Operasional</h3>
              <p className="text-sm text-muted">Senin - Sabtu: 08.00 - 18.00</p>
              <p className="text-sm text-muted">Minggu: 09.00 - 15.00</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${WA_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card p-5 flex items-center justify-center gap-3 bg-success text-white hover:bg-green-600 transition-all rounded-2xl"
          >
            <Printer size={22} />
            <span className="font-semibold">Konsultasi Gratis via WhatsApp</span>
          </a>

          <a
            href="mailto:ajpnirwasita@gmail.com"
            className="card p-5 flex items-center justify-center gap-3 bg-primary text-white hover:bg-primary-light transition-all rounded-2xl"
          >
            <Mail size={22} />
            <span className="font-semibold">Kirim Email</span>
          </a>
        </div>

        <div className="card p-5 sm:p-6">
          <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
            <Send size={18} className="text-accent" />
            Kirim Pesan
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Nama *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors" placeholder="Nama Anda" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors" placeholder="email@anda.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Telepon</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors" placeholder="08xxxx" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Pesan *</label>
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none" placeholder="Tulis pesan Anda di sini..." />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent-hover transition-all active:scale-[0.98]">
              {sent ? "Pesan Terkirim!" : <><Send size={18} /> Kirim via WhatsApp</>}
            </button>
            <p className="text-[10px] text-center text-muted">Pesan akan dikirim melalui WhatsApp untuk respon lebih cepat</p>
          </form>
        </div>
      </div>
    </div>
  );
}
