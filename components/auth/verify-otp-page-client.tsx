"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import VerifyOtpScreen from "@/components/auth/verify-otp-screen";
import { safeNextPath } from "@/lib/auth-flow";

function VerifyOtpPageContent() {
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next") ?? undefined);
  return <VerifyOtpScreen nextPath={nextPath} />;
}

export default function VerifyOtpPageClient() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center p-4">
          <Loader2 className="size-6 animate-spin text-[#1550A5]" />
        </main>
      }
    >
      <VerifyOtpPageContent />
    </Suspense>
  );
}
