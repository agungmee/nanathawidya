"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    openCart();
  };

  return (
    <Link href={`/product/${product.slug}`} className="card overflow-hidden group hover:shadow-md transition-all duration-300 active:scale-[0.98]">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
            POPULER
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
            -{discount}%
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-primary text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-light active:scale-90"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-primary line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-accent font-bold text-base">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-xs text-muted line-through mr-1">
                  {formatPrice(product.originalPrice)}
                </span>
                {formatPrice(product.price)}
              </>
            ) : (
              formatPrice(product.price)
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
