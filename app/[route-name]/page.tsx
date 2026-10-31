import { Suspense } from "react";
import { notFound } from "next/navigation";
import { pageService } from "@/services/PageService";
import { projectService } from "@/services/ProjectService";
import EnquireNow from "@/components/enquire-now";
import Development from "@/components/pages/development";
import Training from "@/components/pages/training";
import { formatHeadingHtml } from "@/lib/format-heading";

interface PageProps {
  params: Promise<{ "route-name": string }>;
}

async function DynamicPageContent({ props }: { props: PageProps }) {
  const { "route-name": routeName } = await props.params;
  let page = await pageService.getPageByRoute(routeName);

  // Fallback between training and trainings routes if needed
  if (!page && (routeName.toLowerCase() === "training" || routeName.toLowerCase() === "trainings")) {
    page = await pageService.getPageByRoute(
      routeName.toLowerCase() === "training" ? "trainings" : "training"
    );
  }

  if (!page) {
    notFound();
  }

  // Only the development page showcases the project portfolio
  const projects =
    routeName.toLowerCase() === "development"
      ? await projectService.getProjects()
      : [];

  return (
    <main className="w-full flex-1">
      {routeName.toLowerCase() === "development" ? (
        <Development
          heading={page.heading}
          subheading={page.subheading}
          videoUrl={page.videoUrl}
          projects={projects}
        />
      ) : routeName.toLowerCase() === "training" || routeName.toLowerCase() === "trainings" ? (
        <Training
          heading={page.heading}
          subheading={page.subheading}
          gallery={page.gallery}
        />
      ) : (
        <div className="px-4 sm:px-6 max-w-7xl mx-auto lg:px-8 py-16">
          {page.heading.includes("<") ? (
            <h1
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: formatHeadingHtml(page.heading) }}
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              {page.heading}
            </h1>
          )}
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            {page.subheading}
          </p>
        </div>
      )}
    </main>
  );
}

export default function DynamicRoutePage(props: PageProps) {
  return (
    <>
      <Suspense
        fallback={
          <main
            className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
            aria-busy="true"
          />
        }
      >
        <DynamicPageContent props={props} />
      </Suspense>
      <EnquireNow />
    </>
  );
}
