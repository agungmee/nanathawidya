"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ABOUT_GALLERY_IMAGES } from "@/lib/gallery-images";

export function AboutGallery() {
  return (
    <div className="absolute inset-0">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="w-full h-full rounded-2xl overflow-hidden"
      >
        {ABOUT_GALLERY_IMAGES.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
