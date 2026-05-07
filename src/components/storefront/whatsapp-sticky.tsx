"use client";

import { usePathname } from "next/navigation";
import { WA_PHONE } from "@/lib/store-data";

export function WhatsAppStickyButton() {
  const pathname = usePathname();

  if (pathname?.startsWith("/product/")) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${WA_PHONE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed right-4 bottom-24 md:bottom-8 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      <i className="fa-brands fa-whatsapp text-3xl relative z-10" />
    </a>
  );
}
