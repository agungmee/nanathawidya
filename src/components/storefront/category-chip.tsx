"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Category } from "@/types";
import { Package, ShoppingBag } from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  "karung-plastik": <Package size={20} />,
  "plastik-packing": <ShoppingBag size={20} />,
};

export function CategoryChip({ categories }: { categories: Category[] }) {
  const params = useParams();
  const currentSlug = params?.slug as string;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1">
      <Link
        href="/"
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
          !currentSlug ? "bg-accent text-white shadow-md" : "bg-white text-muted border border-gray-200 hover:border-accent"
        }`}
      >
        Semua
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            currentSlug === cat.slug ? "bg-accent text-white shadow-md" : "bg-white text-muted border border-gray-200 hover:border-accent"
          }`}
        >
          {icons[cat.slug] || <Package size={20} />}
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
