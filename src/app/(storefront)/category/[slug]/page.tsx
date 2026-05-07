"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/storefront/product-grid";
import { CategorySidebar } from "@/components/storefront/category-sidebar";
import { CategoryChip } from "@/components/storefront/category-chip";
import { DEMO_CATEGORIES, DEMO_PRODUCTS_BY_CATEGORY, DEMO_PRODUCTS } from "@/lib/store-data";
import type { Product } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = useMemo(() => DEMO_CATEGORIES.find((c) => c.slug === slug), [slug]);
  const products: Product[] = useMemo(
    () => (category ? DEMO_PRODUCTS_BY_CATEGORY[category.id] || [] : []),
    [category]
  );

  return (
    <div className="flex gap-6 p-4">
      <CategorySidebar categories={DEMO_CATEGORIES} />

      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-3">
            <ArrowLeft size={16} /> Beranda
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            {category?.name || "Kategori Tidak Ditemukan"}
          </h1>
          {category?.description && (
            <p className="text-muted text-sm mt-1">{category.description}</p>
          )}
        </div>

        <div className="lg:hidden mb-4">
          <CategoryChip categories={DEMO_CATEGORIES} />
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="font-semibold">Belum ada produk di kategori ini</p>
            <p className="text-sm mt-2">Silakan hubungi kami untuk info lebih lanjut</p>
          </div>
        )}
      </div>
    </div>
  );
}
