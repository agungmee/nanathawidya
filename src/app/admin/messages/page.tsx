"use client";

import { useEffect, useState } from "react";
import { Mail, Check } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/admin/messages");
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    });
    setMessages(messages.map((m) => m.id === id ? { ...m, isRead: true } : m));
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-6">Pesan Masuk</h1>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-10 text-muted">Belum ada pesan</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); if (!m.isRead) markAsRead(m.id); }}
                className={`w-full text-left bg-white rounded-2xl border p-4 transition-all hover:shadow-sm ${selected?.id === m.id ? "border-accent" : "border-gray-100"} ${!m.isRead ? "border-l-4 border-l-accent" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary truncate">{m.name}</p>
                    <p className="text-xs text-muted truncate">{m.email}{m.phone ? ` - ${m.phone}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!m.isRead && <span className="w-2 h-2 bg-accent rounded-full" />}
                    <span className="text-xs text-muted">{formatDate(m.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted mt-2 line-clamp-2">{m.message}</p>
              </button>
            ))}
          </div>

          <div>
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-primary">{selected.name}</h3>
                    <p className="text-sm text-muted">{selected.email}</p>
                    {selected.phone && <p className="text-sm text-muted">{selected.phone}</p>}
                  </div>
                  {selected.isRead && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check size={12} /> Terbaca
                    </span>
                  )}
                </div>
                {selected.subject && (
                  <p className="text-sm font-semibold text-primary mb-2">Subjek: {selected.subject}</p>
                )}
                <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <p className="text-xs text-muted mt-4">{formatDate(selected.createdAt)}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-muted">
                <Mail size={40} className="mx-auto mb-3 text-gray-200" />
                <p>Pilih pesan untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
