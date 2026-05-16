import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami",
  description: "Hubungi PT. Nirwasita Athawidya Nusantara untuk pemesanan karung plastik, konsultasi produk, dan informasi harga. Melayani partai besar & kecil.",
  openGraph: { title: "Kontak Kami | PT. Nirwasita Athawidya Nusantara", description: "Hubungi kami untuk pemesanan karung plastik dan konsultasi produk." },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
