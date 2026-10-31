"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ShieldCheck,
  Headphones,
  ArrowRight,
} from "lucide-react";
import type { Course } from "@/services/CourseService";

interface PlacementGuaranteedSectionProps {
  courses: Course[];
}

interface CardTheme {
  containerClass: string;
  titleColor: string;
  descriptionColor: string;
  pillClass: string;
  priceClass: string;
  strikethroughClass: string;
  buttonClass: string;
  badgeClass: string;
}

const CARD_THEMES: CardTheme[] = [
  // 0: Royal Blue Theme (Brand Primary)
  {
    containerClass:
      "bg-[#1550A5] text-white shadow-2xl",
    titleColor: "text-white",
    descriptionColor: "text-blue-100/90",
    pillClass: "bg-white/15 backdrop-blur-xs text-white border border-white/20",
    priceClass: "text-white",
    strikethroughClass: "text-blue-200/75",
    buttonClass:
      "bg-white hover:bg-neutral-100 text-[#1550A5] font-bold shadow-md hover:shadow-lg focus-visible:ring-white",
    badgeClass: "bg-white/20 text-white border-white/30",
  },
  // 1: Brand Orange Theme (Brand Accent)
  {
    containerClass:
      "bg-[#F58216] text-white shadow-2xl",
    titleColor: "text-white",
    descriptionColor: "text-white/90",
    pillClass: "bg-white/15 backdrop-blur-xs text-white border border-white/20",
    priceClass: "text-white",
    strikethroughClass: "text-white/75",
    buttonClass:
      "bg-white hover:bg-neutral-100 text-[#F58216] font-bold shadow-md hover:shadow-lg focus-visible:ring-white",
    badgeClass: "bg-white/20 text-white border-white/30",
  },
  // 2: Obsidian Pitch Black Card
  {
    containerClass:
      "bg-[#0B0C10] text-white border border-neutral-800 shadow-2xl",
    titleColor: "text-white",
    descriptionColor: "text-neutral-300",
    pillClass: "bg-neutral-900 text-neutral-200 border border-neutral-800",
    priceClass: "text-white",
    strikethroughClass: "text-neutral-500",
    buttonClass:
      "bg-[#F58216] hover:bg-[#DE5426] text-white font-bold shadow-lg hover:shadow-xl focus-visible:ring-[#F58216]",
    badgeClass: "bg-emerald-950/60 text-emerald-400 border-emerald-800/80",
  },
  // 3: Crisp Neutral Theme
  {
    containerClass:
      "bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 text-neutral-900 dark:text-white shadow-2xl",
    titleColor: "text-neutral-900 dark:text-white",
    descriptionColor: "text-neutral-600 dark:text-neutral-300",
    pillClass:
      "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700",
    priceClass: "text-neutral-900 dark:text-white",
    strikethroughClass: "text-neutral-400 dark:text-neutral-500",
    buttonClass:
      "bg-[#1550A5] hover:bg-[#0f3a7a] text-white shadow-md hover:shadow-lg focus-visible:ring-[#1550A5]",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  },
];

function formatPriceINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PlacementGuaranteedSection({
  courses,
}: PlacementGuaranteedSectionProps) {
  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <section
      id="placement-guaranteed-courses"
      aria-labelledby="placement-section-heading"
      className="relative w-full py-16 sm:py-24 border-y transition-colors duration-300 bg-[#FAF4EE] text-neutral-900 border-amber-900/10 dark:bg-[#0C0D14] dark:text-white dark:border-neutral-800/80 rounded-tl-[50px] rounded-tr-[50px] overflow-visible"
    >
      <div className="relative mx-auto w-[95%] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-7xl mx-auto mb-12 sm:mb-16">
          <h2
            id="placement-section-heading"
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-neutral-900 dark:text-white"
          >
            Wanted to get a <strong>Job</strong>?<br></br>
            <span className="block">We&apos;re Here To Help.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Explore industry-vetted cohorts backed by 100% placement assurance,
            dedicated 1-on-1 mentorship, and production-grade capstone projects.
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#F58216] hover:bg-[#DE5426] text-white font-medium text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58216]"
            >
              <span>Explore Courses</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Cards Container: Stacking on mobile (<md), Side-by-Side 50/50 Row on desktop (>=md) */}
        <div className="relative w-full mx-auto md:flex md:flex-row md:items-stretch md:gap-0 md:sticky md:top-[112px] space-y-12 sm:space-y-16 md:space-y-0 pb-20 md:pb-28">
          {courses.map((course, index) => {
            const theme = CARD_THEMES[index % CARD_THEMES.length];
            const courseHref = `/courses/${course.id}`;
            const isFirst = index === 0;
            const isLast = index === courses.length - 1;
            const cornerClass =
              isFirst && !isLast
                ? "rounded-2xl md:rounded-r-none md:rounded-l-2xl"
                : isLast && !isFirst
                ? "rounded-2xl md:rounded-l-none md:rounded-r-2xl"
                : "rounded-2xl";

            const durationDisplay = course.duration
              ? course.duration.toLowerCase().includes("month")
                ? course.duration
                : `${course.duration} Months`
              : "";

            return (
              <div
                key={course.id}
                className="sticky md:static w-full md:w-1/2 md:flex-1 flex flex-col transition-all duration-300 ease-out"
                style={{
                  top: `calc(108px + ${index * 20}px)`,
                  zIndex: 10 + index,
                }}
              >
                <article
                  className={`relative h-full flex flex-col justify-between overflow-hidden transition-transform duration-200 ${cornerClass} ${theme.containerClass}`}
                >
                  <div className="flex flex-col h-full justify-between space-y-5">
                    {/* Media / Thumbnail */}
                    <div className="w-full">
                      <div className="relative w-full aspect-video overflow-hidden shadow-lg bg-neutral-900 group">
                        <Link
                          href={courseHref}
                          className="block w-full h-full"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <Image
                            src={course.courseImgUrl}
                            alt={course.name}
                            width={800}
                            height={450}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 justify-between space-y-4 p-4">
                      {/* Title */}
                      <h3
                        className={`text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight leading-snug flex items-center ${theme.titleColor}`}
                      >
                        <Link
                          href={courseHref}
                          className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                        >
                          {course.name}
                        </Link>
                      </h3>

                      {/* Description */}
                      {(course.shortDescription || course.longDescription) && (
                        <p
                          className={`text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 ${theme.descriptionColor}`}
                        >
                          {course.shortDescription || course.longDescription}
                        </p>
                      )}

                      {/* 3 Key Stats / Feature Badges */}
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <div
                          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-2 rounded-xl text-xs font-medium ${theme.pillClass}`}
                        >
                          <Clock className="size-3.5 sm:size-4 shrink-0 opacity-80" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-[11px] sm:text-xs">
                              {durationDisplay || "Comprehensive"}
                            </p>
                            <p className="text-[10px] opacity-75 truncate hidden sm:block">
                              Curriculum
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-2 rounded-xl text-xs font-medium ${theme.pillClass}`}
                        >
                          <ShieldCheck className="size-3.5 sm:size-4 shrink-0 opacity-80" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-[11px] sm:text-xs">
                              Certified
                            </p>
                            <p className="text-[10px] opacity-75 truncate hidden sm:block">
                              Job Guarantee
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-2 rounded-xl text-xs font-medium ${theme.pillClass}`}
                        >
                          <Headphones className="size-3.5 sm:size-4 shrink-0 opacity-80" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-[11px] sm:text-xs">
                              24/7
                            </p>
                            <p className="text-[10px] opacity-75 truncate hidden sm:block">
                              Mentor Support
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action Button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20 mt-auto">
                        <div className="hidden md:flex items-baseline gap-1.5 sm:gap-2">
                          <span className="text-[11px] font-medium uppercase tracking-wider opacity-80">
                            Price
                          </span>
                          <span
                            className={`text-lg sm:text-xl lg:text-2xl font-extrabold ${theme.priceClass}`}
                          >
                            {formatPriceINR(course.discountedPrice)}
                          </span>
                          {course.originalPrice > course.discountedPrice && (
                            <span
                              className={`text-xs line-through ${theme.strikethroughClass}`}
                            >
                              {formatPriceINR(course.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={courseHref}
                            className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${theme.buttonClass}`}
                          >
                            <span>Explore Program</span>
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
