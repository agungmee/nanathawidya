import { pb, resolveStoreId, buildStoreFilter } from "@/lib/pocketbase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductGrid } from "@/components/storefront/product-grid";
import { CategorySidebar } from "@/components/storefront/category-sidebar";
import { CategoryChip } from "@/components/storefront/category-chip";
import { notFound } from "next/navigation";
import type { Product, Category } from "@/types";

export async function generateStaticParams() {
  try {
    const storeId = await resolveStoreId();
    const categories = await pb.collection('categories').getFullList({
      filter: buildStoreFilter(storeId),
      fields: 'slug',
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  try {
    const storeId = await resolveStoreId();
    const [category, allCategories] = await Promise.all([
      pb.collection('categories').getFirstListItem(
        buildStoreFilter(storeId, `slug="${params.slug}"`)
      ),
      pb.collection('categories').getFullList({
        filter: buildStoreFilter(storeId),
        sort: 'name',
      }),
    ]);

    if (!category) notFound();

    const products = await pb.collection('products').getFullList({
      filter: buildStoreFilter(storeId, `categoryId = "${category.id}" && isActive = true`),
      sort: '-created',
    });

    const mappedCat: Category = {
      id: category.id, 
      name: category.name, 
      slug: category.slug,
      image: category.image || undefined, 
      description: category.description || undefined,
    };

    const mappedProducts: Product[] = products.map((p) => ({
      id: p.id,
      categoryId: p.categoryId,
      name: p.name,
      slug: p.slug,
      description: p.description || undefined,
      price: p.price,
      originalPrice: p.originalPrice || undefined,
      image: p.image || undefined,
      imageUrl: p.imageUrl || undefined,
      images: (p.images as string[]) || undefined,
      galleryUrls: (p.galleryUrls as string[]) || undefined,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      category: mappedCat,
      storeId: p.storeId,
      createdAt: p.created,
    }));

    return (
    <div className="flex gap-6 p-4">
      <CategorySidebar
        categories={allCategories.map((c) => ({
          id: c.id, name: c.name, slug: c.slug,
          image: c.image || undefined, description: c.description || undefined,
        }))}
      />

      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-3">
            <ArrowLeft size={16} /> Beranda
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">{category.name}</h1>
          {category.description && (
            <p className="text-muted text-sm mt-1">{category.description}</p>
          )}
        </div>

        <div className="lg:hidden mb-4">
          <CategoryChip
            categories={allCategories.map((c) => ({
              id: c.id, name: c.name, slug: c.slug,
              image: c.image || undefined, description: c.description || undefined,
            }))}
          />
        </div>

        {mappedProducts.length > 0 ? (
          <ProductGrid products={mappedProducts} />
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="font-semibold">Belum ada produk di kategori ini</p>
            <p className="text-sm mt-2">Silakan hubungi kami untuk info lebih lanjut</p>
          </div>
        )}
      </div>
    </div>
    );
  } catch (error) {
    console.error('PocketBase category fetch error:', error);
    notFound();
  }
}
