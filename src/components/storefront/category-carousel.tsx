"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={12}
      slidesPerView={2.2}
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 3.2, spaceBetween: 16 },
        1024: { slidesPerView: 4.2, spaceBetween: 16 },
      }}
      className="!px-4"
    >
      {categories.map((cat) => (
        <SwiperSlide key={cat.id}>
          <Link
            href={`/category/${cat.slug}`}
            className="block relative aspect-square rounded-2xl overflow-hidden group"
          >
            <img
              src={cat.image || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-white/70 text-xs mt-1 line-clamp-2 drop-shadow">
                  {cat.description}
                </p>
              )}
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
