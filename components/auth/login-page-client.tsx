"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import LoginScreen from "@/components/auth/login-screen";
import { safeNextPath } from "@/lib/auth-flow";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next") ?? undefined);
  return <LoginScreen nextPath={nextPath} />;
}

export default function LoginPageClient() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center p-4">
          <Loader2 className="size-6 animate-spin text-[#1550A5]" />
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
