"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Phone } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { savePendingMobile } from "@/lib/auth-flow";

export default function LoginScreen({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, sendOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isLoading, nextPath, router]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
    setErrorMessage("");
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isAuthenticated || phone.length !== 10 || submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const response = await sendOtp(phone);
      if (!response.success) {
        setErrorMessage(response.error || "Failed to send OTP. Please try again.");
        return;
      }
      savePendingMobile(phone);
      router.push(`/verify-otp?next=${encodeURIComponent(nextPath)}`);
    } catch {
      setErrorMessage("Unable to send OTP at this time. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <Loader2 className="size-6 animate-spin text-[#1550A5]" />
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#1550A5]/10 text-[#1550A5] dark:bg-blue-400/10 dark:text-blue-400">
            <Phone className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Enter your mobile number. We will send a 4-digit verification code.
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-phone"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Mobile Number
            </label>
            <div className="flex h-11 w-full rounded-lg border border-neutral-300 bg-white focus-within:border-[#1550A5] focus-within:ring-2 focus-within:ring-[#1550A5]/20 dark:border-neutral-700 dark:bg-neutral-900">
              <span className="flex items-center justify-center border-r border-neutral-200 bg-neutral-50 px-3.5 text-xs font-semibold text-neutral-600 select-none dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
                +91
              </span>
              <input
                id="login-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit number"
                autoFocus
                className="w-full bg-transparent px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={phone.length !== 10 || submitting}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550A5] text-sm font-semibold text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </main>
  );
}
