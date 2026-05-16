import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveStoreId, buildStoreFilter } from "@/lib/pocketbase";
import { ProductDetailClient } from "./product-detail-client";
import { StoreFooter } from "@/components/storefront/store-footer";

interface Props {
  params: { slug: string };
}

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function fetchOne<T>(collection: string, filter: string): Promise<T | null> {
  const params = new URLSearchParams({ filter, skipTotal: '1' });
  const res = await fetch(`${PB_URL()}/api/collections/${collection}/records?${params}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0] || null;
}

async function fetchAll<T>(collection: string, filter: string, sort?: string): Promise<T[]> {
  const params = new URLSearchParams({ filter, skipTotal: '1' });
  if (sort) params.set('sort', sort);
  const res = await fetch(`${PB_URL()}/api/collections/${collection}/records?${params}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function generateStaticParams() {
  try {
    const storeId = await resolveStoreId();
    const products = await fetchAll<any>('products', buildStoreFilter(storeId, 'isActive = true'));
    return products.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  try {
    const storeId = await resolveStoreId();
    const product = await fetchOne<any>('products', buildStoreFilter(storeId, `slug="${params.slug}"`));
    if (!product) return { title: "Produk Tidak Ditemukan" };
    const desc = product.description?.slice(0, 160) || `Detail produk ${product.name}`;
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images?.length) product.images.slice(0, 5).forEach((img: string) => images.push(img));
    return {
      title: `${product.name} | PT. Nirwasita Athawidya Nusantara`,
      description: desc,
      openGraph: {
        title: product.name,
        description: desc,
        type: "website",
        url: `https://nanathawidya.vercel.app/product/${params.slug}`,
        images: images.map((url: string) => ({ url })),
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: desc,
        images: images.slice(0, 1),
      },
    };
  } catch {
    return { title: "Produk" };
  }
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
  try {
    const storeId = await resolveStoreId();
    const product = await fetchOne<any>('products', buildStoreFilter(storeId, `slug="${params.slug}"`));

    if (!product) notFound();

    const [categories, settings, storeData] = await Promise.all([
      fetchAll<any>('categories', buildStoreFilter(storeId), 'name'),
      fetchAll<any>('settings', buildStoreFilter(storeId)),
      fetchAll<any>('stores', `id = "${storeId}"`),
    ]);

    const store = storeData[0] || {};
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = String(s.value);
    }
    settingsMap.company_name = store.name || "";
    settingsMap.logo = store.logo || "";
    settingsMap.description = store.description || "";

    const category = categories.find((c: any) => c.id === product.categoryId);
    const galleryUrls = (product.galleryUrls as string[]) || [];
    const safeImages = galleryUrls.length > 0 ? galleryUrls : (product.image ? [product.image] : ["/placeholder.svg"]);

    return (
      <div>
        <div className="p-4 sm:p-6">
          <ProductDetailClient
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.description || "Deskripsi produk belum tersedia.",
              price: product.price,
              originalPrice: product.originalPrice || undefined,
              image: product.image || "",
              images: safeImages,
              videoUrl: product.videoUrl || undefined,
              videoFile: product.videoFile || undefined,
              categoryName: category?.name || "Kategori",
              storeId,
            }}
          />
        </div>

        {/* REVIEW SECTION */}
        <section className="px-4 sm:px-6 mt-10">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Ulasan Pelanggan</h2>
            <div className="w-16 h-1 bg-accent rounded-full mx-auto mt-2" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Budi Santoso", rating: 5, text: "Kualitas bagus, sesuai pesanan. Pengiriman cepat. Recomended!", city: "Surabaya" },
              { name: "Siti Rahmawati", rating: 5, text: "Sudah order berkali-kali, produk selalu konsisten. Mantap!", city: "Jakarta" },
              { name: "Ahmad Fauzi", rating: 4, text: "Harga bersaing, produk sesuai spek. Pengiriman tepat waktu.", city: "Bandung" },
              { name: "Dewi Lestari", rating: 5, text: "Karungnya kuat, jahitan rapi. Sangat puas dengan hasilnya.", city: "Semarang" },
              { name: "Rudi Hermawan", rating: 4, text: "Pelayanan ramah, fast respon. Barang sesuai pesanan.", city: "Medan" },
              { name: "Ani Wulandari", rating: 5, text: "Sudah jadi langganan. Kualitas terbaik untuk harga segini.", city: "Makassar" },
            ].map((review) => (
              <div key={review.name} className="card p-5 hover:shadow-md transition-all">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">&ldquo;{review.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-bold text-primary">{review.name}</p>
                  <p className="text-xs text-muted">{review.city}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <StoreFooter categories={categories} settings={settingsMap} />
      </div>
    );
  } catch (error) {
    console.error('PocketBase product fetch error:', error);
    notFound();
  }
}
