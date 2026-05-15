"use client";

import { useEffect, useState } from "react";
import { TrendingUp, MessageSquare, DollarSign, ShoppingBag } from "lucide-react";

interface TimelineItem {
  key: string;
  count: number;
  revenue: number;
}

interface StatsData {
  totalOrders: number;
  pendingOrders: number;
  totalMessages: number;
  orderTimeline: TimelineItem[];
  messageTimeline: TimelineItem[];
  revenueByPeriod: { key: string; revenue: number }[];
}

export function DashboardCharts() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/stats?period=${period}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-muted text-sm">Memuat...</div>;
  if (!data) return null;

  const maxOrderCount = Math.max(...data.orderTimeline.map((d) => d.count), 1);
  const maxMsgCount = Math.max(...data.messageTimeline.map((d) => d.count), 1);
  const maxRevenue = Math.max(...data.revenueByPeriod.map((d) => d.revenue), 1);

  const periodLabels = { daily: "Harian", weekly: "Mingguan", monthly: "Bulanan" };

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        {(["daily", "weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === p ? "bg-accent text-white" : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Orders Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-sm text-primary mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-accent" />
            Pesanan ({data.totalOrders})
          </h3>
          <div className="flex items-end gap-2 h-32">
            {data.orderTimeline.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted font-semibold">{d.count}</span>
                <div
                  className="w-full bg-accent/20 rounded-t-lg transition-all hover:bg-accent/40"
                  style={{ height: `${(d.count / maxOrderCount) * 100}%` }}
                />
                <span className="text-[10px] text-muted truncate w-full text-center">{d.key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-sm text-primary mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-amber-500" />
            Pesan Masuk ({data.totalMessages})
          </h3>
          <div className="flex items-end gap-2 h-32">
            {data.messageTimeline.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted font-semibold">{d.count}</span>
                <div
                  className="w-full bg-amber-200 rounded-t-lg transition-all hover:bg-amber-300"
                  style={{ height: `${(d.count / maxMsgCount) * 100}%` }}
                />
                <span className="text-[10px] text-muted truncate w-full text-center">{d.key}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-sm text-primary mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-green-500" />
          Pendapatan
        </h3>
        <div className="flex items-end gap-2 h-32">
          {data.revenueByPeriod.map((d) => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted font-semibold">
                {d.revenue > 0 ? `Rp${(d.revenue / 1000).toFixed(0)}k` : ""}
              </span>
              <div
                className="w-full bg-green-200 rounded-t-lg transition-all hover:bg-green-300"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              />
              <span className="text-[10px] text-muted truncate w-full text-center">{d.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
