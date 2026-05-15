import Link from "next/link";
import { resolveStoreId, buildStoreFilter } from "@/lib/pocketbase";
import { BannerSlider } from "@/components/storefront/banner-slider";
import { CategoryCarousel } from "@/components/storefront/category-carousel";
import { ProductGrid } from "@/components/storefront/product-grid";
import { AboutGallery } from "@/components/storefront/about-gallery";
import { StoreFooter } from "@/components/storefront/store-footer";
import { Phone, Printer, Factory, ShieldCheck, BadgeCheck, Users, MessageSquare, FileText, CreditCard, Package, Truck, Award, Sparkles, Mail, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

async function fetchAll<T>(collection: string, filter: string, sort?: string): Promise<T[]> {
  const baseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  const params = new URLSearchParams({ filter, skipTotal: '1' });
  if (sort) params.set('sort', sort);
  const res = await fetch(`${baseUrl}/api/collections/${collection}/records?${params}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

async function getData() {
  try {
    const storeId = await resolveStoreId();
    if (!storeId) return { banners: [], categories: [], featured: [], waPhone: "6282139742007" };

    const [banners, categories, featuredProducts, settings, storeData] = await Promise.all([
      fetchAll<any>('banners', buildStoreFilter(storeId, 'isActive = true'), 'sortOrder'),
      fetchAll<any>('categories', buildStoreFilter(storeId), 'name'),
      fetchAll<any>('products', buildStoreFilter(storeId, 'isActive = true && isFeatured = true'), 'name'),
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

    const waPhone = settingsMap.wa_phone || "6282139742007";

    const mappedBanners = banners.map((b: any) => ({
      id: b.id,
      title: b.title || undefined,
      subtitle: b.subtitle || undefined,
      type: b.type,
      image: b.image || undefined,
      url: b.url || undefined,
      sortOrder: b.sortOrder,
      isActive: b.isActive,
      storeId: b.storeId,
    }));

    const mappedFeatured = featuredProducts.map((p: any) => ({
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
      videoUrl: p.videoUrl || undefined,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      category: { id: '', name: 'Kategori', slug: '' },
      storeId: p.storeId,
      createdAt: p.created,
    }));

    return { banners: mappedBanners, categories, featured: mappedFeatured, waPhone, settings: settingsMap };
  } catch (error) {
    console.error('PocketBase fetch error:', error);
    return { banners: [], categories: [], featured: [], waPhone: "6282139742007", settings: {} };
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { banners, categories, featured, waPhone, settings } = await getData();

  return (
    <div>
      {/* HERO BANNER */}
      <section className="px-4 pt-4">
        <BannerSlider banners={banners} />
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                <Star size={22} className="text-accent" />
                Produk Unggulan
              </h2>
              <p className="text-sm text-muted mt-1">Produk terbaik pilihan untuk Anda</p>
            </div>
            <Link
              href="/search?sort=best_selling"
              className="text-sm text-accent font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <span>&rarr;</span>
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* CATEGORY SHOWCASE */}
      {categories.length > 0 && (
        <section className="mt-10">
          <div className="text-center mb-6 px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Kategori Produk</h2>
            <p className="text-sm text-muted mt-1">Jelajahi produk berdasarkan kategori</p>
            <div className="w-16 h-1 bg-accent rounded-full mx-auto mt-2" />
          </div>
          <CategoryCarousel categories={categories} />
        </section>
      )}

      {/* ABOUT SECTION */}
      <section className="px-4 mt-10">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Tentang PT. Nirwasita Athawidya Nusantara</h2>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mt-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div className="card p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <p className="text-sm sm:text-base text-muted leading-relaxed text-justify">
              <strong className="text-primary">PT. Nirwasita Athawidya Nusantara</strong> adalah produsen karung plastik dan plastik packing yang
              berlokasi di Indonesia. Kami berpengalaman dalam memproduksi berbagai jenis karung PP woven,
              karung laminasi, karung BOPP, serta plastik kemasan custom untuk kebutuhan industri, pertanian,
              perdagangan, dan UMKM.
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed text-justify">
              Berbekal mesin produksi modern dan tim yang kompeten, kami berkomitmen memberikan produk
              berkualitas tinggi dengan harga yang kompetitif. Setiap produk melalui proses quality control
              ketat untuk memastikan kepuasan pelanggan.
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed text-justify">
              Melayani pemesanan partai besar maupun kecil — dari kebutuhan lokal hingga ekspor.
              Kami siap membantu mewujudkan kemasan impian Anda.
            </p>
          </div>
          <div className="relative aspect-square hidden md:block">
            <AboutGallery />
          </div>
        </div>
      </section>

      {/* KENAPA MEMILIH KAMI */}
      <section className="px-4 mt-10">
        <h2 className="text-lg font-bold text-primary text-center mb-6">Kenapa Memilih Kami?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Factory, title: "Produsen Langsung", desc: "Harga pabrik, tanpa perantara. Lebih hemat dan terjamin kualitasnya." },
            { icon: BadgeCheck, title: "Kualitas Terjamin", desc: "QC ketat di setiap tahap produksi. Produk kuat, rapi, dan tahan lama." },
            { icon: Sparkles, title: "Custom Sesuai Mau", desc: "Ukuran, warna, bahan, dan cetak bisa disesuaikan dengan kebutuhan Anda." },
            { icon: Users, title: "Tim Profesional", desc: "Didukung tenaga ahli berpengalaman di bidang kemasan plastik." },
            { icon: Truck, title: "Pengiriman Tepat", desc: "Tepat waktu sesuai jadwal yang disepakati. Siap kirim ke seluruh Indonesia." },
            { icon: ShieldCheck, title: "Garansi Puas", desc: "Tidak sesuai? Kami siap perbaiki atau ganti. Kepuasan Anda prioritas kami." },
            { icon: Award, title: "Harga Bersaing", desc: "Kualitas premium dengan harga yang ramah di kantong. Minimal order fleksibel." },
            { icon: Phone, title: "Konsultasi Gratis", desc: "Bingung pilih kemasan? Tim kami siap membantu konsultasi tanpa biaya." },
          ].map((item) => (
            <div key={item.title} className="card p-4 sm:p-5 flex sm:flex-col items-start sm:text-center gap-3 sm:gap-0 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-3 group-hover:bg-accent group-hover:text-white transition-all">
                <item.icon size={24} className="text-accent group-hover:text-white transition-all" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary sm:mb-1">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARA ORDER */}
      <section className="px-4 mt-10 mb-8">
        <h2 className="text-lg font-bold text-primary text-center mb-6">Cara Order</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { icon: MessageSquare, step: "1", title: "Konsultasi", desc: "Hubungi kami via WhatsApp, jelaskan kebutuhan Anda" },
            { icon: FileText, step: "2", title: "Konfirmasi", desc: "Kami kirimkan penawaran harga & estimasi pengerjaan" },
            { icon: CreditCard, step: "3", title: "Pembayaran", desc: "Lakukan pembayaran sesuai kesepakatan" },
            { icon: Package, step: "4", title: "Produksi", desc: "Tim kami memproses pesanan Anda" },
            { icon: Truck, step: "5", title: "Pengiriman", desc: "Pesanan dikirim & siap digunakan" },
          ].map((item) => (
            <div key={item.step} className={`card p-4 sm:p-5 flex sm:flex-col items-start sm:text-center gap-3 sm:gap-0 hover:shadow-md transition-all group relative ${item.step === '5' ? 'col-span-2 sm:col-span-1 mx-auto max-w-xs sm:max-w-none' : ''}`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 sm:mx-auto sm:mb-3 group-hover:bg-accent group-hover:text-white transition-all">
                <item.icon size={20} className="text-accent group-hover:text-white transition-all" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:justify-center sm:mb-1">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow shrink-0">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                </div>
                <p className="text-xs text-muted leading-relaxed mt-1 sm:mt-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <a
            href={`https://wa.me/${waPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-success text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98] shadow-lg"
          >
            <WhatsAppIcon size={20} />
            Order via WhatsApp
          </a>
        </div>
      </section>

      <StoreFooter categories={categories} settings={settings} />
    </div>
  );
}
