"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useEnquiry } from "@/context/enquiry-context";
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
  const { isOpen, setIsOpen, closeEnquiry, mode: contextMode } = useEnquiry();

  const enquiryMode: EnquiryMode =
    contextMode ?? mode ?? (pathname.startsWith("/development") ? "message" : "course");
  const form = useEnquiryForm(isOpen, closeEnquiry, enquiryMode);

  const handleClick = () => {
    if (!isOpen) {
      form.reset();
      setIsOpen(true);
    } else {
      form.submit();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isOpen && (form.isSubmitting || form.isSubmitted)}
        aria-label={isOpen ? "Submit enquiry" : "Enquire now"}
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 z-50 md:hidden flex items-center justify-center rounded-full bg-[#F58216] text-white shadow-xl transition-all duration-300 ease-out hover:bg-[#DE5426] active:bg-[#c7451a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58216] focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
          isOpen
            ? "h-13 sm:h-14 px-5 sm:px-6 gap-2 shadow-2xl scale-100 animate-none"
            : "size-14 animate-bounce hover:scale-105 active:scale-95"
        }`}
      >
        {isOpen ? (
          form.isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <span className="text-sm font-semibold whitespace-nowrap">Submitting...</span>
            </>
          ) : form.isSubmitted ? (
            <>
              <CheckCircle2 className="size-5" aria-hidden="true" />
              <span className="text-sm font-semibold whitespace-nowrap">Submitted!</span>
            </>
          ) : form.step === "otp" ? (
            <>
              <CheckCircle2 className="size-4.5" aria-hidden="true" />
              <span className="text-sm font-semibold whitespace-nowrap">Verify & Submit</span>
            </>
          ) : (
            <>
              <Send className="size-4.5" aria-hidden="true" />
              <span className="text-sm font-semibold whitespace-nowrap">Submit</span>
            </>
          )
        ) : (
          <MessageCircle className="size-7" aria-hidden="true" />
        )}
      </button>
      <EnquiryModal isOpen={isOpen} onClose={closeEnquiry} form={form} />
    </>
  );
}
