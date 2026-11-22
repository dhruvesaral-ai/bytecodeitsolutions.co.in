"use client";

import { formatHeadingHtml } from "@/lib/format-heading";
import TrainingGallery from "@/components/training-gallery";
import CustomPageContent from "@/components/custom-page-content";
import { useEnquiry } from "@/context/enquiry-context";
import {
  GraduationCap,
  ArrowRight,
  Camera,
} from "lucide-react";

interface TrainingProps {
  heading: string;
  subheading: string;
  gallery?: string[];
  content?: string | null;
}

export default function Training({
  heading,
  subheading,
  gallery = [],
  content,
}: TrainingProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <div className="w-full flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full text-center py-4 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="max-w-4xl mx-auto">
          {heading && (
            heading.includes("<") ? (
              <h1
                className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
                dangerouslySetInnerHTML={{ __html: formatHeadingHtml(heading) }}
              />
            ) : (
              <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {heading}
              </h1>
            )
          )}

          {subheading && (
            <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {gallery && gallery.length > 0 ? (
            <TrainingGallery images={gallery} />
          ) : (
            <div className="w-full py-16 px-4 text-center rounded-none border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Camera className="size-10 mx-auto text-neutral-400 dark:text-neutral-500 mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                Campus Gallery In Progress
              </h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                Photographs from our college workshops and seminars will appear here once uploaded in the admin panel.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* College Partnership CTA */}
      <section className="w-full pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-none bg-gradient-to-r from-[#1550A5] to-[#0D3877] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white border border-white/20 mb-3">
                <GraduationCap className="size-3.5" />
                <span>College & University Collaborations</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Want to Host a Bytecode Workshop in Your College?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Bring our industry engineers to your campus for hands-on bootcamps, seminars, or placement-focused development cohorts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom HTML/CSS/JS Content if provided by admin */}
      {content && (
        <section className="w-full py-8">
          <CustomPageContent content={content} />
        </section>
      )}

      <div
        data-training-actions
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-[#0D3877] px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-white shadow-[0_-4px_20px_rgba(4,20,44,0.2)] sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 sm:inline-flex">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-semibold leading-tight sm:text-lg">
              Invite Us to Your College
            </h2>
          </div>
          <button
            type="button"
            onClick={() => openEnquiry("message")}
            className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F58216] px-3 text-sm font-bold text-[#04142C] transition-colors hover:bg-[#FFA34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5"
          >
            Enquire Now
            <ArrowRight className="hidden size-4 sm:block" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
