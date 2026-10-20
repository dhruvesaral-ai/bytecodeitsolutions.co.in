"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import settings from "@/setting.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const formatPhoneNumber = (num: string) => {
    // Format 917984908771 -> +91 79849 08771
    if (num.startsWith("91") && num.length === 12) {
      return `+91 ${num.slice(2, 7)} ${num.slice(7)}`;
    }
    return `+${num}`;
  };

  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Company Info & Logo */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] rounded-md"
              aria-label={settings.company_name}
            >
              <Image
                src="/bytecode-light-theme-logo.png"
                alt={settings.company_name}
                width={180}
                height={60}
                className="h-8 w-auto object-contain dark:hidden"
              />
              <Image
                src="/bytecode-dark-theme-logo.png"
                alt={settings.company_name}
                width={180}
                height={60}
                className="hidden h-8 w-auto object-contain dark:block"
              />
            </Link>

            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Building digital solutions for businesses and developing the next
              generation of tech professionals through practical, industry-focused training.
            </p>

            {/* Direct WhatsApp Action */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp_no}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#1550A5] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
              >
                <MessageSquare className="size-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Solutions & Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
              Solutions & Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/development"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link
                  href="/development"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Web & Mobile Applications
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  College Technical Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Corporate Upskilling Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Programs */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
              Programs & Training
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/trainings"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Full Stack Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="/trainings"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Software Engineering (Java + AI)
                </Link>
              </li>
              <li>
                <Link
                  href="/trainings"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Generative AI & Agentic AI
                </Link>
              </li>
              <li>
                <Link
                  href="/trainings"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link
                  href="/trainings"
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400"
                >
                  Data Analytics & Python
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
              Contact & Location
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-neutral-500 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.company_address}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone className="size-4 shrink-0 text-neutral-500 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  {settings.phone_numbers.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:+${phone}`}
                      className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400 font-mono"
                    >
                      {formatPhoneNumber(phone)}
                    </a>
                  ))}
                </div>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-neutral-500" />
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-[#1550A5] dark:hover:text-blue-400 font-mono"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Clean Links */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <p>© {currentYear} {settings.company_name}. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/development"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Development
            </Link>
            <Link
              href="/trainings"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Trainings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}