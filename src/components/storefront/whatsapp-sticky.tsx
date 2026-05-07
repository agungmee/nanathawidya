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
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="w-8 h-8 relative z-10 fill-current"
      >
        <path d="M19.11 17.2c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.5.7.3 1.26.5 1.7.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.46 1.66 6.33L3 29l6.84-1.6A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3m0 23.75c-2 0-3.86-.58-5.44-1.57l-.39-.24-4.06.95.98-3.95-.26-.4A10.67 10.67 0 0 1 5.25 16C5.25 10.07 10.07 5.25 16 5.25S26.75 10.07 26.75 16 21.93 26.75 16 26.75" />
      </svg>
    </a>
  );
}
