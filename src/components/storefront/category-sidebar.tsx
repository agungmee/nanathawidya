"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Category } from "@/types";
import { Package, ShoppingBag } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  "karung-plastik": <Package size={18} />,
  "plastik-packing": <ShoppingBag size={18} />,
};

export function CategorySidebar({ categories }: { categories: Category[] }) {
  const params = useParams();
  const currentSlug = params?.slug as string;

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="card p-4 sticky top-20">
        <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-wider">Kategori</h3>
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              !currentSlug ? "bg-accent text-white font-semibold" : "text-muted hover:bg-gray-50 hover:text-primary"
            }`}
          >
            <Package size={18} />
            Semua Produk
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                currentSlug === cat.slug ? "bg-accent/10 text-accent font-semibold" : "text-muted hover:bg-gray-50 hover:text-primary"
              }`}
            >
              {icons[cat.slug] || <Package size={18} />}
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
