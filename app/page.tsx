import { Suspense } from "react";
import PlacedStudents from "@/components/placed-students";
import HomeContent from "@/components/home-content";
import EnquireNow from "@/components/enquire-now";
import { pageService } from "@/services/PageService";
import { formatHeadingHtml } from "@/lib/format-heading";

async function HomeHero() {
  const page = await pageService.getPageByRoute("home");

  if (!page?.heading && !page?.subheading && !page?.videoUrl) {
    return null;
  }

  const hasVideo = Boolean(page.videoUrl);

  return (
    <section
      className={`relative overflow-hidden w-full text-center ${
        hasVideo
          ? "min-h-[380px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center py-16 sm:py-20 md:py-24 bg-neutral-100 dark:bg-neutral-950"
          : "pt-8 sm:pt-12 pb-4 max-w-4xl mx-auto"
      } px-4 sm:px-6 lg:px-8`}
    >
      {hasVideo && page.videoUrl && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src={page.videoUrl}
          />
          {/* Base contrast tint */}
          <div
            className="pointer-events-none absolute inset-0 bg-white/70 dark:bg-black/75 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          {/* Subtle gradient to blend into adjacent sections */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white dark:from-black/40 dark:via-transparent dark:to-black"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        {page.heading && (
          page.heading.includes("<") ? (
            <h1
              className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white"
              dangerouslySetInnerHTML={{ __html: formatHeadingHtml(page.heading) }}
            />
          ) : (
            <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white">
              {page.heading}
            </h1>
          )
        )}
        {page.subheading && (
          <p
            className={`mt-4 text-base sm:text-lg ${
              hasVideo
                ? "text-neutral-700 dark:text-neutral-300 font-medium"
                : "text-neutral-600 dark:text-neutral-400"
            } max-w-2xl mx-auto leading-relaxed`}
          >
            {page.subheading}
          </p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[140px]" />}>
          <HomeHero />
        </Suspense>

        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <HomeContent />
        </Suspense>

        {/* Placed Students Animated Section */}
        <Suspense fallback={null}>
          <PlacedStudents />
        </Suspense>
      </main>
      <EnquireNow />
    </div>
  );
}