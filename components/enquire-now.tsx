"use client";

import { Suspense, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import EnquiryModal, {
  useEnquiryForm,
  type EnquiryMode,
} from "@/components/enquiry-modal";

interface EnquireNowProps {
  mode?: EnquiryMode;
}

export default function EnquireNow({ mode }: EnquireNowProps) {
 return (
    <Suspense fallback={null}>
      <EnquireNowFab mode={mode} />
    </Suspense>
  );
}

function EnquireNowFab({ mode }: EnquireNowProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeEnquiry = useCallback(() => setIsOpen(false), []);
  
  const enquiryMode: EnquiryMode =
    mode ?? (pathname.startsWith("/development") ? "message" : "course");
  const form = useEnquiryForm(isOpen, closeEnquiry, enquiryMode);

  const handleToggle = () => {
    if (isOpen) {
      closeEnquiry();
      return;
    }
    form.reset();
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Enquire now"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 flex size-14 animate-bounce items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg transition-colors hover:bg-[#EA580C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 cursor-pointer"
      >
        <MessageCircle className="size-7" aria-hidden="true" />
      </button>
      <EnquiryModal isOpen={isOpen} onClose={closeEnquiry} form={form} />
    </>
  );
}
