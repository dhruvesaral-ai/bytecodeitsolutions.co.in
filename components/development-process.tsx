"use client";

import React from "react";
import {
  ClipboardCheck,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck as ShieldCheckIcon,
} from "lucide-react";
import { useEnquiry } from "@/context/enquiry-context";

interface ProcessStep {
  number: string;
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: React.ComponentType<{ className?: string }>;
  isFeatured?: boolean;
  featuredBadge?: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    phase: "Discovery & Strategy",
    title: "Requirement Gathering",
    description:
      "We dive deep into your business objectives, target audience, workflows, and technical constraints to formulate a crystal-clear Scope of Work, timeline, and architectural plan.",
    deliverables: [
      "Detailed Scope of Work (SOW)",
      "Tech Stack & Architecture Plan",
      "Milestone-Driven Timelines",
    ],
    icon: ClipboardCheck,
  },
  {
    number: "02",
    phase: "UI/UX & Prototyping",
    title: "UI/UX Design",
    description:
      "We craft intuitive, accessible, and high-converting interfaces in Figma with interactive wireframes, custom design systems, and responsive user flows tailored to your brand.",
    deliverables: [
      "User Flows & Wireframing",
      "Clickable Figma Prototype",
      "Component Design System",
    ],
    icon: Palette,
  },
  {
    number: "03",
    phase: "Agile Engineering",
    title: "Full-Stack Development",
    description:
      "Writing modular, production-grade code using scalable modern architectures (Next.js, Node, React Native, AI APIs) with regular sprint reviews and version control.",
    deliverables: [
      "Clean Modular Codebase",
      "Scalable REST / GraphQL APIs",
      "Weekly Sprint Demonstrations",
    ],
    icon: Code2,
  },
  {
    number: "04",
    phase: "Quality Assurance",
    title: "Rigorous QA & Security",
    description:
      "Every module undergoes comprehensive manual and automated testing across devices, cross-browser compatibility, load performance benchmarks, and security audits.",
    deliverables: [
      "Functional & Regression Testing",
      "Cross-Device & Browser Audits",
      "Security Audits & Speed Tuning",
    ],
    icon: ShieldCheck,
  },
  {
    number: "05",
    phase: "Cloud Release",
    title: "Production Deployment",
    description:
      "Automating deployment with continuous integration pipelines (CI/CD), domain mapping, SSL certificates, cloud server configuration, and zero-downtime release.",
    deliverables: [
      "Automated CI/CD Pipelines",
      "Cloud Infrastructure Setup",
      "Live Production Go-Live",
    ],
    icon: Rocket,
  },
  {
    number: "06",
    phase: "Post-Launch Warranty",
    title: "2 Months Free Maintenance",
    description:
      "We stand behind our code. After your project goes live, you receive 60 days of completely free, dedicated maintenance, real-time monitoring, bug fixes, and SLA support.",
    deliverables: [
      "60 Days 100% Free Warranty",
      "Rapid-Response Bug Fixes",
      "Performance & Uptime Monitoring",
    ],
    icon: Sparkles,
    isFeatured: true,
    featuredBadge: "60 Days 100% Free",
  },
];

export default function DevelopmentProcess() {
  const { openEnquiry } = useEnquiry();

  return (
    <section
      aria-labelledby="development-process-heading"
      className="relative w-full py-16 sm:py-24 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-950/60 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-14 sm:mb-18">
          <h2
            id="development-process-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
          >
            How We Approach{" "}
            <span className="text-[#1550A5] dark:text-blue-400">Every Project</span>
          </h2>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROCESS_STEPS.map((step) => {
            const IconComponent = step.icon;

            return (
              <div
                key={step.number}
                className={`group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-300 ${
                  step.isFeatured
                    ? "bg-white dark:bg-neutral-900 border-2 border-[#F58216] shadow-xl shadow-[#F58216]/10 ring-1 ring-[#F58216]/30 hover:shadow-2xl hover:shadow-[#F58216]/20"
                    : "bg-white dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-[#1550A5]/40 dark:hover:border-blue-500/40"
                }`}
              >
                {/* Header row of card */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    {/* Icon */}
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl transition-colors ${
                        step.isFeatured
                          ? "bg-[#F58216] text-white shadow-md shadow-[#F58216]/30"
                          : "bg-[#1550A5]/10 text-[#1550A5] dark:bg-blue-500/15 dark:text-blue-300 group-hover:bg-[#1550A5] group-hover:text-white dark:group-hover:bg-blue-600"
                      }`}
                    >
                      <IconComponent className="size-6" />
                    </div>

                    {/* Step Number & Featured Badge */}
                    <div className="flex items-center gap-2">
                      {step.featuredBadge && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F58216]/15 border border-[#F58216]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#F58216]">
                          <Sparkles className="size-3" />
                          <span>{step.featuredBadge}</span>
                        </span>
                      )}
                      <span className="text-2xl font-black tracking-tight text-neutral-300 dark:text-neutral-700">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Phase Eyebrow */}
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#1550A5] dark:text-blue-400 mb-1">
                    {step.phase}
                  </p>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5">
                    Key Deliverables
                  </p>
                  <ul className="space-y-1.5">
                    {step.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-200"
                      >
                        <CheckCircle2
                          className={`size-3.5 shrink-0 ${
                            step.isFeatured
                              ? "text-[#F58216]"
                              : "text-[#1550A5] dark:text-blue-400"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card Banner */}
        <div className="mt-14 sm:mt-18 rounded-2xl bg-gradient-to-r from-[#1550A5] to-[#0D3877] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-[#F58216]/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white border border-white/20 mb-3">
                <Sparkles className="size-3.5 text-amber-300" />
                <span>Zero-Risk Guarantee • 2 Months Free Maintenance</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Have a Project in Mind? Let&apos;s Build It Together.
              </h3>
              <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Share your requirements with our technical architect. We&apos;ll provide a
                detailed roadmap, architecture breakdown, and free initial consultation.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => openEnquiry("message")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F58216] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl transition-all duration-200 hover:bg-[#DE5426] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

