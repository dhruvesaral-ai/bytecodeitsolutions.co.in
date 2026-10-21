import { MessageCircle, Phone } from "lucide-react";
import settings from "@/setting.json";

export default function EnquireNow() {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
      <button
        type="button"
        className="whitespace-nowrap rounded-full bg-[#1550A5] px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-[#0f3a7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] focus-visible:ring-offset-2"
      >
        Enquire Now
      </button>
      <a
        href={`https://wa.me/${settings.whatsapp_no}`}
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
        href={`tel:+${settings.phone_numbers[0]}`}
        aria-label="Call us"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        <Phone className="size-5" aria-hidden="true" />
      </a>
    </div>
  );
}