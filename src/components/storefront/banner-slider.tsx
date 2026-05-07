"use client";

import Link from "next/link";
import type { Banner } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ABOUT_GALLERY_IMAGES } from "@/lib/gallery-images";

export function BannerSlider({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;

  const banner = banners[0];
  const heroImages = ABOUT_GALLERY_IMAGES.length ? ABOUT_GALLERY_IMAGES : [banner.image];

  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[3/1] rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          className="w-full h-full"
        >
          {heroImages.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`${banner.title} ${i + 1}`}
                className="w-full h-full object-cover blur-sm scale-110"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-black/55 z-10" />
      </div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 sm:px-12">
        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg leading-tight">
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
    </section>
  );
}
