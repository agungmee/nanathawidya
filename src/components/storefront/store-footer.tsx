import Link from "next/link";
import { Phone, Printer, Mail, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

interface FooterSettings {
  company_name?: string;
  logo?: string;
  description?: string;
  wa_phone?: string;
  company_email?: string;
  company_address?: string;
  company_city?: string;
  company_province?: string;
  tagline?: string;
}

interface FooterProps {
  categories: { id: string; name: string; slug: string }[];
  settings?: FooterSettings;
}

export function StoreFooter({ categories, settings = {} }: FooterProps) {
  const companyName = settings.company_name || "PT. Nirwasita Athawidya Nusantara";
  const waPhone = settings.wa_phone || "6282139742007";
  const email = settings.company_email || "ajpnirwasita@gmail.com";
  const address = settings.company_address || "Bandarejo Tama 47";
  const city = settings.company_city || "Sememi, Benowo";
  const province = settings.company_province || "Surabaya";
  const desc = settings.description || "Produsen karung plastik PP woven, laminasi, BOPP, dan plastik packing custom. Kualitas terbaik, harga pabrik.";

  return (
    <footer className="bg-primary text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-lg mb-4">
              PT.<span className="text-accent">{companyName.replace(/^PT\.?\s*/i, "")}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {desc}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Produk</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {categories.map((cat) => (
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
              <li><a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Konsultasi Gratis</a></li>
              <li><span className="cursor-default">Cetak Custom Karung</span></li>
              <li><span className="cursor-default">Cetak Plastik Packing</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-accent">Kontak</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-accent flex-shrink-0" />
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  {waPhone.replace(/(\d{3})(\d{4})(\d{4})/, "+62 $1-$2-$3")}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Printer size={14} className="text-accent flex-shrink-0 mt-0.5" />
                <span>{address}, {city}, {province}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-accent flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Truck size={14} className="text-accent flex-shrink-0" />
                <span>Melayani pengiriman seluruh Indonesia</span>
              </li>
            </ul>
            <div className="mt-4">
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-all w-full justify-center"
              >
                <WhatsAppIcon size={16} />
                Hubungi WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} {companyName}. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
