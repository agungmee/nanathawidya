import Link from "next/link";
import { BannerSlider } from "@/components/storefront/banner-slider";
import { AboutGallery } from "@/components/storefront/about-gallery";
import { DEMO_BANNERS, DEMO_CATEGORIES, WA_PHONE } from "@/lib/store-data";
import { Phone, Printer, Factory, ShieldCheck, BadgeCheck, Users, MessageSquare, FileText, CreditCard, Package, Truck, Award, Sparkles, Mail, BaggageClaim } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="px-4 pt-4">
        <BannerSlider banners={DEMO_BANNERS} />
      </section>

      <section className="relative mt-10 overflow-hidden">
        <div className="text-center mb-6 px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Produk Kami</h2>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mt-2" />
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 px-1">
          <Link
            href="/product/karung-plastik-putih-polos"
            className="group relative flex-1 min-h-[320px] sm:min-h-[420px] overflow-hidden"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
              <img
                src="https://everz-digital.site/wp-content/uploads/2026/05/4f76e2d0-0461-4194-96cc-d86bf86508c7.jpeg"
                alt="Packing Karung Custom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <BaggageClaim size={26} />
                </div>
                <div className="h-8 w-1 bg-accent rounded-full" />
              </div>
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 drop-shadow-lg">Packing Karung Custom</h3>
              <p className="text-white/80 text-sm sm:text-base max-w-md mb-4 drop-shadow leading-relaxed">
                Karung plastik PP woven, laminasi, BOPP. Custom ukuran, warna, dan cetak sesuai kebutuhan industri, pertanian, dan perdagangan Anda.
              </p>
              <span className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-all text-sm shadow-lg group/btn">
                Lihat Katalog
                <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
              </span>
            </div>
          </Link>
          <Link
            href="/product/standing-pouch-zipper-doypack"
            className="group relative flex-1 min-h-[320px] sm:min-h-[420px] overflow-hidden"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
              <img
                src="https://everz-digital.site/wp-content/uploads/2026/05/5f598391-c275-45a7-83d8-11c0c797959b.jpeg"
                alt="Packing Plastik Custom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <Package size={26} />
                </div>
                <div className="h-8 w-1 bg-accent rounded-full" />
              </div>
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 drop-shadow-lg">Packing Plastik Custom</h3>
              <p className="text-white/80 text-sm sm:text-base max-w-md mb-4 drop-shadow leading-relaxed">
                Standing pouch, ziplock, OPP, shrink sleeve, plastik vakum, dan bubble wrap. Cetak brand sendiri untuk produk UMKM dan industri.
              </p>
              <span className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-all text-sm shadow-lg group/btn">
                Lihat Katalog
                <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

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
