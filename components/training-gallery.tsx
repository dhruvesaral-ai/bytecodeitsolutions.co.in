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

  const totalPages = Math.max(1, Math.ceil(validImages.length / IMAGES_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * IMAGES_PER_PAGE;
  const pageImages = validImages.slice(pageStart, pageStart + IMAGES_PER_PAGE);
  const showPagination = validImages.length > IMAGES_PER_PAGE;

  const handleLightboxPrev = useCallback(() => {
    if (activeIdx === null || validImages.length === 0) return;
    setActiveIdx(
      (prev) => (prev! - 1 + validImages.length) % validImages.length
    );
  }, [activeIdx, validImages.length]);

  const handleLightboxNext = useCallback(() => {
    if (activeIdx === null || validImages.length === 0) return;
    setActiveIdx((prev) => (prev! + 1) % validImages.length);
  }, [activeIdx, validImages.length]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (activeIdx === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowLeft") handleLightboxPrev();
      if (e.key === "ArrowRight") handleLightboxNext();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIdx, handleLightboxNext, handleLightboxPrev]);

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {pageImages.map((src, idx) => {
          const globalIdx = pageStart + idx;
          return (
            <li key={`${src}-${globalIdx}`}>
              <button
                type="button"
                onClick={() => setActiveIdx(globalIdx)}
                className="group relative w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
                aria-label={`Open training photo ${globalIdx + 1}`}
              >
                <Image
                  src={src}
                  alt={`Bytecode campus training photo ${globalIdx + 1}`}
                  width={640}
                  height={480}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                  <span className="flex size-9 scale-90 items-center justify-center rounded-md border border-white/20 bg-[#1550A5]/85 text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
                    <Maximize2 className="size-4" aria-hidden="true" />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

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
            className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          <p className="absolute left-4 top-5 z-50 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {activeIdx + 1} / {validImages.length}
          </p>

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLightboxPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 z-50 flex size-11 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/25 sm:left-6"
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
                handleLightboxNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 z-50 flex size-11 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/25 sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}