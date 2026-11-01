import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageService, PageData } from "@/services/PageService";
import { projectService } from "@/services/ProjectService";
import EnquireNow from "@/components/enquire-now";
import Development from "@/components/pages/development";
import Training from "@/components/pages/training";
import CustomPageContent from "@/components/custom-page-content";
import { formatHeadingHtml } from "@/lib/format-heading";

interface PageProps {
  params: Promise<{ "route-name": string }>;
}

async function resolvePage(routeName: string): Promise<PageData | null> {
  let page = await pageService.getPageByRoute(routeName);

  // Fallback between training and trainings routes if needed
  if (!page && (routeName.toLowerCase() === "training" || routeName.toLowerCase() === "trainings")) {
    page = await pageService.getPageByRoute(
      routeName.toLowerCase() === "training" ? "trainings" : "training"
    );
  }

  return page;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { "route-name": routeName } = await params;
  const page = await resolvePage(routeName);

  if (!page) {
    return {
      title: "Page Not Found | Bytecode IT Solutions",
    };
  }

  const cleanHeading = page.heading ? page.heading.replace(/<[^>]*>/g, "").trim() : "";
  const title =
    page.metaTitle?.trim() ||
    (cleanHeading ? `${cleanHeading} | Bytecode IT Solutions` : "Bytecode IT Solutions");
  const description = page.metaDescription?.trim() || page.subheading?.trim() || undefined;

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

async function DynamicPageContent({ props }: { props: PageProps }) {
  const { "route-name": routeName } = await props.params;
  const page = await resolvePage(routeName);

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
          content={page.content}
        />
      ) : routeName.toLowerCase() === "training" || routeName.toLowerCase() === "trainings" ? (
        <Training
          heading={page.heading}
          subheading={page.subheading}
          gallery={page.gallery}
          content={page.content}
        />
      ) : (
        <div className="w-full">
          {(page.heading || page.subheading) && (
            <div className="px-4 sm:px-6 max-w-7xl mx-auto lg:px-8 py-16">
              {page.heading && (
                page.heading.includes("<") ? (
                  <h1
                    className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
                    dangerouslySetInnerHTML={{ __html: formatHeadingHtml(page.heading) }}
                  />
                ) : (
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                    {page.heading}
                  </h1>
                )
              )}
              {page.subheading && (
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
                  {page.subheading}
                </p>
              )}
            </div>
          )}

          {page.content && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <CustomPageContent content={page.content} />
            </div>
          )}
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
