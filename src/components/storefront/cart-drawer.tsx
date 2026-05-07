"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, Phone } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { getWAUrl, WA_PHONE } from "@/lib/store-data";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCartStore();

  const handleWhatsAppOrder = () => {
    const message = items.map((i) => `${i.productName} x${i.quantity} = ${formatPrice(i.price * i.quantity)}`).join("\n");
    const total = formatPrice(totalPrice());
    const fullMessage = `Halo PT. Nirwasita Athawidya Nusantara, saya mau order:\n\n${message}\n\nTotal: ${total}\n\nMohon info pembayaran dan estimasi pengerjaan. Terima kasih.`;
    window.open(getWAUrl(fullMessage), "_blank");
    clearCart();
    closeCart();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-50" onClick={closeCart} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-primary" />
              <h2 className="font-bold text-lg text-primary">Keranjang ({totalItems()})</h2>
            </div>
            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted gap-4">
                <ShoppingBag size={64} className="text-gray-200" />
                <p className="font-medium">Keranjang masih kosong</p>
                <p className="text-sm text-center max-w-xs">Tambahkan produk percetakan yang Anda butuhkan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                    <img src={item.image || "/placeholder.svg"} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold line-clamp-2">{item.productName}</h3>
                      <p className="text-accent font-bold mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 bg-white border rounded-md hover:bg-gray-100">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 bg-white border rounded-md hover:bg-gray-100">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => removeItem(item.productId)} className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded-md">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted">Total</span>
                <span className="text-xl font-bold text-accent">{formatPrice(totalPrice())}</span>
              </div>
              <button onClick={handleWhatsAppOrder} className="w-full flex items-center justify-center gap-2 bg-success text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98]">
                <Phone size={18} />
                Order via WhatsApp
              </button>
              <p className="text-xs text-center text-muted">Setelah klik, Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
