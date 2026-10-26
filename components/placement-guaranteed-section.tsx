"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
  Award,
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

// Fallback cohort matching user screenshot if fewer than 3 are present in the DB
const SUPPLEMENTAL_COHORT: Course = {
  id: "data-science-analytics-gen-ai",
  name: "Data Science & Analytics with Gen AI",
  shortDescription:
    "Gain hands-on experience in data analysis, visualization, modern machine learning pipelines, and AI integration with direct placement support.",
  longDescription: "",
  originalPrice: 19998,
  discountedPrice: 9799,
  rating: 4.9,
  technologyTags: ["Python", "PowerBI", "SQL", "Gen AI", "Machine Learning", "Excel"],
  duration: "5+ Months",
  status: "active",
  courseImgUrl:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  courseCategorieId: "cmvo9fyao0006ll3tgks2a7ul",
  isInSale: true,
  syllabus: null,
  isPlacementGurranted: true,
  courseCategorie: {
    id: "cmvo9fyao0006ll3tgks2a7ul",
    name: "100% Placement Opportunity Guaranteed Courses",
    slug: "100%-placement-opportunity-guaranteed-courses",
  },
};

export default function PlacementGuaranteedSection({
  courses,
}: PlacementGuaranteedSectionProps) {
  // Build card deck: DB placement courses + supplementary if needed to match screenshot trio
  const displayCourses: Course[] = React.useMemo(() => {
    const list = [...courses];
    if (list.length === 0) {
      // Offline fallback
      return [
        {
          id: "cmvoah7t70001dx3th0jdzoqk",
          name: "100% Placement Opportunity Guranteed AI Powered Cohort (JAVA): Complete Web, App Development + DSA + Gen-AI + Aptitude",
          shortDescription:
            "Master AI-powered Java Software Engineering with complete Web & App Development, DevOps, and System Design. Learn Java, Spring Boot, DSA, and modern AI tools.",
          longDescription: "",
          originalPrice: 70000,
          discountedPrice: 55000,
          rating: 5,
          technologyTags: [
            "Java",
            "Spring Boot",
            "Full Stack",
            "DSA",
            "System Design",
            "Gen-AI",
            "Docker",
            "AWS",
          ],
          duration: "18 Months",
          status: "active",
          courseImgUrl:
            "https://admin.bytecode.co.in/uploads/images/1792962836095-AI-Powered-Full-Stack-Java-Course-Banner-1.png",
          courseCategorieId: "cmvo9fyao0006ll3tgks2a7ul",
          isInSale: true,
          syllabus: null,
          isPlacementGurranted: true,
          courseCategorie: null,
        },
        SUPPLEMENTAL_COHORT,
        {
          id: "cmvoaf6x20000dx3tg8gref7b",
          name: "100% Placement Opportunity Guranteed AI Powered Cohort (JAVASCRIPT): Complete Web, App Development + DSA + Gen-AI + Aptitude",
          shortDescription:
            "Master AI-powered Software Engineering with complete Web & App Development and DevOps. Learn modern technologies, build real-world products, and prepare for top tech roles.",
          longDescription: "",
          originalPrice: 65000,
          discountedPrice: 50000,
          rating: 5,
          technologyTags: [
            "JavaScript",
            "React",
            "Next.js",
            "Node.js",
            "TypeScript",
            "Gen-AI",
            "DevOps",
          ],
          duration: "18 Months",
          status: "active",
          courseImgUrl:
            "https://admin.bytecode.co.in/uploads/images/1792962855659-AI-Powered-JavaScript-Engineering-Course.png",
          courseCategorieId: "cmvo9fyao0006ll3tgks2a7ul",
          isInSale: true,
          syllabus: null,
          isPlacementGurranted: true,
          courseCategorie: null,
        },
      ];
    }

    // If 2 courses from DB, inject Data Science cohort in between or as 2nd card to replicate the Orange Card in Image 2
    if (list.length === 2) {
      return [list[0], SUPPLEMENTAL_COHORT, list[1]];
    }

    return list;
  }, [courses]);

  if (displayCourses.length === 0) {
    return null;
  }

  return (
    <section
      id="placement-guaranteed-courses"
      aria-labelledby="placement-section-heading"
      className="relative w-full py-16 sm:py-24 border-y transition-colors duration-300 bg-[#0C0D14] text-white border-neutral-800/80 dark:bg-[#FAF4EE] dark:text-neutral-900 dark:border-amber-900/10 rounded-tl-[50px] rounded-tr-[50px] overflow-visible"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-7xl mx-auto mb-12 sm:mb-16">

          <h2
            id="placement-section-heading"
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-white dark:text-neutral-900"
          >
            Wanted to get a <strong>Job</strong>?<br></br>
            <span className="block mt-1 sm:mt-2">We&apos;re Here To Help.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-neutral-300 dark:text-neutral-600 leading-relaxed max-w-2xl mx-auto">
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
        {/*
          Each card wrapper is sticky.
          Offset calculation: top: calc(80px + ${index * 24}px)
          Header is sticky at 64px (h-16, z-40).
          Cards have z-index: 10 + index so:
          1. Header always stays on top of cards (40 > 10..15).
          2. Card 1 (z-11) slides smoothly OVER Card 0 (z-10).
          3. Card 2 (z-12) slides smoothly OVER Card 1 (z-11).
          4. Stepped top offsets (80px, 104px, 128px...) ensure the top of previously stacked cards peek out like a real card deck!
        */}
        <div className="relative max-w-6xl mx-auto space-y-12 sm:space-y-16 pb-24 sm:pb-36">
          {displayCourses.map((course, index) => {
            const theme = CARD_THEMES[index % CARD_THEMES.length];
            const isReversed = index % 2 === 1; // Alternating layout like Image 1 & 2
            const courseHref = course.id.startsWith("cmv")
              ? `/courses/${course.id}`
              : `/courses`;

            const durationDisplay = course.duration
              ? course.duration.toLowerCase().includes("month")
                ? course.duration
                : `${course.duration} Months`
              : "6+ Months";

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
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                  >
                    {/* Media Column (Image & Live Badge) */}
                    <div className="lg:col-span-5 w-full">
                      <div className="relative aspect-[16/10] sm:aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg bg-neutral-900 group">
                        <Image
                          src={course.courseImgUrl}
                          alt={course.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />

                        {/* Top Badges Overlay */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                            <ShieldCheck className="size-3.5" />
                            <span>100% Placement Assured</span>
                          </span>

                          {course.isInSale && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#F58216] text-white tracking-wide uppercase">
                              Active Cohort
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                      {/* Category & Verified Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${theme.badgeClass}`}
                        >
                          <Award className="size-3" />
                          <span>Guaranteed Placement Career Track</span>
                        </span>

                        <span className="text-xs font-semibold opacity-75">
                          ★ {course.rating.toFixed(1)} / 5.0
                        </span>
                      </div>

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
                      <p
                        className={`text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 ${theme.descriptionColor}`}
                      >
                        {course.shortDescription}
                      </p>

                      {/* 3 Key Stats / Feature Badges (Matching Image 2) */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
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

                      {/* Technology Chips */}
                      {course.technologyTags && course.technologyTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {course.technologyTags.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${theme.pillClass}`}
                            >
                              {tech}
                            </span>
                          ))}
                          {course.technologyTags.length > 5 && (
                            <span className="text-[10px] font-medium opacity-70">
                              +{course.technologyTags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

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
