"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface TrainingGalleryProps {
  images?: string[];
}

const IMAGES_PER_PAGE = 12;

export default function TrainingGallery({ images = [] }: TrainingGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const validImages = Array.isArray(images)
    ? images.filter(
        (img): img is string => typeof img === "string" && img.trim().length > 0
      )
    : [];

  const handlePrev = useCallback(() => {
    if (activeIdx === null || validImages.length === 0) return;
    setActiveIdx(
      (prev) => (prev! - 1 + validImages.length) % validImages.length
    );
  }, [activeIdx, validImages.length]);

  const handleNext = useCallback(() => {
    if (activeIdx === null || validImages.length === 0) return;
    setActiveIdx((prev) => (prev! + 1) % validImages.length);
  }, [activeIdx, validImages.length]);

  useEffect(() => {
    if (activeIdx === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIdx, handleNext, handlePrev]);

  const totalPages = Math.max(1, Math.ceil(validImages.length / IMAGES_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * IMAGES_PER_PAGE;
  const pageImages = validImages.slice(pageStart, pageStart + IMAGES_PER_PAGE);
  const showPagination = validImages.length > IMAGES_PER_PAGE;

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
        {pageImages.map((src, idx) => {
          const globalIdx = pageStart + idx;
          return (
          <button
            key={`${src}-${globalIdx}`}
            type="button"
            onClick={() => setActiveIdx(globalIdx)}
            className="group relative w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] sm:w-[200px] sm:shrink-0"
            aria-label={`Open training photo ${globalIdx + 1}`}
          >
            <Image
              src={src}
              alt={`Bytecode campus training photo ${globalIdx + 1}`}
              width={400}
              height={300}
              sizes="(max-width: 640px) 100vw, 200px"
              className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] sm:w-[200px]"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
              <div className="flex size-9 scale-90 items-center justify-center rounded-md border border-white/20 bg-[#1550A5]/85 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Maximize2 className="size-4" />
              </div>
            </div>
          </button>
          );
        })}
      </div>

      {showPagination && (
        <nav
          className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          aria-label="Gallery pagination"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={safePage === 0}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={safePage >= totalPages - 1}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Page{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">
              {safePage + 1}
            </span>{" "}
            of {totalPages}
            <span className="mx-2 text-neutral-300 dark:text-neutral-600">
              ·
            </span>
            Showing {pageStart + 1}–
            {Math.min(pageStart + pageImages.length, validImages.length)} of{" "}
            {validImages.length} photos
          </p>
        </nav>
      )}

      {activeIdx !== null && validImages[activeIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setActiveIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-6"
        >
          <button
            type="button"
            onClick={() => setActiveIdx(null)}
            aria-label="Close preview"
            className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" />
          </button>

          <div className="absolute left-4 top-5 z-50 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {activeIdx + 1} / {validImages.length}
          </div>

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 z-50 flex size-11 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 sm:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-6xl items-center justify-center px-10 sm:px-16"
          >
            <Image
              src={validImages[activeIdx]}
              alt={`Bytecode training photo ${activeIdx + 1}`}
              width={1600}
              height={1200}
              priority
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 z-50 flex size-11 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}