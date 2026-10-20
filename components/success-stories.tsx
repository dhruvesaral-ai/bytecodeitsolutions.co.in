"use client";

import React from "react";

interface SuccessStoriesProps {
  videoIds: string[];
}

export default function SuccessStories({ videoIds }: SuccessStoriesProps) {
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

        .marquee-track-ltr-videos:hover {
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

      {/* Full-width Marquee Track (Max 3 iframes visible across screen) */}
      <div className="relative z-10 w-full overflow-hidden">
        <div className="flex w-full overflow-hidden">
          <div className="marquee-track-ltr-videos flex gap-6 px-4">
            {duplicatedStories.map((videoId, idx) => (
              <div
                key={`${videoId}-${idx}`}
                className="w-[85vw] sm:w-[46vw] lg:w-[calc((100vw-6rem)/3)] max-w-[480px] min-w-[280px] aspect-video shrink-0 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black shadow-md"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0`}
                  title={`Success Story Video ${idx + 1}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
