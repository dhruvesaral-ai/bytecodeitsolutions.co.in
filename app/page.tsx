import { Suspense } from "react";
import PlacedStudents from "@/components/placed-students";
import HomeContent from "@/components/home-content";
import EnquireNow from "@/components/enquire-now";
import { pageService } from "@/services/PageService";

async function HomeHero() {
  const page = await pageService.getPageByRoute("home");

  if (!page?.heading && !page?.subheading) {
    return null;
  }

  return (
    <section className="pt-8 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left sm:text-center">
      {page.heading && (
        page.heading.includes("<") ? (
          <h1
            className="text-left sm:text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: page.heading }}
          />
        ) : (
          <h1 className="text-left sm:text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white">
            {page.heading}
          </h1>
        )
      )}
      {page.subheading && (
        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {page.subheading}
        </p>
      )}
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