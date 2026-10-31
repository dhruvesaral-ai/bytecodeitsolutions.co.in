import { formatHeadingHtml } from "@/lib/format-heading";
import ProjectsShowcase from "@/components/projects-showcase";
import DevelopmentProcess from "@/components/development-process";
import type { Project } from "@/services/ProjectService";

interface DevelopmentProps {
  heading: string;
  subheading: string;
  videoUrl?: string | null;
  projects: Project[];
}

export default function Development({
  heading,
  subheading,
  videoUrl,
  projects,
}: DevelopmentProps) {
  const hasVideo = Boolean(videoUrl);

  return (
    <div className="w-full flex-1">
      {/* Hero Section with Video Background (Matching Homepage Hero) */}
      <section
        className={`relative overflow-hidden w-full text-center ${
          hasVideo
            ? "min-h-[380px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center py-16 sm:py-20 md:py-24 bg-neutral-950"
            : "pt-8 sm:pt-12 pb-4 max-w-4xl mx-auto"
        } px-4 sm:px-6 lg:px-8`}
      >
        {hasVideo && videoUrl && (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              src={videoUrl}
            />
            {/* Light contrast overlay so video is sharp, vibrant, and clearly visible */}
            <div
              className="pointer-events-none absolute inset-0 bg-black/25 dark:bg-black/35"
              aria-hidden="true"
            />
            {/* Subtle edge fade to blend naturally into adjacent content */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/30 dark:via-transparent dark:to-neutral-950/40"
              aria-hidden="true"
            />
          </>
        )}

        <div className="relative z-10 max-w-4xl mx-auto">
          {heading && (
            heading.includes("<") ? (
              <h1
                className={`text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${
                  hasVideo ? "text-white drop-shadow-md" : "text-neutral-900 dark:text-white"
                }`}
                dangerouslySetInnerHTML={{ __html: formatHeadingHtml(heading) }}
              />
            ) : (
              <h1
                className={`text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${
                  hasVideo ? "text-white drop-shadow-md" : "text-neutral-900 dark:text-white"
                }`}
              >
                {heading}
              </h1>
            )
          )}
          {subheading && (
            <p
              className={`mt-4 text-base sm:text-lg ${
                hasVideo
                  ? "text-neutral-100 font-medium drop-shadow"
                  : "text-neutral-600 dark:text-neutral-400"
              } max-w-2xl mx-auto leading-relaxed`}
            >
              {subheading}
            </p>
          )}
        </div>
      </section>

      {/* Projects Showcase Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F58216] mb-2">
            Selected Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Projects We&apos;ve Engineered
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
            Explore web applications, mobile platforms, and enterprise solutions we&apos;ve engineered for high-growth businesses.
          </p>
        </div>
        <ProjectsShowcase projects={projects} />
      </section>
      <DevelopmentProcess />
    </div>
  );
}
