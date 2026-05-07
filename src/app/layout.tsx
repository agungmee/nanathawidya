import type { Metadata } from "next";
import "./globals.css";
import "swiper/css";
import "swiper/css/pagination";

export const metadata: Metadata = {
  title: "PT. Nirwasita Athawidya Nusantara",
  description: "Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik, melayani partai besar & kecil.",
  icons: { icon: "https://everz-digital.site/wp-content/uploads/2026/05/70d9c3b2-65bf-4771-8d82-611a4b77aa13-removebg-preview.png" },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWix+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkR4j8GDSvZQxPp0tF7W4S4pR8K7fN7RLXQg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased bg-bg text-foreground min-h-screen pb-16 md:pb-0">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
