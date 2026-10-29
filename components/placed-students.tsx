import React from "react";
import Image from "next/image";
import { testimonialService, type StudentTestimonial } from "@/services/TestimonialService";

function StudentCard({ student }: { student: StudentTestimonial }) {
  return (
    <div className="flex items-center gap-3 w-64 sm:w-72 p-3 rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm shrink-0 select-none transition-colors hover:border-[#1550A5]/60 dark:hover:border-blue-400/60">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <Image
          src={student.profile_img}
          alt={student.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
          {student.name}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          <span>Placed at </span>
          <span className="font-medium text-[#1550A5] dark:text-blue-400">
            {student.company_name}
          </span>
        </p>
      </div>
    </div>
  );
}

export default async function PlacedStudents() {
  const allStudents = await testimonialService.getTestimonials();

  if (!allStudents || allStudents.length === 0) {
    return null;
  }

  // Split into 2 rows
  const half = Math.ceil(allStudents.length / 2);
  const row1 = allStudents.slice(0, half);
  const row2 = allStudents.slice(half);

  // Duplicate arrays for infinite seamless looping
  const row1Duplicated = [...row1, ...row1];
  const row2Duplicated = row2.length > 0 ? [...row2, ...row2] : row1Duplicated;

  return (
    <section className="relative w-full py-14 overflow-hidden border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/40">
      {/* Background Big Tech Companies Logos */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-2xl h-full flex items-center justify-center opacity-10 dark:opacity-15 dark:invert">
          <Image
            src="/big-tech-companies-logos.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 642px"
          />
        </div>
      </div>

      {/* Scoped Keyframes & Animation Rules */}
      <style>{`
        @keyframes marqueeLtr {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        @keyframes marqueeRtl {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .marquee-track-ltr {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeLtr 25s linear infinite !important;
        }

        .marquee-track-rtl {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeRtl 25s linear infinite !important;
        }

        .marquee-track-ltr:hover,
        .marquee-track-rtl:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Our Placed Students
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Graduates from our programs work at leading software firms, tech giants, and innovative startups.
        </p>
      </div>

      <div className="relative z-10 space-y-4 w-full overflow-hidden">
        {/* Row 1: Animates from Left to Right */}
        <div className="flex w-full overflow-hidden">
          <div className="marquee-track-ltr flex gap-4">
            {row1Duplicated.map((student, idx) => (
              <StudentCard key={`r1-${student.id}-${idx}`} student={student} />
            ))}
          </div>
        </div>

        {/* Row 2: Animates from Right to Left */}
        {row2.length > 0 && (
          <div className="flex w-full overflow-hidden">
            <div className="marquee-track-rtl flex gap-4">
              {row2Duplicated.map((student, idx) => (
                <StudentCard key={`r2-${student.id}-${idx}`} student={student} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
