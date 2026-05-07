"use client";

import { useState } from "react";
import { X, ShoppingCart, Phone } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { getWAUrl } from "@/lib/store-data";

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function VariationModal({ product, isOpen, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    openCart();
    onClose();
  };

  const handleWAOrder = () => {
    const msg = `Halo PT. Nirwasita Athawidya Nusantara, saya mau order:\n\n${product.name}\nJumlah: ${quantity}\nHarga: ${formatPrice(product.price * quantity)}\n\nMohon info selengkapnya. Terima kasih.`;
    window.open(getWAUrl(msg), "_blank");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:rounded-2xl bg-white z-50 rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white flex items-center justify-between">
          <h3 className="font-bold text-primary">Pilih Jumlah</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            <img src={getImageUrl(product.image)} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
            <div>
              <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
              <p className="text-accent font-bold text-lg mt-1">{formatPrice(product.price)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted">Jumlah:</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-lg hover:bg-gray-50 active:bg-gray-100 text-lg font-bold">-</button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border rounded-lg hover:bg-gray-50 active:bg-gray-100 text-lg font-bold">+</button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 border-2 border-accent text-accent font-semibold py-3 rounded-xl hover:bg-accent hover:text-white transition-all active:scale-[0.98]">
              <ShoppingCart size={18} />
              + Keranjang
            </button>
            <button onClick={handleWAOrder} className="flex-1 flex items-center justify-center gap-2 bg-success text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98]">
              <Phone size={18} />
              WA Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
