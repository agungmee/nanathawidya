"use client";

import { useState } from "react";
import Link from "next/link";
import type { Banner } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [swiper, setSwiper] = useState<any>(null);
  if (!banners.length) return null;

  return (
    <section className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden group">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true, dynamicBullets: true }}
        onSwiper={setSwiper}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              <img
                src={banner.image || "/placeholder.svg"}
                alt={banner.title || "Banner"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12">
                <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg leading-tight max-w-4xl">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-white/90 text-sm sm:text-lg md:text-xl max-w-2xl drop-shadow leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}
                {banner.url && (
                  <Link
                    href={banner.url}
                    className="mt-6 inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent-hover transition-all active:scale-[0.98] shadow-lg"
                  >
                    Lihat Produk Kami
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nav arrows */}
      <button
        onClick={() => swiper?.slidePrev()}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => swiper?.slideNext()}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
}
