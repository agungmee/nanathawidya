"use client";

import { useEffect, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  invoiceNumber: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  totalAmount: number;
  status: string;
  whatsappSent: boolean;
  createdAt: string;
  items: OrderItem[];
  logs: { id: string; toStatus: string; note: string | null; createdAt: string }[];
}

const STATUS_OPTIONS = ["pending", "confirmed", "production", "shipped", "completed", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Dikonfirmasi", production: "Diproduksi",
  shipped: "Dikirim", completed: "Selesai", cancelled: "Dibatalkan",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-600", confirmed: "bg-blue-100 text-blue-600",
  production: "bg-purple-100 text-purple-600", shipped: "bg-indigo-100 text-indigo-600",
  completed: "bg-green-100 text-green-600", cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchOrders();
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const exportCSV = () => {
    const headers = ["Invoice", "Customer", "Phone", "Items", "Total", "Status", "Date"];
    const rows = filtered.map((o) => [
      o.invoiceNumber || "", o.customerName || "", o.customerPhone || "",
      o.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
      o.totalAmount, o.status, new Date(o.createdAt).toLocaleDateString("id-ID"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = orders
    .filter((o) => !search || o.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.customerPhone?.includes(search))
    .filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">Pesanan ({orders.length})</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-gray-200 text-muted px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="Cari invoice, nama, atau no. WA..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent">
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-muted">Belum ada pesanan</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted">Invoice</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted">Customer</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted">Total</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted hidden md:table-cell">Tanggal</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-primary">{o.invoiceNumber || "-"}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customerName || "Anonymous"}</p>
                      {o.customerPhone && <p className="text-xs text-muted">{o.customerPhone}</p>}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{formatPrice(o.totalAmount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted hidden md:table-cell text-xs">
                      {new Date(o.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(o)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye size={14} className="text-muted" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
              <X size={18} />
            </button>

            <h3 className="font-bold text-lg text-primary mb-1">Pesanan {selected.invoiceNumber}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
              {STATUS_LABELS[selected.status] || selected.status}
            </span>

            {/* Customer Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl grid sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted">Nama:</span> <span className="font-medium">{selected.customerName || "-"}</span></div>
              <div><span className="text-muted">WA:</span> <span className="font-medium">{selected.customerPhone || "-"}</span></div>
              <div><span className="text-muted">Email:</span> <span className="font-medium">{selected.customerEmail || "-"}</span></div>
              <div><span className="text-muted">Tanggal:</span> <span className="font-medium">{new Date(selected.createdAt).toLocaleString("id-ID")}</span></div>
            </div>

            {/* Items */}
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-sm text-primary">Item Pesanan</h4>
              {selected.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                  <span className="font-medium">{item.productName} <span className="text-muted">x{item.quantity}</span></span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 font-bold text-base">
                <span>Total</span>
                <span className="text-accent">{formatPrice(selected.totalAmount)}</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="mt-4">
              <h4 className="font-semibold text-sm text-primary mb-2">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    disabled={s === selected.status}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      s === selected.status
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-muted hover:bg-gray-200"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs */}
            {selected.logs && selected.logs.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm text-primary mb-2">Riwayat</h4>
                <div className="space-y-1">
                  {selected.logs.map((log) => (
                    <div key={log.id} className="flex items-center gap-2 text-xs text-muted">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span className="font-medium">{STATUS_LABELS[log.toStatus] || log.toStatus}</span>
                      {log.note && <span>- {log.note}</span>}
                      <span className="ml-auto">{new Date(log.createdAt).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {selected.customerPhone && (
              <a
                href={`https://wa.me/${selected.customerPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-success text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-all"
              >
                <WhatsAppIcon size={18} /> Hubungi via WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
