"use client";

import { usePathname } from "next/navigation";
import { WA_PHONE } from "@/lib/store-data";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

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
      <WhatsAppIcon size={28} />
    </a>
  );
}
