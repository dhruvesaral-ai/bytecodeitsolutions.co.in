import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquireNow from "@/components/enquire-now";
import { projectService } from "@/services/ProjectService";

async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await projectService.getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/development"
        className="text-sm font-medium text-[#1550A5] hover:underline"
      >
        Back to development
      </Link>

      <article className="mt-6">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          {project.videoUrl ? (
            <video
              className="h-full w-full object-cover"
              src={project.videoUrl}
              poster={project.imgUrl}
              controls
              muted
              loop
              playsInline
              preload="metadata"
            >
              Your browser does not support embedded videos.
            </video>
          ) : (
            <Image
              src={project.imgUrl}
              alt={project.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {project.name}
        </h1>

        {project.shortDescription && (
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
            {project.shortDescription}
          </p>
        )}

        {project.longDescription && (
          <p className="mt-6 whitespace-pre-line leading-7 text-neutral-700 dark:text-neutral-300">
            {project.longDescription}
          </p>
        )}
      </article>
    </main>
  );
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Suspense
        fallback={
          <main
            className="mx-auto min-h-[60vh] w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8"
            aria-busy="true"
          />
        }
      >
        <ProjectDetails params={params} />
      </Suspense>
      <EnquireNow />
    </div>
  );
}
