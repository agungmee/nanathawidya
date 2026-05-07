import type { Product, Category, Banner } from "@/types";

export const WA_PHONE = "6282139742007";

export function getWAUrl(message: string) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

export const DEMO_CATEGORIES: Category[] = [
  {
    id: "1", name: "Karung Plastik", slug: "karung-plastik",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    description: "Karung plastik PP woven dan laminasi untuk beras, pakan, pupuk, dan kemasan industri"
  },
  {
    id: "2", name: "Plastik Packing", slug: "plastik-packing",
    image: "https://images.unsplash.com/photo-1585670149965-2fca1a3b7e3a?w=400&q=80",
    description: "Plastik kemasan custom untuk produk UMKM dan industri"
  },
];

export const DEMO_BANNERS: Banner[] = [
  {
    id: "1",
    title: "PT. Nirwasita Athawidya Nusantara",
    subtitle: "Produsen Karung Plastik & Plastik Packing Terpercaya. Harga Pabrik, Kualitas Ekspor, Melayani Partai Besar & Kecil.",
    type: "image",
    image: "https://everz-digital.site/wp-content/uploads/2026/05/f9b3560d-01ce-41a2-80c8-3cd69390e919.jpeg",
    url: "/category/karung-plastik",
    sortOrder: 1,
  },
];

export const DEMO_PRODUCTS: Product[] = [
  // === KARUNG PLASTIK ===
  {
    id: "k1", categoryId: "1",
    name: "Karung Plastik Putih Polos",
    slug: "karung-plastik-putih-polos",
    description: `Karung plastik putih polos untuk berbagai kebutuhan industri, pertanian, dan perdagangan.

SPESIFIKASI:
- Bahan: PP Woven (Polypropylene)
- Warna: Putih polos
- Ukuran: Custom (50x75cm, 55x85cm, 60x100cm, dll)
- Kapasitas: 10kg / 25kg / 50kg / Custom
- Jahitan: Jahit benang / lipat lem
- Cocok untuk: Beras, tepung, pakan ternak, pupuk, gula pasir, dan produk kering lainnya

KEUNGGULAN:
1. Kuat dan tahan sobek
2. Harga ekonomis
3. Tersedia berbagai ukuran
4. Minimal order: 500 pcs

Estimasi pengerjaan: 7-14 hari kerja`,
    price: 2200,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80"],
    isActive: true, isFeatured: true, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k2", categoryId: "1",
    name: "Karung Plastik Transparan Polos",
    slug: "karung-plastik-transparan-polos",
    description: `Karung plastik transparan/bening untuk produk yang ingin terlihat dari luar kemasan.

SPESIFIKASI:
- Bahan: PP Woven transparan
- Warna: Bening / transparan
- Ukuran: Custom
- Kapasitas: 25kg / 50kg / Custom
- Jahitan: Jahit benang / lipat lem

Cocok untuk: Produk yang ingin memperlihatkan isi seperti biji plastik, kacang-kacangan, kerajinan, dll.

Minimal order: 500 pcs`,
    price: 2500,
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: true, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k3", categoryId: "1",
    name: "Karung Plastik Kombinasi Warna Custom",
    slug: "karung-plastik-kombinasi-warna",
    description: `Karung plastik dengan kombinasi warna sesuai keinginan Anda. Tambahkan aksen warna untuk branding produk.

SPESIFIKASI:
- Bahan: PP Woven warna
- Warna: Kombinasi 2-4 warna sesuai permintaan
- Ukuran: Custom
- Kapasitas: 10kg - 50kg
- Jahitan: Jahit benang / lipat lem

Pilihan warna: Biru, hijau, merah, kuning, orange, putih, hitam, dan kombinasi lainnya.

COCOK UNTUK:
- Pakan ternak (kombinasi hijau-putih)
- Pupuk (kombinasi biru-putih, merah-putih)
- Beras premium
- Produk ekspor

Minimal order: 1.000 pcs`,
    price: 3000,
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k4", categoryId: "1",
    name: "Karung Full Warna (Kuning, Hijau, Pink, Biru, dll)",
    slug: "karung-full-warna",
    description: `Karung plastik full warna — satu warna solid sesuai pilihan. Tersedia berbagai pilihan warna cerah.

SPESIFIKASI:
- Bahan: PP Woven full color
- Warna: Kuning, hijau, merah, biru, pink, orange, hitam, putih, dan lainnya
- Ukuran: Custom
- Kapasitas: 10kg - 50kg
- Jahitan: Jahit benang / lipat lem

PILIHAN WARNA POPULER:
- Kuning (cocok untuk pakan ternak)
- Hijau (cocok untuk pupuk)
- Pink (cocok untuk produk kosmetik/kecantikan)
- Biru (cocok untuk produk ekspor)
- Merah (cocok untuk produk premium)

Minimal order: 500 pcs`,
    price: 2800,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k5", categoryId: "1",
    name: "Karung Plastik Putih Polos Laminasi",
    slug: "karung-plastik-putih-laminasi",
    description: `Karung plastik putih polos dengan lapisan laminasi untuk perlindungan ekstra terhadap kelembaban.

SPESIFIKASI:
- Bahan: PP Woven + Laminasi
- Warna: Putih dengan laminasi doff/glossy
- Ukuran: Custom
- Kapasitas: 25kg - 50kg
- Finishing: Laminasi full / 3 sisi

KEUNGGULAN LAMINASI:
1. Melindungi produk dari kelembaban dan air
2. Memperkuat karung
3. Tahan bocor
4. Tampilan lebih premium

Cocok untuk: Gula pasir, tepung terigu, beras premium, pupuk, pakan ternak premium.

Minimal order: 1.000 pcs`,
    price: 3200,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k6", categoryId: "1",
    name: "Karung Plastik Transparan Laminasi",
    slug: "karung-plastik-transparan-laminasi",
    description: `Karung plastik transparan dengan laminasi untuk perlindungan ekstra tanpa mengurangi visibilitas produk.

SPESIFIKASI:
- Bahan: PP Woven transparan + Laminasi
- Warna: Bening dengan laminasi
- Ukuran: Custom
- Kapasitas: 25kg - 50kg

Cocok untuk produk yang ingin terlihat namun tetap terlindungi dari kelembaban.

Minimal order: 1.000 pcs`,
    price: 3500,
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k7", categoryId: "1",
    name: "Karung Plastik Kombinasi Warna Laminasi",
    slug: "karung-plastik-kombinasi-laminasi",
    description: `Karung plastik kombinasi warna dengan laminasi — perpaduan estetika dan perlindungan maksimal.

- Bahan: PP Woven kombinasi warna + Laminasi
- Warna: Kombinasi 2-4 warna sesuai permintaan
- Finishing: Laminasi doff/glossy
- Ukuran: Custom

Minimal order: 1.000 pcs`,
    price: 3700,
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k8", categoryId: "1",
    name: "Karung Plastik Full Warna Laminasi",
    slug: "karung-full-warna-laminasi",
    description: `Karung plastik full warna dengan laminasi — kualitas premium untuk produk kelas atas.

- Bahan: PP Woven full color + Laminasi
- Warna: Full warna sesuai pilihan
- Finishing: Laminasi doff/glossy
- Ukuran: Custom

Minimal order: 1.000 pcs`,
    price: 3800,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: true, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },
  {
    id: "k9", categoryId: "1",
    name: "Karung Plastik BOPP – Custom Merk Sendiri atau Merk Umum",
    slug: "karung-plastik-bopp-merk",
    description: `Karung plastik dengan laminasi BOPP (Biaxially Oriented Polypropylene) — cetak merk sendiri atau pilih dari merk umum yang tersedia.

SPESIFIKASI:
- Bahan: PP Woven + Laminasi BOPP
- Cetak: Rotogravure full color (hingga 10 warna)
- Hasil: Tajam, glossy, tahan lama
- Ukuran: Custom

PILIHAN:
1. Custom merk sendiri — cetak brand, logo, dan desain Anda
2. Merk umum siap pakai — pilihan merk populer yang tersedia

KEUNGGULAN BOPP:
1. Kualitas cetak seperti majalah — sangat tajam dan detail
2. Tahan gores dan tidak mudah luntur
3. Anti air dan anti lembab
4. Tampilan premium — meningkatkan nilai jual produk

Cocok untuk: Beras premium, tepung, gula, kopi, pakan ternak khusus, dan produk ekspor.

Minimal order custom: 2.000 pcs`,
    price: 4500,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: true, category: DEMO_CATEGORIES[0], createdAt: new Date().toISOString(),
  },

  // === PLASTIK PACKING ===
  {
    id: "p1", categoryId: "2",
    name: "Standing Pouch Zipper Custom",
    slug: "standing-pouch-zipper-doypack",
    description: `Kemasan standing pouch / doypack dengan zipper untuk produk makanan dan minuman.

SPESIFIKASI:
- Bahan: PET/Alu/PE atau PET/MPET/PE
- Ukuran: 10x15cm - 25x35cm
- Cetak: Rotogravure full color
- Fitur: Zipper, tear notch, euro slot, bottom gusset
- Finishing: Glossy / Doff / Matte

Minimal order: 1.000 pcs`,
    price: 1500,
    image: "https://images.unsplash.com/photo-1585670149965-2fca1a3b7e3a?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: true, category: DEMO_CATEGORIES[1], createdAt: new Date().toISOString(),
  },
  {
    id: "p2", categoryId: "2",
    name: "Plastik Ziplock / Zipper Bag",
    slug: "plastik-ziplock-bag",
    description: `Plastik ziplock dengan cetak custom untuk kemasan premium berbagai produk.

- Bahan: PE / CPE / Laminate
- Ukuran: 5x8cm - 30x40cm
- Cetak: Full color
- Fitur: Zipper press-to-close

Minimal order: 500 pcs`,
    price: 500,
    image: "https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: true, category: DEMO_CATEGORIES[1], createdAt: new Date().toISOString(),
  },
  {
    id: "p3", categoryId: "2",
    name: "Plastik OPP / PP Cetak Custom",
    slug: "plastik-opp-cetak",
    description: `Plastik OPP dan PP cetak custom harga ekonomis untuk berbagai kebutuhan.

- Bahan: OPP / PP / PE
- Ukuran: Custom
- Cetak: Flexo 1-6 warna
- Min. order: 500 pcs

Cocok untuk baju, roti, kue, souvenir, snack ringan.`,
    price: 150,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[1], createdAt: new Date().toISOString(),
  },
  {
    id: "p4", categoryId: "2",
    name: "Plastik Shrink / Heat Sleeve",
    slug: "plastik-shrink-sleeve",
    description: `Plastik shrink dan heat sleeve untuk kemasan botol, cup, dan kaleng.

- Bahan: PVC / PET / OPS shrink film
- Cetak: Rotogravure full color 360°
- Shrink ratio: 50-60%

Minimal order: 5.000 pcs`,
    price: 300,
    image: "https://images.unsplash.com/photo-1596657107560-b1524ab08df3?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[1], createdAt: new Date().toISOString(),
  },
  {
    id: "p5", categoryId: "2",
    name: "Plastik Vakum / Nylon Vakum Custom",
    slug: "plastik-vakum-nylon",
    description: `Plastik vakum nylon untuk kemasan kopi, makanan kering, dan frozen food.

- Bahan: Nylon / EVOH / PE multi layer
- Cetak: Rotogravure full color
- Fitur: One way valve (degassing) untuk kopi

Minimal order: 1.000 pcs`,
    price: 1000,
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[1], createdAt: new Date().toISOString(),
  },
  {
    id: "p6", categoryId: "2",
    name: "Bubble Wrap & Stretch Film",
    slug: "bubble-wrap-stretch-film",
    description: `Bubble wrap dan stretch film untuk packing aman pengiriman barang.

- Bubble wrap: LDPE, gelembung 10/20/30mm, lebar 50-120cm
- Stretch film: LLDPE, lebar 50/100cm, tebal 15-25 micron

Ready stock!`,
    price: 35000,
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=400&q=80",
    galleryUrls: [],
    isActive: true, isFeatured: false, category: DEMO_CATEGORIES[1], createdAt: new Date().toISOString(),
  },
];

export const DEMO_PRODUCTS_BY_CATEGORY = DEMO_PRODUCTS.reduce<Record<string, Product[]>>((acc, p) => {
  if (!acc[p.categoryId]) acc[p.categoryId] = [];
  acc[p.categoryId].push(p);
  return acc;
}, {});

export const DEMO_FEATURED_PRODUCTS = DEMO_PRODUCTS.filter((p) => p.isFeatured);
