"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import carouselData from "@/carousal.json";

export interface CarouselSlide {
  id?: string;
  order?: number;
  title?: string | null;
  description?: string | null;
  bg_img_url?: string | null;
  img_url?: string | null;
  btn_href_link?: string | null;
  go_to_link?: string | null;
  banner_href_link?: string | null;
  text_container_align?: "left" | "center" | "right" | string | null;
}

export interface SliderProps {
  position?: string;
  slides?: CarouselSlide[];
  className?: string;
  heightClassName?: string;
  autoplayDelay?: number;
}

export default function Slider({
  position = "homepage",
  slides: propSlides,
  className = "",
  heightClassName = "h-[280px] sm:h-[380px] md:h-[460px] lg:h-[500px]",
  autoplayDelay = 4000,
}: SliderProps) {
  // Resolve slides: priority to propSlides, otherwise lookup in carousal.json by position
  const resolvedSlides: CarouselSlide[] = useMemo(() => {
    if (propSlides && propSlides.length > 0) {
      return propSlides;
    }

    const rawCarousal = (carouselData as any)?.carousal;

    if (Array.isArray(rawCarousal)) {
      const match = rawCarousal.find((c: any) => c.position === position);
      return match?.carousal_slide_ids || [];
    } else if (rawCarousal && typeof rawCarousal === "object") {
      if (rawCarousal.position === position || !position) {
        return rawCarousal.carousal_slide_ids || [];
      }
    }

    return [];
  }, [propSlides, position]);

  if (!resolvedSlides || resolvedSlides.length === 0) {
    return null;
  }

  const getAlignmentClasses = (align?: string | null) => {
    switch (align) {
      case "center":
        return {
          container: "items-center",
          content: "text-center mx-auto",
          desc: "mx-auto text-center",
          btnGroup: "justify-center",
        };
      case "right":
        return {
          container: "items-end",
          content: "text-right ml-auto",
          desc: "ml-auto text-right",
          btnGroup: "justify-end",
        };
      case "left":
      default:
        return {
          container: "items-start",
          content: "text-left mr-auto",
          desc: "mr-auto text-left",
          btnGroup: "justify-start",
        };
    }
  };

  const getImageUrl = (slide: CarouselSlide) => {
    const url = slide.bg_img_url || slide.img_url;
    if (!url) return null;
    if (url.startsWith("./")) {
      return url.slice(1);
    }
    return url;
  };

  const getButtonUrl = (slide: CarouselSlide) => {
    return slide.btn_href_link || slide.go_to_link || null;
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-neutral-900 ${heightClassName}`}
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          direction="horizontal"
          speed={700}
          autoplay={{
            delay: autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={resolvedSlides.length > 1}
          pagination={{
            clickable: true,
          }}
          className="hero-swiper h-full w-full"
        >
          {resolvedSlides.map((slide, index) => {
            const align = getAlignmentClasses(slide.text_container_align);
            const imageUrl = getImageUrl(slide);
            const btnUrl = getButtonUrl(slide);
            const bannerLink = slide.banner_href_link || null;
            const hasContent = Boolean(slide.title || slide.description || btnUrl);

            return (
              <SwiperSlide
                key={slide.id || slide.order || index}
                className={`relative h-full w-full ${bannerLink ? "cursor-pointer group" : ""}`}
              >
                {/* Clickable Banner Link Layer */}
                {bannerLink && (
                  <Link
                    href={bannerLink}
                    className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
                    aria-label={slide.title || "Go to link"}
                  />
                )}

                {/* Background Image / Solid Surface */}
                <div className="absolute inset-0 z-0 bg-neutral-900">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={slide.title || "Bytecode IT Solutions"}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      unoptimized
                    />
                  )}
                  {hasContent && <div className="absolute inset-0 bg-black/65" />}
                </div>

                {/* Content Overlay */}
                {hasContent && (
                  <div
                    className={`relative z-20 pointer-events-none mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-10 lg:px-16 text-white ${align.container}`}
                  >
                    <div className={`max-w-3xl ${align.content} pointer-events-auto`}>
                      {slide.title && (
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                          {slide.title}
                        </h2>
                      )}

                      {slide.description && (
                        <p
                          className={`mt-3 text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed max-w-2xl ${align.desc}`}
                        >
                          {slide.description}
                        </p>
                      )}

                      {btnUrl && (
                        <div className={`mt-6 flex items-center gap-4 ${align.btnGroup} relative z-30`}>
                          <Link
                            href={btnUrl}
                            className="inline-flex items-center justify-center rounded-md bg-[#1550A5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
                          >
                            Explore now
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
