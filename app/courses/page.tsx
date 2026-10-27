import { Suspense } from "react";
import type { Metadata } from "next";
import EnquireNow from "@/components/enquire-now";
import CoursesExplorer from "@/components/courses-explorer";
import CourseAdvisoryCard from "@/components/course-advisory-card";
import { courseService } from "@/services/CourseService";
import { pageService } from "@/services/PageService";
import { formatHeadingHtml } from "@/lib/format-heading";

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
      <CourseAdvisoryCard />
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
    </div>
  );
}
