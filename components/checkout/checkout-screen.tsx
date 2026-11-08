"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  clearCheckoutIntent,
  readCheckoutIntent,
  savePaymentResult,
  type CheckoutIntent,
} from "@/lib/auth-flow";
import { createBookingOrder } from "@/services/RegistrationService";

interface RazorpayPaymentFailedResponse {
  error?: {
    description?: string;
  };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    registrationId: string;
    registrationNo: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayCheckout {
  open(): void;
  on(
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailedResponse) => void
  ): void;
}

interface RazorpayConstructor {
  new (options: RazorpayCheckoutOptions): RazorpayCheckout;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { accessToken, isAuthenticated, isLoading, user } = useAuth();
  const [intent, setIntent] = useState<CheckoutIntent | null | undefined>(
    undefined
  );
  const [isGatewayReady, setIsGatewayReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const settledRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?next=/checkout");
      return;
    }
    setIntent(readCheckoutIntent());
  }, [isAuthenticated, isLoading, router]);

  const startPayment = async () => {
    if (!intent || !accessToken || isPaying) return;
    if (!window.Razorpay) {
      setErrorMessage("Payment gateway is still loading. Please try again.");
      return;
    }

    setIsPaying(true);
    setErrorMessage("");
    settledRef.current = false;

    try {
      const order = await createBookingOrder(intent.courseId, accessToken);
      const contact = user?.username
        ?.replace(/\D/g, "")
        .replace(/^91(?=\d{10}$)/, "");
      const amountLabel =
        intent.bookingAmount === null
          ? ""
          : formatCurrency(intent.bookingAmount);

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Bytecode IT Solutions",
        description: order.courseName || intent.courseName,
        prefill: {
          ...(user?.profile?.name ? { name: user.profile.name } : {}),
          ...(user?.profile?.email ? { email: user.profile.email } : {}),
          ...(contact ? { contact } : {}),
        },
        notes: {
          registrationId: order.registrationId,
          registrationNo: order.registrationNo,
        },
        theme: { color: "#1550A5" },
        modal: {
          ondismiss: () => {
            if (settledRef.current) return;
            setIsPaying(false);
            setErrorMessage("Payment window closed. You can try again.");
          },
        },
        handler: (response) => {
          if (settledRef.current) return;
          settledRef.current = true;
          clearCheckoutIntent();
          savePaymentResult({
            status: "success",
            courseName: order.courseName || intent.courseName,
            registrationNo: order.registrationNo,
            amountLabel,
            message: "Your booking payment was received.",
            paymentId: response.razorpay_payment_id,
          });
          router.replace("/payment-status");
        },
      });

      checkout.on("payment.failed", (payment) => {
        if (settledRef.current) return;
        settledRef.current = true;
        clearCheckoutIntent();
        savePaymentResult({
          status: "failed",
          courseName: order.courseName || intent.courseName,
          registrationNo: order.registrationNo,
          amountLabel,
          message:
            payment.error?.description ||
            "Payment could not be completed. Please try again from your course.",
        });
        router.replace("/payment-status");
      });

      checkout.open();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again."
      );
      setIsPaying(false);
    }
  };

  if (isLoading || !isAuthenticated || intent === undefined) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="size-6 animate-spin text-[#1550A5]" />
          <p className="text-sm font-medium">Preparing checkout...</p>
        </div>
      </main>
    );
  }

  if (!intent) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          No booking in progress
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Choose a course and installment plan before opening checkout.
        </p>
        <Link
          href="/courses"
          className="mt-6 rounded-lg bg-[#1550A5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#124288]"
        >
          Browse courses
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-12">
      <Script
        id="razorpay-checkout"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setIsGatewayReady(true)}
        onError={() => {
          setIsGatewayReady(false);
          setErrorMessage(
            "Unable to load the payment gateway. Refresh the page and try again."
          );
        }}
      />
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-[#1550A5]/10 text-[#1550A5]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Checkout
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Confirm your booking, then pay securely with Razorpay.
            </p>
          </div>
        </div>

        <dl className="space-y-3 rounded-xl bg-neutral-50 p-4 text-sm dark:bg-neutral-800/60">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-neutral-500">Course</dt>
            <dd className="text-right font-semibold text-neutral-900 dark:text-white">
              {intent.courseName}
            </dd>
          </div>
          {intent.planLabel && (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-neutral-500">Plan</dt>
              <dd className="text-right font-medium text-neutral-900 dark:text-white">
                {intent.planLabel}
              </dd>
            </div>
          )}
          <div className="flex items-start justify-between gap-4 border-t border-neutral-200 pt-3 dark:border-neutral-700">
            <dt className="text-neutral-500">Booking amount</dt>
            <dd className="font-semibold text-neutral-900 dark:text-white">
              {intent.bookingAmount === null
                ? "Not available"
                : formatCurrency(intent.bookingAmount)}
            </dd>
          </div>
        </dl>

        {errorMessage && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => void startPayment()}
          disabled={!isGatewayReady || isPaying}
          className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1550A5] text-sm font-semibold text-white hover:bg-[#124288] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {(isPaying || !isGatewayReady) && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {isPaying
            ? "Opening payment..."
            : isGatewayReady
              ? "Pay now"
              : "Loading payment gateway..."}
        </button>
      </section>
    </main>
  );
}
