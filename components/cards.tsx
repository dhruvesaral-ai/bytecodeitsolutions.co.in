"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import type { Course } from "@/services/CourseService";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const discountPercent =
    course.originalPrice > course.discountedPrice
      ? Math.round(
          ((course.originalPrice - course.discountedPrice) /
            course.originalPrice) *
            100
        )
      : 0;

  return (
    <article className="group flex flex-col h-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden hover:border-[#1550A5] transition-all duration-200">
      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <Link href={`/courses/${course.id}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={course.courseImgUrl}
            alt={course.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </Link>

        {/* Badges on Thumbnail */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {course.isInSale && (
              <span className="rounded bg-[#F58216] px-2 py-0.5 text-[11px] font-semibold text-white tracking-wide">
                Sale
              </span>
            )}
            {course.isPlacementGurranted && (
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[11px] font-medium text-white tracking-wide">
                Placement Assured
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-none">
            <Clock className="size-3" />
            <span>{course.duration}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating and Primary Tech Tag */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1 overflow-hidden">
            {course.technologyTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 truncate max-w-[80px]"
              >
                {tag}
              </span>
            ))}
            {course.technologyTags.length > 2 && (
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                +{course.technologyTags.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Category if available */}
        {course.courseCategorie && (
          <p className="text-[11px] font-medium text-[#1550A5] dark:text-blue-400 mb-1">
            {course.courseCategorie.name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-2 leading-snug min-h-[2.5rem]">
          <Link
            href={`/courses/${course.id}`}
            className="hover:text-[#1550A5] dark:hover:text-blue-400 transition-colors"
          >
            {course.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed flex-1">
          {course.shortDescription}
        </p>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {formatCurrency(course.discountedPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] font-semibold text-[#F58216]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            {course.originalPrice > course.discountedPrice && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatCurrency(course.originalPrice)}
              </span>
            )}
          </div>

          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center rounded-md bg-[#1550A5] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}