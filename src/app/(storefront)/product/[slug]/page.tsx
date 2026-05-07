"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Phone,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  FileText,
  CreditCard,
  Package,
  Truck,
  Printer,
  Mail,
} from "lucide-react";
import { DEMO_CATEGORIES, DEMO_PRODUCTS, WA_PHONE, getWAUrl } from "@/lib/store-data";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { ABOUT_GALLERY_IMAGES } from "@/lib/gallery-images";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const product = useMemo(() => DEMO_PRODUCTS.find((p) => p.slug === slug), [slug]);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Produk Tidak Ditemukan</h1>
        <Link href="/" className="text-accent hover:underline mt-4 inline-block">Kembali ke Beranda</Link>
      </div>
    );
  }

  const safeImages = ABOUT_GALLERY_IMAGES.length
    ? [...ABOUT_GALLERY_IMAGES]
    : ["/placeholder.svg"];

  const variantOptions = useMemo(
    () => [
      { key: "Ukuran", values: ["Custom", "50x75 cm", "55x85 cm", "60x100 cm"] },
      { key: "Warna", values: ["Custom", "Putih", "Transparan", "Kombinasi"] },
      { key: "Finishing", values: ["Standard", "Laminasi Doff", "Laminasi Glossy", "BOPP"] },
    ],
    []
  );

  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({
    Ukuran: variantOptions[0].values[0],
    Warna: variantOptions[1].values[0],
    Finishing: variantOptions[2].values[0],
  });

  const productReviews = useMemo(
    () => [
      { name: "Andi Pratama", rating: 5, comment: "Kualitas karung bagus, jahitan rapi, respon cepat.", time: "2 minggu lalu" },
      { name: "Siti Rahma", rating: 5, comment: "Bisa custom sesuai kebutuhan kami, hasil cetak tajam.", time: "1 bulan lalu" },
      { name: "Budi Santoso", rating: 4, comment: "Pengiriman tepat waktu dan harga kompetitif.", time: "1 bulan lalu" },
    ],
    []
  );

  const averageRating = useMemo(
    () => productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length,
    [productReviews]
  );

  const productDescription = product.description || "Deskripsi produk belum tersedia. Hubungi kami untuk info lebih lanjut.";
  const descriptionPreviewLimit = 260;
  const isLongDescription = productDescription.length > descriptionPreviewLimit;
  const displayedDescription =
    isDescriptionExpanded || !isLongDescription
      ? productDescription
      : `${productDescription.slice(0, descriptionPreviewLimit)}...`;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
      openCart();
    }, 600);
  };

  const handleWAOrder = () => {
    const variantText = variantOptions
      .map((variant) => `- ${variant.key}: ${selectedVariant[variant.key]}`)
      .join("\n");
    const msg = `Halo PT. Nirwasita Athawidya Nusantara, saya mau order:\n\n${product.name}\nJumlah: ${quantity}\nHarga: ${formatPrice(product.price * quantity)}\n\nVarian yang dipilih:\n${variantText}\n\nMohon info lebih lanjut (ongkir, estimasi, dll). Terima kasih.`;
    window.open(getWAUrl(msg), "_blank");
  };

  return (
    <div>
      <div className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-primary text-sm mb-4">
          <ArrowLeft size={16} /> Kembali
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
              <img
                src={getImageUrl(safeImages[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {safeImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((p) => (p === 0 ? safeImages.length - 1 : p - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((p) => (p === safeImages.length - 1 ? 0 : p + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {safeImages.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    i === selectedImage ? "border-accent" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={getImageUrl(img)} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">{product.name}</h1>

            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-accent">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-primary">Pilih Varian</h3>
                {variantOptions.map((variant) => (
                  <div key={variant.key}>
                    <p className="text-sm font-semibold text-muted mb-2">{variant.key}</p>
                    <div className="flex flex-wrap gap-2">
                      {variant.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => setSelectedVariant((prev) => ({ ...prev, [variant.key]: value }))}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                            selectedVariant[variant.key] === value
                              ? "bg-accent text-white border-accent"
                              : "bg-white text-primary border-gray-200 hover:border-accent"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-semibold text-muted block mb-2">Jumlah Pemesanan</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-xl hover:bg-gray-50 text-lg font-bold">-</button>
                  <span className="w-14 text-center font-bold text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border rounded-xl hover:bg-gray-50 text-lg font-bold">+</button>
                </div>
                <p className="text-xs text-muted mt-2">Subtotal: <span className="font-bold text-accent">{formatPrice(product.price * quantity)}</span></p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent-hover transition-all active:scale-[0.98]">
                  {showCheck ? <Check size={20} /> : <ShoppingCart size={20} />}
                  {showCheck ? "Ditambahkan!" : "Tambahkan ke Keranjang"}
                </button>
                <button onClick={handleWAOrder} className="flex-1 flex items-center justify-center gap-2 bg-success text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98]">
                  <Phone size={20} />
                  Order via WhatsApp
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.share?.({ title: product.name, url: window.location.href });
                }}
                className="flex items-center gap-2 text-muted hover:text-primary text-sm"
              >
                <Share2 size={16} /> Bagikan Produk
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="font-bold text-primary mb-3">Deskripsi Produk</h3>
          <div className="text-sm text-muted leading-relaxed whitespace-pre-line text-justify">
            {displayedDescription}
          </div>
          {isLongDescription && (
            <button
              onClick={() => setIsDescriptionExpanded((prev) => !prev)}
              className="mt-3 text-sm font-semibold text-accent hover:text-accent-hover"
            >
              {isDescriptionExpanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
            </button>
          )}
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-primary">Review Produk</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">
              {averageRating.toFixed(1)} / 5
            </span>
          </div>
          <div className="space-y-3">
            {productReviews.map((review, idx) => (
              <div key={idx} className="rounded-xl border border-gray-100 p-3 bg-gray-50/60">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-primary">{review.name}</p>
                  <p className="text-xs text-muted">{review.time}</p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-10 border-t pt-8">
          <h2 className="text-lg font-bold text-primary text-center mb-6">Cara Order</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: MessageSquare, step: "1", title: "Konsultasi", desc: "Hubungi kami via WhatsApp, jelaskan kebutuhan Anda" },
              { icon: FileText, step: "2", title: "Konfirmasi", desc: "Kami kirimkan penawaran harga & estimasi pengerjaan" },
              { icon: CreditCard, step: "3", title: "Pembayaran", desc: "Lakukan pembayaran sesuai kesepakatan" },
              { icon: Package, step: "4", title: "Produksi", desc: "Tim kami memproses pesanan Anda" },
              { icon: Truck, step: "5", title: "Pengiriman", desc: "Pesanan dikirim & siap digunakan" },
            ].map((item) => (
              <div key={item.step} className="card p-4 sm:p-5 flex sm:flex-col items-start sm:text-center gap-3 sm:gap-0 hover:shadow-md transition-all group relative">
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
              href={`https://wa.me/${WA_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-success text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98] shadow-lg"
            >
              <MessageSquare size={20} />
              Order via WhatsApp
            </a>
          </div>
        </section>
      </div>

      <footer className="bg-primary text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <Printer size={24} className="text-accent" />
                PT.<span className="text-accent">Nirwasita Athawidya Nusantara</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik, melayani partai besar & kecil.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Produk</h3>
              <ul className="space-y-2 text-sm text-white/70">
                {DEMO_CATEGORIES.map((cat) => (
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
                <li><a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Konsultasi Gratis</a></li>
                <li><span className="cursor-default">Cetak Custom Karung</span></li>
                <li><span className="cursor-default">Cetak Plastik Packing</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Kontak</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-accent flex-shrink-0" />
                  <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    {WA_PHONE.replace(/(\d{3})(\d{4})(\d{4})/, "+62 $1-$2-$3")}
                  </a>
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
                  href={`https://wa.me/${WA_PHONE}`}
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
}
