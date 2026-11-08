"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { clearPaymentResult, readPaymentResult, type PaymentResult } from "@/lib/auth-flow";

const REDIRECT_SECONDS = 5;

export default function PaymentStatusScreen() {
  const router = useRouter();
  const [result, setResult] = useState<PaymentResult | null | undefined>(
    undefined
  );
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    setResult(readPaymentResult());
  }, []);

  useEffect(() => {
    if (!result) return;

    if (secondsLeft <= 0) {
      clearPaymentResult();
      router.replace("/profile");
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((previous) => previous - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [result, router, secondsLeft]);

  const goToProfile = () => {
    clearPaymentResult();
    router.replace("/profile");
  };

  if (result === undefined) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <Loader2 className="size-6 animate-spin text-[#1550A5]" />
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          No payment to show
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Completed payments appear here right after checkout.
        </p>
        <Link
          href="/profile"
          className="mt-6 rounded-lg bg-[#1550A5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#124288]"
        >
          Go to profile
        </Link>
      </main>
    );
  }

  const succeeded = result.status === "success";

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4 py-16">
      <section className="w-full rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${
            succeeded
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          {succeeded ? (
            <CheckCircle2 className="size-7" />
          ) : (
            <XCircle className="size-7" />
          )}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-white">
          {succeeded ? "Payment successful" : "Payment failed"}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {result.message}
        </p>

        <dl className="mt-6 space-y-2 rounded-xl bg-neutral-50 p-4 text-left text-sm dark:bg-neutral-800/60">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">Course</dt>
            <dd className="text-right font-medium text-neutral-900 dark:text-white">
              {result.courseName}
            </dd>
          </div>
          {result.registrationNo && (
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Registration</dt>
              <dd className="font-mono text-neutral-900 dark:text-white">
                {result.registrationNo}
              </dd>
            </div>
          )}
          {result.amountLabel && (
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Amount</dt>
              <dd className="font-semibold text-neutral-900 dark:text-white">
                {result.amountLabel}
              </dd>
            </div>
          )}
          {result.paymentId && (
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Payment ID</dt>
              <dd className="max-w-[14rem] truncate font-mono text-xs text-neutral-900 dark:text-white">
                {result.paymentId}
              </dd>
            </div>
          )}
        </dl>

        <p className="mt-5 text-xs text-neutral-500">
          Redirecting to your profile in {secondsLeft}s
        </p>
        <button
          type="button"
          onClick={goToProfile}
          className="mt-4 h-11 w-full cursor-pointer rounded-lg bg-[#1550A5] text-sm font-semibold text-white hover:bg-[#124288]"
        >
          Go to profile
        </button>
      </section>
    </main>
  );
}
