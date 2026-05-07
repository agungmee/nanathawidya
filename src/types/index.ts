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
  image?: string;
  imageUrl?: string;
  images?: string[];
  galleryUrls?: string[];
  isActive: boolean;
  isFeatured: boolean;
  category: Category;
  createdAt: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  type: string;
  image?: string;
  url?: string;
  sortOrder: number;
}

export type SortOption = "newest" | "cheapest" | "most_expensive" | "name_az" | "name_za";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
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
