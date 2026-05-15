import { NextResponse } from "next/server";
import { pb, buildStoreFilter } from "@/lib/pocketbase";
import { getAdminClient } from "@/lib/pocketbase";

async function getStoreIdSafe(): Promise<string> {
  try {
    const adminPb = await getAdminClient();
    const slug = process.env.POCKETBASE_STORE_SLUG || 'nanathawidya';
    const store = await adminPb.collection('stores').getFirstListItem(`slug="${slug}"`);
    return store.id;
  } catch {
    return '';
  }
}

export async function GET() {
  try {
    const storeId = await getStoreIdSafe();
    if (!storeId) return NextResponse.json([]);

    const products = await pb.collection('products').getFullList({
      filter: buildStoreFilter(storeId, 'isActive = true'),
      sort: '-created',
    });

    // Fetch categories separately (avoid expand issues)
    const allCategories = await pb.collection('categories').getFullList({
      filter: buildStoreFilter(storeId),
    });
    const catMap = new Map(allCategories.map((c: any) => [c.id, c]));

    const mapped = products.map((p: any) => {
      const category = catMap.get(p.categoryId);
      return {
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        price: p.price,
        image: p.image || "",
        imageUrl: p.imageUrl || "",
        images: (p.images as string[]) || [],
        galleryUrls: (p.galleryUrls as string[]) || [],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image || "",
          description: category.description || "",
        } : null,
        createdAt: p.created,
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('PocketBase products API error:', error);
    return NextResponse.json([]);
  }
}
