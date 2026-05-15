import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveStoreId, buildStoreFilter } from "@/lib/pocketbase";
import { ProductDetailClient } from "./product-detail-client";
import { Phone, Printer, Mail, Truck, MessageSquare } from "lucide-react";

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
    return {
      title: `${product.name} | PT. Nirwasita Athawidya Nusantara`,
      description: product.description?.slice(0, 160) || `Detail produk ${product.name}`,
      openGraph: { title: product.name, description: product.description?.slice(0, 160), images: product.image ? [product.image] : [] },
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

    const [categories] = await Promise.all([
      fetchAll<any>('categories', buildStoreFilter(storeId), 'name'),
    ]);

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

        {/* FOOTER */}
        <footer className="bg-primary text-white mt-10">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="font-bold text-lg mb-4">
                  PT.<span className="text-accent">Nirwasita Athawidya Nusantara</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik, melayani partai besar & kecil.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Produk</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  {categories.map((cat: any) => (
                    <li key={cat.id}>
                      <Link href={`/category/${cat.slug}`} className="hover:text-accent transition-colors">{cat.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Layanan</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><Link href="/contact" className="hover:text-accent transition-colors">Kontak Kami</Link></li>
                  <li><a href="https://wa.me/6282139742007" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Konsultasi Gratis</a></li>
                  <li><span className="cursor-default">Cetak Custom Karung</span></li>
                  <li><span className="cursor-default">Cetak Plastik Packing</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Kontak</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <Phone size={14} className="text-accent flex-shrink-0" />
                    <a href="https://wa.me/6282139742007" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">+62 821-3974-2007</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <Printer size={14} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>Bandarejo Tama 47, Sememi, Benowo, Surabaya</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={14} className="text-accent flex-shrink-0" />
                    <a href="mailto:ajpnirwasita@gmail.com" className="hover:text-accent transition-colors">ajpnirwasita@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck size={14} className="text-accent flex-shrink-0" />
                    <span>Melayani pengiriman seluruh Indonesia</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <a
                    href="https://wa.me/6282139742007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-all w-full justify-center"
                  >
                    <Phone size={16} />
                    Hubungi WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/50">
              &copy; {new Date().getFullYear()} PT. Nirwasita Athawidya Nusantara. Hak cipta dilindungi.
            </div>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('PocketBase product fetch error:', error);
    notFound();
  }
}
