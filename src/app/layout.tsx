import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "PT. Nirwasita Athawidya Nusantara",
    template: "%s | PT. Nirwasita Athawidya Nusantara",
  },
  description: "Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik, melayani partai besar & kecil.",
  icons: {
    icon: "https://everz-digital.site/wp-content/uploads/2026/05/70d9c3b2-65bf-4771-8d82-611a4b77aa13-removebg-preview.png",
    apple: "https://everz-digital.site/wp-content/uploads/2026/05/70d9c3b2-65bf-4771-8d82-611a4b77aa13-removebg-preview.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PT. Nirwasita Athawidya Nusantara",
    title: "PT. Nirwasita Athawidya Nusantara",
    description: "Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik, melayani partai besar & kecil.",
    images: [{ url: "https://everz-digital.site/wp-content/uploads/2026/05/70d9c3b2-65bf-4771-8d82-611a4b77aa13-removebg-preview.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT. Nirwasita Athawidya Nusantara",
    description: "Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik, melayani partai besar & kecil.",
    images: ["https://everz-digital.site/wp-content/uploads/2026/05/70d9c3b2-65bf-4771-8d82-611a4b77aa13-removebg-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nanathawidya.vercel.app",
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased bg-bg text-foreground min-h-screen pb-16 md:pb-0 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
