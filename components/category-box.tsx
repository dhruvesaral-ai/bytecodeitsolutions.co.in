"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard from "@/components/cards";
import type { Course, CourseCategory } from "@/services/CourseService";

import "swiper/css";
import "swiper/css/pagination";

interface CategoryBoxProps {
  category: CourseCategory;
  courses: Course[];
}

export default function CategoryBox({ category, courses }: CategoryBoxProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {category.name}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {courses.length} {courses.length === 1 ? "course" : "courses"} available
          </p>
        </div>

        {/* Swiper Custom Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label={`Previous ${category.name} courses`}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label={`Next ${category.name} courses`}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Courses Swiper Carousel (Max 4 at a time) */}
      <Swiper
        modules={[Navigation, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="w-full pb-2"
      >
        {courses.map((course) => (
          <SwiperSlide key={course.id} className="h-auto">
            <CourseCard course={course} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}