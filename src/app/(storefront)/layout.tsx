import { Navbar } from "@/components/storefront/navbar";
import { BottomNav } from "@/components/storefront/bottom-nav";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { WhatsAppStickyButton } from "@/components/storefront/whatsapp-sticky";

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
