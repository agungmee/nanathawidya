import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Produk",
  description: "Cari produk karung plastik, laminasi, BOPP, dan plastik packing custom. Temukan produk yang Anda butuhkan.",
  openGraph: { title: "Cari Produk | PT. Nirwasita Athawidya Nusantara", description: "Cari produk karung plastik dan plastik packing custom." },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
