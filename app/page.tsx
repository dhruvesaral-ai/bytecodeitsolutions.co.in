import { Suspense } from "react";
import type { Metadata } from "next";
import PlacedStudents from "@/components/placed-students";
import HomeContent from "@/components/home-content";
import EnquireNow from "@/components/enquire-now";
import CustomPageContent from "@/components/custom-page-content";
import { pageService } from "@/services/PageService";
import { formatHeadingHtml } from "@/lib/format-heading";

export async function generateMetadata(): Promise<Metadata> {
  const page = await pageService.getPageByRoute("home");

  const cleanHeading = page?.heading ? page.heading.replace(/<[^>]*>/g, "").trim() : "";
  const title =
    page?.metaTitle?.trim() ||
    (cleanHeading ? `${cleanHeading} | Bytecode IT Solutions` : "Bytecode IT Solutions");
  const description = page?.metaDescription?.trim() || page?.subheading?.trim() || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

async function HomeHero() {
  const page = await pageService.getPageByRoute("home");

  if (!page?.heading && !page?.subheading) {
    return null;
  }

  const headingClassName = "max-w-[52rem] text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4 text-left sm:px-6 sm:pt-12 lg:px-8">
      {page.heading && (
        page.heading.includes("<") ? (
          <h1
            className={headingClassName}
            dangerouslySetInnerHTML={{ __html: formatHeadingHtml(page.heading) }}
          />
        ) : (
          <h1 className={headingClassName}>{page.heading}</h1>
        )
      )}
      {page.subheading && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
          {page.subheading}
        </p>
      )}
    </section>
  );
}

async function HomeCustomSection() {
  const page = await pageService.getPageByRoute("home");
  if (!page?.content) return null;

  return (
    <section className="w-full">
      <CustomPageContent content={page.content} />
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

        {/* Custom HTML/CSS/JS Content if configured */}
        <Suspense fallback={null}>
          <HomeCustomSection />
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
