"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, MessageSquare, Share2, Check, Play, FileText, CreditCard, Package, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useCartStore } from "@/lib/cart-store";
import type { Variant } from "@/types";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  videoUrl?: string;
  videoFile?: string;
  categoryName: string;
  storeId?: string;
}

export function ProductDetailClient({ product }: { product: ProductData }) {
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [showVideo, setShowVideo] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderSent, setOrderSent] = useState(false);

  const allMedia = [
    ...(product.videoUrl ? [{ type: 'video' as const, src: product.videoUrl }] : []),
    ...(product.videoFile ? [{ type: 'video' as const, src: product.videoFile }] : []),
    ...product.images.map((img) => ({ type: 'image' as const, src: img })),
  ];

  useEffect(() => {
    if (product.storeId) {
      fetch(`/api/variants?productId=${product.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setVariants(data);
        })
        .catch(() => {});
    }
  }, [product.id, product.storeId]);

  const getYouTubeId = useCallback((url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }, []);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const variantGroups = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {});

  const variantPrice = Object.values(selectedVariants).reduce((sum, val) => {
    const v = variants.find((x) => `${x.name}:${x.value}` === `${Object.keys(selectedVariants).find(k => selectedVariants[k] === val)}:${val}`);
    return sum + (v?.additionalPrice || 0);
  }, 0);

  const finalPrice = product.price + variantPrice;
  const subtotal = finalPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: finalPrice,
      quantity,
      image: product.image,
    });
    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
      openCart();
    }, 600);
  };

  const buildWAMessage = () => {
    const variantText = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const lines = [
      `Halo, saya mau order produk berikut:`,
      ``,
      `*${product.name}*`,
      `Harga: Rp ${finalPrice.toLocaleString("id-ID")}`,
      `Jumlah: ${quantity}`,
      `Subtotal: Rp ${subtotal.toLocaleString("id-ID")}`,
    ];
    if (variantText) lines.splice(2, 0, `Varian: ${variantText}`);
    if (customerName) lines.push(`Nama: ${customerName}`);
    if (customerPhone) lines.push(`No. WA: ${customerPhone}`);
    lines.push(``, `Link produk: ${window.location.href}`);
    return lines.join("\n");
  };

  const handleWAOrder = async () => {
    const waPhone = "6282139742007";
    const message = buildWAMessage();
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

    // Save order to PocketBase
    if (product.storeId) {
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [{ productId: product.id, productName: product.name, price: finalPrice, quantity, variant: Object.entries(selectedVariants).map(([k, v]) => `${k}:${v}`).join(", "), image: product.image }],
            totalAmount: subtotal,
            customerName: customerName || undefined,
            customerPhone: customerPhone || undefined,
          }),
        });
      } catch {}
    }

    window.open(waUrl, "_blank");
    setOrderSent(true);
    setShowOrderModal(false);
    setQuantity(1);
    setSelectedVariants({});
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    }
  };

  return (
    <>
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Beranda</Link>
        <span>/</span>
        <Link href={`/category/${product.categoryName.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-accent transition-colors">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-primary font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* LEFT — GALLERY */}
        <div className="space-y-3">
          {/* Main media */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {showVideo && allMedia[selectedImage]?.type === 'video' ? (
              <div className="w-full h-full">
                {getYouTubeId(allMedia[selectedImage].src) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(allMedia[selectedImage].src)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(allMedia[selectedImage].src)}`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={allMedia[selectedImage].src}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
              </div>
            ) : (
              <img
                src={allMedia[selectedImage]?.src || product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-opacity duration-300"
              />
            )}

            {/* Prev / Next arrows */}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={() => { setShowVideo(false); setSelectedImage((p) => (p === 0 ? allMedia.length - 1 : p - 1)); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => { setShowVideo(false); setSelectedImage((p) => (p === allMedia.length - 1 ? 0 : p + 1)); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Discount badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                Diskon {discount}%
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {allMedia.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allMedia.map((media, i) => (
                <button
                  key={i}
                  onClick={() => { setShowVideo(media.type === 'video'); setSelectedImage(i); }}
                  className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    i === selectedImage ? "border-accent ring-2 ring-accent/20" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Play size={20} className="text-white" fill="white" />
                    </div>
                  ) : (
                    <img src={media.src} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — DETAILS */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
              {product.categoryName}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-accent">
              Rp {finalPrice.toLocaleString("id-ID")}
            </span>
            {product.originalPrice && product.originalPrice > finalPrice && (
              <span className="text-lg text-muted line-through">
                Rp {product.originalPrice.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Variants from PocketBase */}
          {Object.entries(variantGroups).map(([groupName, options]) => (
            <div key={groupName}>
              <label className="text-xs font-semibold text-muted block mb-2">
                {groupName}
              </label>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                  const isSelected = selectedVariants[groupName] === opt.value;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [groupName]: opt.value }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        isSelected
                          ? "bg-accent text-white border-accent shadow-md"
                          : "bg-white text-muted border-gray-200 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {opt.value}
                      {opt.additionalPrice ? ` (+Rp${opt.additionalPrice.toLocaleString("id-ID")})` : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <label className="text-xs font-semibold text-muted block mb-2">Jumlah</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="w-16 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
              >
                <Plus size={16} />
              </button>
              <span className="text-sm text-muted">
                = Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent-hover transition-all active:scale-[0.98] shadow-lg"
            >
              {showCheck ? (
                <><Check size={20} /> Ditambahkan</>
              ) : (
                <><ShoppingCart size={20} /> Tambahkan ke Keranjang</>
              )}
            </button>
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-success text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98] shadow-lg"
            >
              <WhatsAppIcon size={20} /> Order via WhatsApp
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-gray-200 text-muted hover:bg-gray-50 transition-all"
              title="Bagikan"
            >
              <Share2 size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-bold text-primary mb-4">Deskripsi Produk</h3>
          <div className={`text-sm text-muted leading-relaxed whitespace-pre-line ${
            !isDescriptionExpanded ? "line-clamp-6" : ""
          }`}>
            {product.description}
          </div>
          {product.description.length > 260 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-accent text-sm font-semibold mt-2 hover:underline"
            >
              {isDescriptionExpanded ? "Tutup" : "Baca selengkapnya..."}
            </button>
          )}
        </div>
      )}

      {/* Cara Order Section */}
      <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
        <h3 className="font-bold text-primary mb-4">Cara Order</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { icon: MessageSquare, step: "1", title: "Konsultasi" },
            { icon: FileText, step: "2", title: "Konfirmasi" },
            { icon: CreditCard, step: "3", title: "Pembayaran" },
            { icon: Package, step: "4", title: "Produksi" },
            { icon: Truck, step: "5", title: "Pengiriman" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <item.icon size={18} className="text-accent" />
              </div>
              <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs mx-auto mb-1">
                {item.step}
              </span>
              <p className="text-xs font-semibold text-primary">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER MODAL — WhatsApp checkout */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowOrderModal(false)} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-primary mb-4">Konfirmasi Order</h3>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <img src={product.image || "/placeholder.svg"} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-primary">{product.name}</p>
                  {Object.entries(selectedVariants).length > 0 && (
                    <p className="text-xs text-muted mt-0.5">
                      {Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-muted mt-0.5">{quantity} x Rp {finalPrice.toLocaleString("id-ID")}</p>
                </div>
                <p className="font-bold text-accent">Rp {subtotal.toLocaleString("id-ID")}</p>
              </div>
            </div>

            {/* Customer info */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Nama (opsional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">No. WhatsApp (opsional)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-muted font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleWAOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-success text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-all active:scale-[0.98]"
              >
                <WhatsAppIcon size={18} />
                {orderSent ? "Terkirim!" : "Kirim ke WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
