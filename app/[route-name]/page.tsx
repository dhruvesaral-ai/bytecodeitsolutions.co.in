import { Suspense } from "react";
import { notFound } from "next/navigation";
import { pageService } from "@/services/PageService";
import EnquireNow from "@/components/enquire-now";
import Development from "@/components/pages/development";
import Training from "@/components/pages/training";

interface PageProps {
  params: Promise<{ "route-name": string }>;
}

async function DynamicPageContent({ props }: { props: PageProps }) {
  const { "route-name": routeName } = await props.params;
  const page = await pageService.getPageByRoute(routeName);

  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {routeName.toLowerCase() === "development" ? (
        <Development heading={page.heading} subheading={page.subheading} />
      ) : routeName.toLowerCase() === "training" || routeName.toLowerCase() === "trainings" ? (
        <Training heading={page.heading} subheading={page.subheading} />
      ) : (
        <>
          {page.heading.includes("<") ? (
            <h1
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
              dangerouslySetInnerHTML={{ __html: page.heading }}
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              {page.heading}
            </h1>
          )}
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            {page.subheading}
          </p>
        </>
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
