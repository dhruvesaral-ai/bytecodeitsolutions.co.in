import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import Footer from "@/components/footer";
import EnquireNow from "@/components/enquire-now";
import CoursesExplorer from "@/components/courses-explorer";
import { courseService } from "@/services/CourseService";
import { pageService } from "@/services/PageService";
import { formatHeadingHtml } from "@/lib/format-heading";
import settings from "@/setting.json";

export const metadata: Metadata = {
  title: "AI-Powered Modern Tech Courses with Real MNC Developers | Bytecode IT Solutions",
  description:
    "Master Full Stack Development, Generative AI, Mobile Apps, and Cloud DevOps. Learn directly from engineers at top MNCs with hands-on production projects and placement support.",
};

async function CoursesContent() {
  const [courses, categories] = await Promise.all([
    courseService.getCourses(),
    courseService.getCourseCategories(),
  ]);

  return (
    <div className="space-y-12">
      {/* Interactive Courses Explorer */}
      <CoursesExplorer initialCourses={courses} categories={categories} />

      {/* Advisory & Counseling Call-to-Action */}
      <section
        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-6 sm:p-8 lg:p-10"
        aria-label="Career Consultation"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1550A5] dark:text-blue-400">
              <Sparkles className="size-3.5" />
              Free Career Counseling
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Not sure which tech course fits your career path?
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Schedule a personalized 1-on-1 counseling session with our senior MNC tech leads. We will review your background, evaluate your goals, and help you select the ideal learning track.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${settings.whatsapp_no}?text=Hi%2C%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20course`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#20b858] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
            >
              Learn About Bytecode
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

async function CoursesHero() {
  const pageData = await pageService.getPageByRoute("courses");

  if (!pageData?.heading && !pageData?.subheading) {
    return null;
  }

  return (
    <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 py-5 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {pageData.heading && (
          pageData.heading.includes("<") ? (
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-white max-w-4xl"
              dangerouslySetInnerHTML={{ __html: formatHeadingHtml(pageData.heading) }}
            />
          ) : (
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-white max-w-4xl">
              {pageData.heading}
            </h1>
          )
        )}
        {pageData.subheading && (
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            {pageData.subheading}
          </p>
        )}
      </div>
    </section>
  );
}

function CoursesHeroSkeleton() {
  return (
    <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 py-5 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="h-10 w-2/3 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-5 w-1/2 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    </section>
  );
}

export default function CoursesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        {/* Hero Header Section */}
        <Suspense fallback={<CoursesHeroSkeleton />}>
          <CoursesHero />
        </Suspense>

        {/* Courses Listing Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <Suspense
            fallback={
              <div
                className="min-h-[40vh] flex items-center justify-center text-sm text-neutral-500"
                aria-busy="true"
              >
                Loading courses...
              </div>
            }
          >
            <CoursesContent />
          </Suspense>
        </section>
      </main>

      <EnquireNow />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
