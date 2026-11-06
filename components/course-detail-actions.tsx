"use client";

import { useState } from "react";
import { X } from "lucide-react";
import EnquireNow from "@/components/enquire-now";
import { useEnquiry } from "@/context/enquiry-context";
import type { Course } from "@/services/CourseService";

interface CourseDetailActionsProps {
  bookingAmount: Course["bookingAmount"];
  installmentPlans: Course["installmentPlans"];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPlan(
  installments: Course["installmentPlans"][number]["installments"]
): string {
  const amounts = new Map<number, number>();
  for (const installment of installments) {
    amounts.set(
      installment.amount,
      (amounts.get(installment.amount) ?? 0) + 1
    );
  }

  return [...amounts.entries()]
    .map(([amount, count]) =>
      count > 1
        ? `${formatCurrency(amount)} × ${count}`
        : formatCurrency(amount)
    )
    .join(" + ");
}

export default function CourseDetailActions({
  bookingAmount,
  installmentPlans,
}: CourseDetailActionsProps) {
  const { openEnquiry } = useEnquiry();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const activePlans = installmentPlans.filter(
    (plan) => plan.isActive && plan.installments.length > 0
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    activePlans[0]?.id ?? ""
  );

  return (
    <>
      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 bg-[#1550A5] px-4 py-2">
        <button
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="w-1/2 rounded-md bg-[#F58216] py-2.5 font-bold"
        >
          Book Now
        </button>
        <button
          type="button"
          onClick={() => openEnquiry("course")}
          className="w-1/2 rounded-md bg-green-500 py-2.5 text-white"
        >
          Request Callback
        </button>
      </div>
      {isBookingOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close booking options"
            onClick={() => setIsBookingOpen(false)}
            className="absolute inset-0 cursor-default"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl dark:bg-neutral-900 sm:rounded-2xl"
          >
            <header className="flex items-start justify-between border-b border-neutral-200 p-5 dark:border-neutral-800">
              <div>
                <h2
                  id="booking-modal-title"
                  className="text-xl font-semibold text-neutral-900 dark:text-white"
                >
                  Choose an installment plan
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Select a payment option for this course.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close booking options"
                onClick={() => setIsBookingOpen(false)}
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {activePlans.length > 0 ? (
                activePlans.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    aria-pressed={selectedPlanId === plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex w-full cursor-pointer items-start rounded-xl border p-4 text-left transition-colors ${
                      selectedPlanId === plan.id
                        ? "border-[#F58216] bg-[#F58216]/10 ring-1 ring-[#F58216]"
                        : "border-neutral-200 hover:border-[#F58216]/60 dark:border-neutral-700"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold ${
                          selectedPlanId === plan.id
                            ? "text-[#C45A00]"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {formatPlan(plan.installments)}
                      </span>
                      <span
                        className={`mt-1 block text-xs ${
                          selectedPlanId === plan.id
                            ? "text-[#C45A00]/80"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {plan.installments.length}{" "}
                        {plan.installments.length === 1
                          ? "installment"
                          : "installments"}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="rounded-xl border border-neutral-200 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                  Installment plans are not available for this course.
                </p>
              )}
            </div>

            <footer className="flex items-center justify-between gap-4 border-t border-neutral-200 p-5 dark:border-neutral-800">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Booking amount
                </p>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                  {bookingAmount === null
                    ? "Not available"
                    : formatCurrency(bookingAmount)}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md bg-[#1550A5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#124288]"
              >
                Proceed to pay
              </button>
            </footer>
          </section>
        </div>
      )}
      <EnquireNow showButton={false} />
    </>
  );
}
