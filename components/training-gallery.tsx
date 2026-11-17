"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface TrainingGalleryProps {
  images?: string[];
}

export default function TrainingGallery({ images = [] }: TrainingGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

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

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-3">
        {validImages.map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="group relative w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
            aria-label={`Open training photo ${idx + 1}`}
          >
            <div className="relative aspect-[19/6] w-full">
              <Image
                src={src}
                alt={`Bytecode campus training photo ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
              <div className="flex size-9 scale-90 items-center justify-center rounded-md border border-white/20 bg-[#1550A5]/85 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Maximize2 className="size-4" />
              </div>
            </div>
          </button>
        ))}
      </div>

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
            className="relative flex w-full max-w-6xl items-center justify-center px-10 sm:px-16"
          >
            <div className="relative aspect-[19/6] w-full max-h-[min(85vh,56vw)]">
              <Image
                src={validImages[activeIdx]}
                alt={`Bytecode training photo ${activeIdx + 1}`}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1152px"
                className="object-contain"
              />
            </div>
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