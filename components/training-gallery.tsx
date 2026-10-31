"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface TrainingGalleryProps {
  images?: string[];
}

interface SpanPattern {
  className: string;
}

// Curated 10-item repeating pattern that mixes 2x2, 2x1, 1x2, and 1x1 blocks
// perfectly across mobile (2 cols), tablet (3 cols), and desktop (4 cols)
const SPAN_PATTERNS: SpanPattern[] = [
  // 0: Large 2x2 feature block
  { className: "col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2" },
  // 1: Standard 1x1 block
  { className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1" },
  // 2: Tall 1x2 vertical portrait
  { className: "col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2" },
  // 3: Standard 1x1 block
  { className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1" },
  // 4: Wide 2x1 horizontal landscape
  { className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1" },
  // 5: Large 2x2 feature block
  { className: "col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2" },
  // 6: Tall 1x2 vertical portrait
  { className: "col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2" },
  // 7: Standard 1x1 block
  { className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1" },
  // 8: Wide 2x1 horizontal landscape
  { className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1" },
  // 9: Standard 1x1 block
  { className: "col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1" },
];

function getSpanClass(index: number, total: number): string {
  if (total === 1) {
    return "col-span-2 md:col-span-3 lg:col-span-4 row-span-2";
  }
  if (total === 2) {
    return "col-span-1 md:col-span-1 lg:col-span-2 row-span-2";
  }
  return SPAN_PATTERNS[index % SPAN_PATTERNS.length].className;
}

export default function TrainingGallery({ images = [] }: TrainingGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const validImages = Array.isArray(images)
    ? images.filter((img): img is string => typeof img === "string" && img.trim().length > 0)
    : [];

  const handlePrev = useCallback(() => {
    if (activeIdx === null || validImages.length === 0) return;
    setActiveIdx((prev) => (prev! - 1 + validImages.length) % validImages.length);
  }, [activeIdx, validImages.length]);

  const handleNext = useCallback(() => {
    if (activeIdx === null || validImages.length === 0) return;
    setActiveIdx((prev) => (prev! + 1) % validImages.length);
  }, [activeIdx, validImages.length]);

  // Keyboard navigation for Lightbox
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
      {/* Zero-Gap, Sharp-Edged Mosaic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 grid-flow-dense auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[250px] lg:auto-rows-[280px] rounded-none overflow-hidden border border-neutral-200 dark:border-neutral-800">
        {validImages.map((src, idx) => {
          const spanClass = getSpanClass(idx, validImages.length);

          return (
            <div
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`group relative overflow-hidden rounded-none bg-neutral-900 cursor-pointer ${spanClass}`}
              role="button"
              tabIndex={0}
              aria-label={`Open training photo ${idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIdx(idx);
                }
              }}
            >
              <Image
                src={src}
                alt={`Bytecode Campus Training - Moment ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105 select-none"
              />

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 flex items-center justify-center size-11 rounded-none bg-[#1550A5]/80 backdrop-blur-md text-white border border-white/20 shadow-xl">
                  <Maximize2 className="size-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeIdx !== null && validImages[activeIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setActiveIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveIdx(null)}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-50 flex size-10 items-center justify-center rounded-none bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" />
          </button>

          {/* Photo Counter */}
          <div className="absolute top-5 left-5 z-50 rounded-none bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/20">
            {activeIdx + 1} / {validImages.length}
          </div>

          {/* Previous Button */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 z-50 flex size-11 items-center justify-center rounded-none bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Fullscreen Image Preview */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
          >
            <Image
              src={validImages[activeIdx]}
              alt={`Bytecode Training Photo ${activeIdx + 1}`}
              width={1600}
              height={1000}
              priority
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-none shadow-2xl select-none"
            />
          </div>

          {/* Next Button */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 z-50 flex size-11 items-center justify-center rounded-none bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

