"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, X } from "lucide-react";

interface SuccessStoriesProps {
  videoIds: string[];
}

function StoryCard({
  videoId,
  index,
  onPlay,
}: {
  videoId: string;
  index: number;
  onPlay: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onPlay(videoId)}
      aria-label={`Play student success story video ${index + 1}`}
      className="group relative w-[85vw] sm:w-[46vw] lg:w-[calc((100vw-6rem)/3)] max-w-[480px] min-w-[280px] aspect-video shrink-0 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:focus-visible:ring-blue-400 cursor-pointer"
    >
      {!imgError ? (
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt={`Success Story Video ${index + 1}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover scale-[1.34] transition-transform duration-300 group-hover:scale-[1.38]"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-4 text-center">
          <Play className="size-8 mb-2 opacity-60 text-white" />
          <span className="text-xs font-medium text-neutral-300">
            Student Success Story
          </span>
        </div>
      )}

      {/* Dark gradient vignette for readable text and contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black/90" />

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-14 sm:size-16 rounded-full bg-red-600/90 text-white shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600">
          <Play className="size-6 sm:size-7 fill-white translate-x-0.5" />
        </div>
      </div>

      {/* Bottom Labels */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white pointer-events-none">
        <span className="font-medium drop-shadow-sm flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
          Watch Story
        </span>
        <span className="text-[11px] text-neutral-300 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md border border-white/10">
          Click to play
        </span>
      </div>
    </button>
  );
}

export default function SuccessStories({ videoIds }: SuccessStoriesProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handleCloseModal = useCallback(() => {
    setActiveVideoId(null);
  }, []);

  // Keyboard navigation & body scroll lock when modal is open
  useEffect(() => {
    if (!activeVideoId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideoId, handleCloseModal]);

  if (videoIds.length === 0) {
    return null;
  }

  // Duplicate the stories array to ensure an infinite, seamless continuous loop
  const duplicatedStories = [...videoIds, ...videoIds];

  return (
    <section className="relative w-full py-14 overflow-hidden border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/40">
      {/* Scoped Keyframes & Animation Rules for Left-to-Right Marquee */}
      <style>{`
        @keyframes marqueeLtrVideos {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        .marquee-track-ltr-videos {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeLtrVideos 30s linear infinite !important;
        }

        .marquee-track-ltr-videos:hover,
        .marquee-track-ltr-videos.is-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Student Success Stories
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Watch our students share their journey, projects, and career transformations.
        </p>
      </div>

      {/* Full-width Marquee Track with Lightweight Click-to-Play Cards */}
      <div className="relative z-10 w-full overflow-hidden">
        <div className="flex w-full overflow-hidden">
          <div
            className={`marquee-track-ltr-videos flex gap-6 px-4 ${
              activeVideoId ? "is-paused" : ""
            }`}
          >
            {duplicatedStories.map((videoId, idx) => (
              <StoryCard
                key={`${videoId}-${idx}`}
                videoId={videoId}
                index={idx}
                onPlay={(id) => setActiveVideoId(id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal: Mounts exactly ONE YouTube player when opened */}
      {activeVideoId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Student Success Story"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close video modal"
              className="absolute top-3 right-3 z-10 size-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Dedicated Active Player */}
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title="Student Success Story Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

