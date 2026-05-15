import dynamic from "next/dynamic";
import { WhatsAppStickyButton } from "@/components/storefront/whatsapp-sticky";

const Navbar = dynamic(() => import("@/components/storefront/navbar").then((m) => m.Navbar), { ssr: false });
const BottomNav = dynamic(() => import("@/components/storefront/bottom-nav").then((m) => m.BottomNav), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/storefront/cart-drawer").then((m) => m.CartDrawer), { ssr: false });

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="max-w-7xl mx-auto px-0 sm:px-4 py-4 sm:py-6">
        <div className="bg-white shadow-sm min-h-screen sm:rounded-2xl overflow-hidden border border-gray-100">
          {children}
        </div>
      </main>
      <WhatsAppStickyButton />
      <BottomNav />
    </div>
  );
}
