import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    storeId?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      storeId?: string;
    };
  }
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  galleryUrls?: string[];
  videoUrl?: string;
  videoFile?: string;
  sku?: string;
  stock?: number;
  minOrder?: number;
  isActive: boolean;
  isFeatured: boolean;
  category: Category;
  storeId?: string;
  createdAt: string;
}

export interface Variant {
  id: string;
  name: string;
  value: string;
  additionalPrice?: number;
  stock?: number;
  productId: string;
  storeId: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  notes?: string;
  whatsappSent?: boolean;
  storeId: string;
  created: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

export interface OrderLog {
  id: string;
  orderId: string;
  fromStatus?: string;
  toStatus: string;
  note?: string;
  userId?: string;
  storeId: string;
  created: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  type: string;
  image?: string;
  url?: string;
  linkType?: string;
  sortOrder: number;
  isActive?: boolean;
  storeId?: string;
}

export type SortOption = "newest" | "cheapest" | "most_expensive" | "name_az" | "name_za" | "best_selling";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best_selling", label: "Terlaris" },
  { value: "newest", label: "Terbaru" },
  { value: "cheapest", label: "Termurah" },
  { value: "most_expensive", label: "Termahal" },
  { value: "name_az", label: "Nama A-Z" },
  { value: "name_za", label: "Nama Z-A" },
];

export const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "Di bawah 100rb", min: 0, max: 100000 },
  { label: "100rb - 250rb", min: 100000, max: 250000 },
  { label: "250rb - 500rb", min: 250000, max: 500000 },
  { label: "Di atas 500rb", min: 500000, max: Infinity },
];
