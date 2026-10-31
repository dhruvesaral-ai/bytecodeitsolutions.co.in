"use client";

import React from "react";
import { formatHeadingHtml } from "@/lib/format-heading";
import TrainingGallery from "@/components/training-gallery";
import { useEnquiry } from "@/context/enquiry-context";
import {
  GraduationCap,
  Users,
  Award,
  Layers,
  ArrowRight,
  Camera,
  Sparkles,
} from "lucide-react";

interface TrainingProps {
  heading: string;
  subheading: string;
  gallery?: string[];
}

export default function Training({ heading, subheading, gallery = [] }: TrainingProps) {
  const { openEnquiry } = useEnquiry();

  const stats = [
    { label: "Colleges Reached", value: "100+", icon: GraduationCap },
    { label: "Students Trained", value: "20,000+", icon: Users },
    { label: "Workshops Conducted", value: "500+", icon: Layers },
    { label: "Hands-on Practical Training", value: "100%", icon: Award },
  ];

  return (
    <div className="w-full flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full text-center pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F58216]/10 border border-[#F58216]/25 text-[#F58216] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="size-3.5" />
            <span>Campus & Technical Trainings</span>
          </div>

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

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center p-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#1550A5]/10 text-[#1550A5] dark:bg-blue-500/15 dark:text-blue-300 mb-2">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1550A5] dark:text-blue-400 mb-2">
              Visual Highlights
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Campus Drives & Workshop Moments
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
              Photographs from our live classroom sessions, coding bootcamps, and technical seminars across universities.
            </p>
          </div>

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
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => openEnquiry("message")}
                  className="inline-flex items-center gap-2 rounded-none bg-[#F58216] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl transition-all duration-200 hover:bg-[#DE5426] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <span>Invite Us To Your College</span>
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
