import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <FileQuestion size={64} className="text-accent mb-4" />
      <h1 className="text-2xl font-bold text-primary mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-muted mb-6 max-w-md">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent-hover transition-all">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
