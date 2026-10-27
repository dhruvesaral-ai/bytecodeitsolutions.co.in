import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquireNow from "@/components/enquire-now";
import { courseService } from "@/services/CourseService";

function formatCurrency(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

async function CourseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await courseService.getCourseById(id);
  if (!course) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-[#1550A5] hover:underline"
      >
        Back to courses
      </Link>

      <article className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={course.courseImgUrl}
              alt={course.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="mt-8">
            {course.courseCategorie && (
              <p className="text-sm font-medium text-[#1550A5]">
                {course.courseCategorie.name}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              {course.name}
            </h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              {course.shortDescription}
            </p>
            <p className="mt-6 whitespace-pre-line leading-7 text-neutral-700 dark:text-neutral-300">
              {course.longDescription}
            </p>
          </div>

          {course.technologyTags.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Technologies covered
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {course.technologyTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Course fee
          </p>
          <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-white">
            {formatCurrency(course.discountedPrice)}
          </p>
          {course.originalPrice > course.discountedPrice && (
            <p className="mt-1 text-neutral-500 line-through">
              {formatCurrency(course.originalPrice)}
            </p>
          )}

          <dl className="mt-6 space-y-4 border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500 dark:text-neutral-400">Duration</dt>
              <dd className="text-right font-medium text-neutral-900 dark:text-white">
                {course.duration}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500 dark:text-neutral-400">Rating</dt>
              <dd className="text-right font-medium text-neutral-900 dark:text-white">
                {course.rating.toFixed(1)} / 5
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500 dark:text-neutral-400">
                Placement guarantee
              </dt>
              <dd className="text-right font-medium text-neutral-900 dark:text-white">
                {course.isPlacementGurranted ? "Yes" : "No"}
              </dd>
            </div>
          </dl>

          {course.syllabus && (
            <a
              href={course.syllabus}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-[#1550A5] px-4 py-2.5 text-sm font-medium text-[#1550A5] hover:bg-[#1550A5]/5"
            >
              View syllabus
            </a>
          )}
        </aside>
      </article>
    </main>
  );
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Suspense
        fallback={
          <main className="mx-auto min-h-[60vh] w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" />
        }
      >
        <CourseDetails params={params} />
      </Suspense>
      <EnquireNow />
    </div>
  );
}
