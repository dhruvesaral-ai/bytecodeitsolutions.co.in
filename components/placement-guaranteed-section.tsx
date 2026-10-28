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
  // 0: Crisp White / Neutral Card (Image 1)
  {
    containerClass:
      "bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 text-neutral-900 dark:text-white shadow-[0_-10px_35px_rgba(0,0,0,0.16)]",
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
  // 1: Vibrant Terracotta / Brand Orange Card (Image 2)
  {
    containerClass:
      "bg-[#E85D04] text-white border-0 ring-1 ring-white/20 shadow-[0_-12px_40px_rgba(232,93,4,0.35)]",
    titleColor: "text-white",
    descriptionColor: "text-white/90",
    pillClass:
      "bg-white/15 backdrop-blur-xs text-white border border-white/25",
    priceClass: "text-white",
    strikethroughClass: "text-white/70",
    buttonClass:
      "bg-white hover:bg-neutral-100 text-[#E85D04] font-bold shadow-lg hover:shadow-xl focus-visible:ring-white",
    badgeClass: "bg-white/20 text-white border-white/30 backdrop-blur-xs",
  },
  // 2: Obsidian Pitch Black Card (Image 2)
  {
    containerClass:
      "bg-[#0B0C10] text-white border border-neutral-800 shadow-[0_-12px_40px_rgba(0,0,0,0.6)]",
    titleColor: "text-white",
    descriptionColor: "text-neutral-300",
    pillClass: "bg-neutral-900 text-neutral-200 border border-neutral-800",
    priceClass: "text-white",
    strikethroughClass: "text-neutral-500",
    buttonClass:
      "bg-[#F58216] hover:bg-[#DE5426] text-white font-bold shadow-lg hover:shadow-xl focus-visible:ring-[#F58216]",
    badgeClass: "bg-emerald-950/60 text-emerald-400 border-emerald-800/80",
  },
  // 3: Royal Blue Theme (Brand Secondary)
  {
    containerClass:
      "bg-[#1550A5] text-white border-0 ring-1 ring-white/20 shadow-[0_-12px_40px_rgba(21,80,165,0.35)]",
    titleColor: "text-white",
    descriptionColor: "text-blue-50/90",
    pillClass:
      "bg-white/15 backdrop-blur-xs text-white border border-white/25",
    priceClass: "text-white",
    strikethroughClass: "text-blue-200/70",
    buttonClass:
      "bg-white hover:bg-neutral-100 text-[#1550A5] font-bold shadow-lg hover:shadow-xl focus-visible:ring-white",
    badgeClass: "bg-white/20 text-white border-white/30 backdrop-blur-xs",
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
      <div className="relative mx-auto w-[90%] px-4 sm:px-6 lg:px-8">
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#DE5426] hover:bg-[#c7451a] text-white font-medium text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Explore Courses</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Stacking Cards Container */}
        <div className="relative w-full mx-auto space-y-12 sm:space-y-16 pb-24 sm:pb-36">
          {courses.map((course, index) => {
            const theme = CARD_THEMES[index % CARD_THEMES.length];
            const isReversed = index % 2 === 1; // Alternating layout
            const courseHref = `/courses/${course.id}`;

            const durationDisplay = course.duration
              ? course.duration.toLowerCase().includes("month")
                ? course.duration
                : `${course.duration} Months`
              : "";

            // Portrait art is optional; when absent the landscape asset is used
            // on every breakpoint and the frame must stay landscape too.
            const portraitImgUrl = course.portraitImgUrl;

            return (
              <div
                key={course.id}
                className="sticky transition-all duration-300 ease-out"
                style={{
                  top: `calc(80px + ${index * 24}px)`,
                  zIndex: 10 + index,
                }}
              >
                <article
                  className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 transition-transform duration-200 ${theme.containerClass}`}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isReversed ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                  >
                    {/* Media Column (Image & Live Badge) */}
                    <div className="lg:col-span-4 xl:col-span-4 w-full flex justify-center">
                      <div
                        className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-neutral-900 group ${portraitImgUrl
                            ? "lg:aspect-[9/16]"
                            : ""
                          }`}
                      >
                        {/* Landscape course image (mobile, and desktop when no portrait asset exists) */}
                        <Image
                          src={course.courseImgUrl}
                          alt={course.name}
                          fill
                          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${portraitImgUrl ? "lg:hidden" : ""
                            }`}
                          unoptimized
                        />
                        {/* Large screens: portrait course image */}
                        {portraitImgUrl && (
                          <Image
                            src={portraitImgUrl}
                            alt={course.name}
                            fill
                            sizes="(max-width: 1280px) 340px, 360px"
                            className="hidden object-cover transition-transform duration-500 group-hover:scale-105 lg:block"
                            unoptimized
                          />
                        )}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-8 xl:col-span-8 flex flex-col space-y-5">

                      {/* Title */}
                      <h3
                        className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug ${theme.titleColor}`}
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
                          className={`text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 ${theme.descriptionColor}`}
                        >
                          {course.shortDescription || course.longDescription}
                        </p>
                      )}

                      {/* 3 Key Stats / Feature Badges */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
                        {durationDisplay ? (
                          <div
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium ${theme.pillClass}`}
                          >
                            <Clock className="size-4 shrink-0 opacity-80" />
                            <div className="min-w-0">
                              <p className="font-bold truncate">{durationDisplay}</p>
                              <p className="text-[10px] opacity-70 truncate hidden sm:block">
                                Curriculum
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium ${theme.pillClass}`}
                          >
                            <Clock className="size-4 shrink-0 opacity-80" />
                            <div className="min-w-0">
                              <p className="font-bold truncate">Comprehensive</p>
                              <p className="text-[10px] opacity-70 truncate hidden sm:block">
                                Curriculum
                              </p>
                            </div>
                          </div>
                        )}

                        <div
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium ${theme.pillClass}`}
                        >
                          <ShieldCheck className="size-4 shrink-0 opacity-80" />
                          <div className="min-w-0">
                            <p className="font-bold truncate">Certified</p>
                            <p className="text-[10px] opacity-70 truncate hidden sm:block">
                              Job Guarantee
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium ${theme.pillClass}`}
                        >
                          <Headphones className="size-4 shrink-0 opacity-80" />
                          <div className="min-w-0">
                            <p className="font-bold truncate">24/7</p>
                            <p className="text-[10px] opacity-70 truncate hidden sm:block">
                              Mentor Support
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action Button (Matching Image 2) */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-current/10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-medium uppercase tracking-wider opacity-70">
                            Price
                          </span>
                          <span
                            className={`text-xl sm:text-2xl lg:text-3xl font-extrabold ${theme.priceClass}`}
                          >
                            {formatPriceINR(course.discountedPrice)}
                          </span>
                          {course.originalPrice > course.discountedPrice && (
                            <span
                              className={`text-xs sm:text-sm line-through ${theme.strikethroughClass}`}
                            >
                              {formatPriceINR(course.originalPrice)} (+GST)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={courseHref}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${theme.buttonClass}`}
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
