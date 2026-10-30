"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Send, Loader2, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { courseService, type Course } from "@/services/CourseService";
import { createWebLead } from "@/services/LeadService";
import { useAuth } from "@/context/auth-context";

type SubmitState = "idle" | "submitting" | "success" | "error";

/** "course" targets training pages, "message" targets the development pages. */
export type EnquiryMode = "course" | "message";

const DEFAULT_UTM_SOURCE = "google_search";

function resolveUtmSource(): string {
  if (typeof window === "undefined") return DEFAULT_UTM_SOURCE;
  const param = new URLSearchParams(window.location.search).get("utm_source");
  return param?.trim() || DEFAULT_UTM_SOURCE;
}

/**
 * Owns the enquiry form state outside the sheet, so the floating
 * "Enquire Now" button can double as the submit control.
 */
export function useEnquiryForm(
  isOpen: boolean,
  onClose: () => void,
  mode: EnquiryMode = "course"
) {
  const { user, isAuthenticated, sendOtp, verifyOtp, resendOtp } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(mode === "course");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showRequiredHint, setShowRequiredHint] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Pre-fill user data if already authenticated
  useEffect(() => {
    if (user && isOpen) {
      if (user.profile?.name) {
        const parts = user.profile.name.trim().split(" ");
        if (!firstName) setFirstName(parts[0] || "");
        if (!lastName && parts.length > 1) setLastName(parts.slice(1).join(" "));
      }
      if (!phone && user.username) {
        const clean = user.username.replace(/^91/, "").replace(/\D/g, "");
        if (clean.length === 10) setPhone(clean);
      }
    }
  }, [user, isOpen, firstName, lastName, phone]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const isValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    phone.length === 10 &&
    (mode === "course" ? courseId !== "" : true);

  // Load the live course list from backend API on mount
  useEffect(() => {
    if (mode !== "course") return;

    let cancelled = false;
    setCoursesLoading(true);

    courseService
      .getCourses()
      .then((allCourses) => {
        if (cancelled) return;
        const active = allCourses.filter((course) => course.status === "active");
        setCourses(active.length > 0 ? active : allCourses);
      })
      .catch((err) => {
        console.error("Failed to load live courses:", err);
      })
      .finally(() => {
        if (!cancelled) setCoursesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const reset = useCallback(() => {
    if (!user) {
      setFirstName("");
      setLastName("");
      setPhone("");
    }
    setStep("form");
    setCourseId("");
    setMessage("");
    setOtp(["", "", "", ""]);
    setSubmitState("idle");
    setErrorMessage("");
    setShowRequiredHint(false);
    setResendCooldown(0);
  }, [user]);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
    setErrorMessage("");
  }, []);

  const handleOtpChange = useCallback((index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned && val !== "") return;
    const char = cleaned.slice(-1);

    setOtp((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    setErrorMessage("");
  }, []);

  const handleResend = useCallback(
    async (retrytype: "text" | "voice" = "text") => {
      if (resendCooldown > 0) return;
      setErrorMessage("");
      try {
        const res = await resendOtp(phone, retrytype);
        if (res.success) {
          setResendCooldown(30);
        } else {
          setErrorMessage(res.error || "Failed to resend OTP");
        }
      } catch {
        setErrorMessage("Failed to resend OTP");
      }
    },
    [phone, resendCooldown, resendOtp]
  );

  const submitLeadDirectly = useCallback(async () => {
    await createWebLead({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: phone,
      utmSource: resolveUtmSource(),
      courseId: mode === "course" ? courseId : null,
      message: mode === "message" ? message.trim() || null : null,
      status: "hot",
      generatedSource: "online",
    });
    setSubmitState("success");
    setTimeout(onClose, 1800);
  }, [courseId, firstName, lastName, message, mode, onClose, phone]);

  const submit = useCallback(async () => {
    if (submitState === "submitting") return;

    // STEP 1: If in Form step
    if (step === "form") {
      if (!isValid) {
        setShowRequiredHint(true);
        return;
      }

      setSubmitState("submitting");
      setErrorMessage("");

      // If user is already authenticated with this number, skip OTP!
      const userPhone = user?.username ? user.username.replace(/^91/, "") : "";
      if (isAuthenticated && userPhone === phone) {
        try {
          await submitLeadDirectly();
        } catch (error) {
          console.error("Failed to submit enquiry:", error);
          setErrorMessage("Something went wrong. Please try again.");
          setSubmitState("error");
        }
        return;
      }

      // Otherwise send OTP to verify the mobile number
      try {
        const res = await sendOtp(phone);
        if (res.success) {
          setStep("otp");
          setSubmitState("idle");
          setResendCooldown(30);
        } else {
          setErrorMessage(res.error || "Failed to send OTP to this number. Please check and try again.");
          setSubmitState("error");
        }
      } catch {
        setErrorMessage("Unable to send OTP at this time. Please try again.");
        setSubmitState("error");
      }
      return;
    }

    // STEP 2: If in OTP step
    const code = otp.join("");
    if (code.length !== 4) {
      setErrorMessage("Please enter all 4 digits of the OTP");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const verifyRes = await verifyOtp(phone, code);
      if (!verifyRes.success) {
        setErrorMessage(verifyRes.error || "Incorrect OTP. Please try again.");
        setSubmitState("error");
        return;
      }

      // Successfully verified and authenticated! Now save lead.
      await submitLeadDirectly();
    } catch (error) {
      console.error("Failed to verify & submit:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setSubmitState("error");
    }
  }, [
    isValid,
    otp,
    phone,
    sendOtp,
    step,
    submitLeadDirectly,
    submitState,
    user?.username,
    isAuthenticated,
    verifyOtp,
  ]);

  return {
    mode,
    step,
    setStep,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    handlePhoneChange,
    courseId,
    setCourseId,
    message,
    setMessage,
    courses,
    coursesLoading,
    isValid,
    otp,
    setOtp,
    handleOtpChange,
    resendCooldown,
    handleResend,
    isSubmitting: submitState === "submitting",
    isSubmitted: submitState === "success",
    showRequiredHint: showRequiredHint && !isValid,
    errorMessage,
    submit,
    reset,
  };
}

export type EnquiryForm = ReturnType<typeof useEnquiryForm>;

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: EnquiryForm;
}

export default function EnquiryModal({ isOpen, onClose, form }: EnquiryModalProps) {
  if (!isOpen) return null;
  return <EnquirySheet onClose={onClose} form={form} />;
}

function EnquirySheet({ onClose, form }: { onClose: () => void; form: EnquiryForm }) {
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Lock body scroll while the sheet is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (form.step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 50);
    }
  }, [form.step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.submit();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !form.otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    for (let i = 0; i < pasted.length; i++) {
      form.handleOtpChange(i, pasted[i]);
    }
    const focusIndex = Math.min(pasted.length, 3);
    otpInputsRef.current[focusIndex]?.focus();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[#04142C]/60 animate-backdrop-fade md:items-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={onClose}
    >
      {/* Modal / Bottom Sheet */}
      <div
        className="relative w-full rounded-t-2xl bg-[#1550A5] p-6 pb-28 shadow-2xl shadow-black/40 max-h-[85dvh] overflow-y-auto animate-sheet-up md:max-w-xl md:rounded-2xl md:p-8 md:pb-8 md:animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/40 md:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between pt-2 pb-4">
          <div>
            <div className="flex items-center">
              <h2
                id="enquiry-modal-title"
                className="text-lg font-bold tracking-tight text-white sm:text-xl"
              >
                {form.step === "otp" ? "Verify Mobile Number" : "Enquire Now"}
              </h2>
            </div>
            <p className="mt-1 text-xs text-blue-100/80 leading-relaxed">
              {form.step === "otp"
                ? `Enter the 4-digit code sent via SMS to +91 ${form.phone}`
                : form.mode === "course"
                ? "Share your details and our career counselor will reach out shortly."
                : "Tell us about your project and our tech team will reach out shortly."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-blue-100/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {form.isSubmitted ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="size-12 text-green-400" aria-hidden="true" />
            <p className="text-base font-bold text-white">
              Thank you! Your enquiry has been submitted.
            </p>
            <p className="text-xs text-blue-100/90 max-w-sm">
              Your mobile number is verified. Our team will contact you shortly.
            </p>
          </div>
        ) : form.step === "otp" ? (
          /* STEP 2: OTP Verification Form */
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="flex items-center justify-between text-xs text-blue-100/90">
              <span>Code sent to +91 {form.phone}</span>
              <button
                type="button"
                onClick={() => form.setStep("form")}
                className="flex items-center gap-1 text-white underline font-semibold hover:text-amber-200 cursor-pointer"
              >
                <ArrowLeft className="size-3" />
                <span>Change Number</span>
              </button>
            </div>

            {/* 4 OTP Input Boxes */}
            <div className="flex items-center justify-center gap-3 py-3">
              {form.otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    form.handleOtpChange(index, e.target.value);
                    if (e.target.value && index < 3) {
                      otpInputsRef.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  aria-label={`Digit ${index + 1}`}
                  className="h-12 w-12 rounded-lg border border-white/40 bg-white text-center text-xl font-bold text-neutral-900 focus:border-[#F58216] focus:outline-none focus:ring-2 focus:ring-white"
                />
              ))}
            </div>

            {form.errorMessage && (
              <div className="flex items-center gap-2 rounded-md bg-red-500/25 px-3 py-2 text-xs text-red-100 border border-red-300/30">
                <AlertCircle className="size-4 shrink-0" />
                <span>{form.errorMessage}</span>
              </div>
            )}

            {/* Resend actions */}
            <div className="flex items-center justify-between text-xs text-blue-100/80 pt-1">
              <span>Didn&apos;t receive code?</span>
              {form.resendCooldown > 0 ? (
                <span className="font-medium text-amber-200">
                  Resend in {form.resendCooldown}s
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => form.handleResend("text")}
                    className="font-semibold text-white underline hover:text-amber-200 cursor-pointer"
                  >
                    Resend SMS
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => form.handleResend("voice")}
                    className="font-semibold text-white underline hover:text-amber-200 cursor-pointer"
                  >
                    Call Me
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Direct Submit Action */}
            <div className="hidden md:flex items-center justify-end pt-3">
              <button
                type="submit"
                disabled={form.isSubmitting || form.otp.some((d) => !d)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F58216] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#DE5426] active:bg-[#c7451a] disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {form.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    <span>Verify & Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: Details Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First / Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="enquiry-first-name"
                  className="block text-xs font-medium text-blue-50"
                >
                  First Name <span className="text-[#F58216]">*</span>
                </label>
                <input
                  id="enquiry-first-name"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => form.setFirstName(e.target.value)}
                  placeholder="Aarav"
                  className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-base sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216]"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="enquiry-last-name"
                  className="block text-xs font-medium text-blue-50"
                >
                  Last Name <span className="text-[#F58216]">*</span>
                </label>
                <input
                  id="enquiry-last-name"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => form.setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-base sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216]"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="enquiry-phone"
                className="block text-xs font-medium text-blue-50"
              >
                Mobile Number <span className="text-[#F58216]">*</span>
              </label>
              <div className="flex h-10 w-full rounded-md border border-white/30 bg-white focus-within:border-[#F58216] focus-within:ring-1 focus-within:ring-[#F58216]">
                <span className="flex items-center justify-center border-r border-neutral-300 bg-neutral-100 px-3 text-xs font-semibold text-neutral-500 select-none">
                  +91
                </span>
                <input
                  id="enquiry-phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => form.handlePhoneChange(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full bg-transparent px-3 text-base sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
              {form.phone.length > 0 && form.phone.length < 10 && (
                <p className="text-[11px] text-amber-200">
                  Please enter a valid 10-digit mobile number.
                </p>
              )}
            </div>

            {/* Interested Course */}
            {form.mode === "course" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="enquiry-course"
                  className="block text-xs font-medium text-blue-50"
                >
                  Interested Course <span className="text-[#F58216]">*</span>
                </label>
                <select
                  id="enquiry-course"
                  value={form.courseId}
                  onChange={(e) => form.setCourseId(e.target.value)}
                  disabled={form.isSubmitting || (form.coursesLoading && form.courses.length === 0)}
                  className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-base sm:text-sm font-medium text-neutral-900 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216] disabled:opacity-50"
                >
                  <option value="">
                    {form.coursesLoading && form.courses.length === 0
                      ? "Loading courses..."
                      : "Select a course"}
                  </option>
                  {(form.courses ?? []).map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Project Requirement Message */}
            {form.mode === "message" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="enquiry-message"
                  className="block text-xs font-medium text-blue-50"
                >
                  Message
                </label>
                <textarea
                  id="enquiry-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => form.setMessage(e.target.value)}
                  placeholder="Tell us about your project or requirement..."
                  className="w-full resize-none rounded-md border border-white/30 bg-white px-3 py-2 text-base sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216]"
                />
              </div>
            )}

            {form.showRequiredHint && (
              <p className="rounded-md bg-black/20 px-3 py-2 text-xs text-white">
                Please fill in all the required fields to submit.
              </p>
            )}

            {form.errorMessage && (
              <p className="rounded-md bg-red-500/25 px-3 py-2 text-xs text-red-100">
                {form.errorMessage}
              </p>
            )}

            {/* Desktop Direct Submit Action */}
            <div className="hidden md:flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={form.isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F58216] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#DE5426] active:bg-[#c7451a] disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {form.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
