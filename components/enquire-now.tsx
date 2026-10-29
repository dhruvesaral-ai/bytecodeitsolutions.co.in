"use client";

import { Suspense, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, MessageCircle, Phone } from "lucide-react";
import { useSettings } from "@/context/setting-context";
import EnquiryModal, {
  useEnquiryForm,
  type EnquiryMode,
} from "@/components/enquiry-modal";

interface EnquireNowProps {
  /** Overrides the enquiry mode inferred from the route. */
  mode?: EnquiryMode;
}

export default function EnquireNow({ mode }: EnquireNowProps) {
  // usePathname() is runtime-only, so the bar must stream in behind Suspense
  // to avoid blocking prerendering of the routes that render it.
  return (
    <Suspense fallback={null}>
      <EnquireNowBar mode={mode} />
    </Suspense>
  );
}

function EnquireNowBar({ mode }: EnquireNowProps) {
  const { cleanWhatsappNumber, phoneNumbers } = useSettings();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeEnquiry = useCallback(() => setIsOpen(false), []);
  // Development pages collect a project brief instead of a course choice.
  const enquiryMode: EnquiryMode =
    mode ?? (pathname.startsWith("/development") ? "message" : "course");
  const form = useEnquiryForm(isOpen, closeEnquiry, enquiryMode);
  const primaryPhone = phoneNumbers[0] ? phoneNumbers[0].replace(/\D/g, "") : "";

  // Closed: opens the sheet behind this action bar. Open: submits the form.
  const handleEnquire = () => {
    if (isOpen) {
      form.submit();
      return;
    }
    form.reset();
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
      <button
        type="button"
        onClick={handleEnquire}
        disabled={form.isSubmitting}
        className="md:hidden flex whitespace-nowrap items-center gap-2 rounded-full bg-[#F97316] px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-[#EA580C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        {form.isSubmitting && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {form.isSubmitting
          ? "Submitting..."
          : isOpen
            ? "Submit Enquiry"
            : "Enquire Now"}
      </button>
      <a
        href={cleanWhatsappNumber ? `https://wa.me/${cleanWhatsappNumber}` : "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1da851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        <Phone
          className="absolute size-2.5"
          strokeWidth={3}
          aria-hidden="true"
        />
      </a>
      <a
        href={primaryPhone ? `tel:+${primaryPhone}` : "#"}
        aria-label="Call us"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        <Phone className="size-5" aria-hidden="true" />
      </a>
      <EnquiryModal isOpen={isOpen} onClose={closeEnquiry} form={form} />
    </div>
  );
}
