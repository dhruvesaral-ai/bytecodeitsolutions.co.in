"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2 } from "lucide-react";
import { courseService, type Course } from "@/services/CourseService";
import { createWebLead } from "@/services/LeadService";

type SubmitState = "idle" | "submitting" | "success" | "error";

/** "course" targets training pages, "message" targets the development pages. */
export type EnquiryMode = "course" | "message";

const DEFAULT_UTM_SOURCE = "google_search";

// Prefer the utm_source campaign param the visitor arrived with.
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showRequiredHint, setShowRequiredHint] = useState(false);

  const isValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    phone.length === 10 &&
    (mode === "course" ? courseId !== "" : true);

  // Load the course list the first time the sheet is opened
  useEffect(() => {
    if (!isOpen || mode !== "course" || courses !== null) return;

    let cancelled = false;
    courseService.getCourses().then((allCourses) => {
      if (cancelled) return;
      setCourses(allCourses.filter((course) => course.status === "active"));
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, mode, courses]);

  const reset = useCallback(() => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setCourseId("");
    setMessage("");
    setSubmitState("idle");
    setErrorMessage("");
    setShowRequiredHint(false);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
  }, []);

  const submit = useCallback(async () => {
    if (submitState === "submitting") return;
    if (!isValid) {
      setShowRequiredHint(true);
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");
    try {
      await createWebLead({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: phone,
        utmSource: resolveUtmSource(),
        // Development enquiries carry no course, course enquiries no message.
        courseId: mode === "course" ? courseId : null,
        message: mode === "message" ? message.trim() || null : null,
        status: "hot",
        generatedSource: "online",
      });
      setSubmitState("success");
      setTimeout(onClose, 1800);
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setSubmitState("error");
    }
  }, [
    courseId,
    firstName,
    isValid,
    lastName,
    message,
    mode,
    onClose,
    phone,
    submitState,
  ]);

  return {
    mode,
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
    coursesLoading: mode === "course" && courses === null,
    isValid,
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
  // Mount/unmount the sheet so every open starts with a fresh form.
  if (!isOpen) return null;
  return <EnquirySheet onClose={onClose} form={form} />;
}

function EnquirySheet({ onClose, form }: { onClose: () => void; form: EnquiryForm }) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.submit();
  };
  
  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[#04142C]/60 animate-backdrop-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={onClose}
    >
      {/* Bottom Sheet */}
      <div
        className="relative w-full animate-sheet-up rounded-t-2xl bg-[#1550A5] p-6 pb-28 shadow-2xl shadow-black/40 max-h-[85dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/40" />

        {/* Header */}
        <div className="flex items-start justify-between pt-2 pb-4">
          <div>
            <h2
              id="enquiry-modal-title"
              className="text-lg font-bold tracking-tight text-white"
            >
              Enquire Now
            </h2>
            <p className="mt-1 text-xs text-blue-100/80 leading-relaxed">
              {form.mode === "course"
                ? "Share your details and our team will reach out shortly."
                : "Tell us about your project and our team will reach out shortly."}
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
            <CheckCircle2 className="size-10 text-green-400" aria-hidden="true" />
            <p className="text-sm font-semibold text-white">
              Thank you! Your enquiry has been submitted.
            </p>
            <p className="text-xs text-blue-100/80">We&apos;ll get back to you soon.</p>
          </div>
        ) : (
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
                  autoFocus
                  className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216]"
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
                  className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216]"
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
                  className="w-full bg-transparent px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
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
                  disabled={form.coursesLoading}
                  className="h-10 w-full rounded-md border border-white/30 bg-white px-3 text-sm font-medium text-neutral-900 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216] disabled:opacity-50"
                >
                  <option value="">
                    {form.coursesLoading ? "Loading courses..." : "Select a course"}
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
                  className="w-full resize-none rounded-md border border-white/30 bg-white px-3 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#F58216] focus:outline-none focus:ring-1 focus:ring-[#F58216]"
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
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
