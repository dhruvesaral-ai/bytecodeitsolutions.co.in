import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/services/ProjectService";

interface ProjectsShowcaseProps {
  projects: Project[];
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="projects-heading" className="mt-16">
      <h2
        id="projects-heading"
        className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
      >
        Our Projects
      </h2>

      <ul className="mt-8 space-y-12 sm:mt-10 sm:space-y-16">
        {projects.map((project, index) => {
          // Alternate the media side so consecutive projects mirror each other
          const mediaOnRight = index % 2 === 1;

          return (
            <li
              key={project.id}
              className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <div
                className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 ${
                  mediaOnRight ? "lg:order-2" : "lg:order-1"
                }`}
              >
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div className={mediaOnRight ? "lg:order-1" : "lg:order-2"}>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                  {project.name}
                </h3>
                {project.shortDescription && (
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                    {project.shortDescription}
                  </p>
                )}
                <Link
                  href={`/development/projects/${project.id}`}
                  className="mt-6 inline-flex items-center rounded-md bg-[#1550A5] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] focus-visible:ring-offset-2 cursor-pointer"
                >
                  Know more
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
