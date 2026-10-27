"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { useSettings } from "@/context/setting-context";

export default function CourseAdvisoryCard() {
  const { getWhatsappUrl, companyName } = useSettings();

  return (
    <section
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-6 sm:p-8 lg:p-10"
      aria-label="Career Consultation"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1550A5] dark:text-blue-400">
            <Sparkles className="size-3.5" />
            Free Career Counseling
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Not sure which tech course fits your career path?
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Schedule a personalized 1-on-1 counseling session with our senior MNC tech leads. We will review your background, evaluate your goals, and help you select the ideal learning track.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <a
            href={getWhatsappUrl("Hi, I would like guidance on choosing the right course")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#20b858] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <MessageCircle className="size-4" />
            Chat on WhatsApp
          </a>

          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
          >
            Learn About {companyName}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
