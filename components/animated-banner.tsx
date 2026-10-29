"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { useSettings } from "@/context/setting-context";

const BANNER_ITEMS = [
  "🔥 Admission Open — Enroll Now & Secure Your Seat 🔥",
  "🚀 New Batches Starting Soon — Offline & Online 🚀",
  "💼 100% Practical Training & Placement Assistance 💼",
  "⭐ Learn from Industry Experts — Book Your Free Demo Class ⭐",
];

const AnimatedBanner = () => {
  const { cleanWhatsappNumber, phoneNumbers } = useSettings();
  const primaryPhone = phoneNumbers[0] ? phoneNumbers[0].replace(/\D/g, "") : "";
  const whatsappUrl = cleanWhatsappNumber
    ? `https://wa.me/${cleanWhatsappNumber}`
    : "#";
  const telUrl = primaryPhone ? `tel:+${primaryPhone}` : "#";

  // Duplicate items to ensure a completely seamless continuous infinite loop on all screen widths
  const loopItems = [...BANNER_ITEMS, ...BANNER_ITEMS];

  return (
    <div className="w-full bg-[#1550A5] text-white overflow-hidden text-xs sm:text-sm">
      {/* Scoped Keyframes & Animation for guaranteed cross-browser smooth infinite marquee */}
      <style>{`
        @keyframes marqueeBannerTrack {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .marquee-track-banner {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marqueeBannerTrack 28s linear infinite !important;
        }

        .marquee-track-banner:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 sm:px-6">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track-banner flex items-center">
            {loopItems.map((text, idx) => (
              <span
                key={idx}
                className="inline-flex items-center whitespace-nowrap pr-12 font-semibold tracking-wide"
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1da851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4"
          >
            <MessageCircle className="size-3.5 sm:size-4" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href={telUrl}
            aria-label="Call us"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#1550A5] shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4"
          >
            <Phone className="size-3.5 sm:size-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {primaryPhone ? `+${primaryPhone}` : "Call"}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBanner;

