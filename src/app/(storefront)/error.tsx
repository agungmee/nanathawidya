"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <AlertTriangle size={64} className="text-accent mb-4" />
      <h1 className="text-2xl font-bold text-primary mb-2">Oops! Ada Kesalahan</h1>
      <p className="text-muted mb-6 max-w-md">
        Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent-hover transition-all"
      >
        <RefreshCw size={18} /> Coba Lagi
      </button>
    </div>
  );
}
