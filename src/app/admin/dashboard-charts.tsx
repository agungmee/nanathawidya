"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface MonthlyOrder {
  month: string;
  count: number;
  revenue: number;
}

export function DashboardCharts() {
  const [data, setData] = useState<MonthlyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((res) => {
        if (res?.monthlyOrders) setData(res.monthlyOrders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-muted text-sm">Memuat...</div>;
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-bold text-sm text-primary mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-accent" />
        Orders per Bulan
      </h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted font-semibold">{d.count}</span>
            <div
              className="w-full bg-accent/20 rounded-t-lg transition-all hover:bg-accent/40"
              style={{ height: `${(d.count / maxCount) * 100}%` }}
            />
            <span className="text-[10px] text-muted">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
