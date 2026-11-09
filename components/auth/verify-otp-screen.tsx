"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { clearPendingMobile, readPendingMobile } from "@/lib/auth-flow";

export default function VerifyOtpScreen({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, verifyOtp, resendOtp } = useAuth();
  const [mobile, setMobile] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      clearPendingMobile();
      router.replace(nextPath);
      return;
    }

    const pendingMobile = readPendingMobile();
    if (!pendingMobile) {
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    setMobile(pendingMobile);
    setReady(true);
  }, [isAuthenticated, isLoading, nextPath, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((previous) => previous - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (ready) {
      otpInputsRef.current[0]?.focus();
    }
  }, [ready]);

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const char = cleaned.slice(-1);
    const updated = [...otp];
    updated[index] = char;
    setOtp(updated);
    setErrorMessage("");

    if (char && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const updated = [...otp];
    for (let index = 0; index < pasted.length; index += 1) {
      updated[index] = pasted[index];
    }
    setOtp(updated);
    otpInputsRef.current[Math.min(pasted.length, 3)]?.focus();
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mobile || otp.some((digit) => !digit) || submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const response = await verifyOtp(mobile, otp.join(""));
      if (!response.success || !response.accessToken) {
        setErrorMessage(response.error || "Incorrect OTP. Please try again.");
        return;
      }
      clearPendingMobile();
      router.replace(nextPath);
    } catch {
      setErrorMessage("Failed to verify OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (retrytype: "text" | "voice") => {
    if (!mobile || resendCooldown > 0 || submitting) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const response = await resendOtp(mobile, retrytype);
      if (!response.success) {
        setErrorMessage(response.error || "Failed to resend OTP.");
        return;
      }
      setResendCooldown(30);
    } catch {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || !mobile || isLoading || isAuthenticated) {
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
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Verify OTP
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Enter the 4-digit code sent to +91 {mobile}
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <button
            type="button"
            onClick={() =>
              router.push(`/login?next=${encodeURIComponent(nextPath)}`)
            }
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-[#1550A5] hover:underline dark:text-blue-400"
          >
            <ArrowLeft className="size-3" />
            Edit number
          </button>

          <div className="flex items-center justify-center gap-3 py-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  otpInputsRef.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                onPaste={handleOtpPaste}
                aria-label={`Digit ${index + 1}`}
                className="h-12 w-12 rounded-lg border border-neutral-300 bg-white text-center text-lg font-bold text-neutral-900 focus:border-[#1550A5] focus:outline-none focus:ring-2 focus:ring-[#1550A5]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            ))}
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
            disabled={otp.some((digit) => !digit) || submitting}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550A5] text-sm font-semibold text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="flex items-center justify-between pt-1 text-xs text-neutral-500">
            <span>Didn&apos;t receive the code?</span>
            {resendCooldown > 0 ? (
              <span className="font-medium text-neutral-400">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleResend("text")}
                  className="cursor-pointer font-semibold text-[#1550A5] hover:underline dark:text-blue-400"
                >
                  Resend SMS
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => void handleResend("voice")}
                  className="cursor-pointer font-semibold text-[#1550A5] hover:underline dark:text-blue-400"
                >
                  Call me
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
