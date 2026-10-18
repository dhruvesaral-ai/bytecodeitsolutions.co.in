"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhone("");
      setOtp(["", "", "", ""]);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 50);
    }
  }, [step]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(numericOnly);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep("otp");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Keep only the last character entered and ensure it's a digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const char = cleaned.slice(-1);
    const updated = [...otp];
    updated[index] = char;
    setOtp(updated);

    // Auto-advance focus to next box
    if (char && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pastedData) return;

    const updated = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      updated[i] = pastedData[i];
    }
    setOtp(updated);

    // Focus last filled or next input
    const focusIndex = Math.min(pastedData.length, 3);
    otpInputsRef.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only for now; ready for backend logic
    onClose();
  };

  const isPhoneValid = phone.length === 10;
  const isOtpComplete = otp.every((digit) => digit.trim() !== "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Actions */}
        <div className="flex items-center justify-between pb-4">
          {step === "otp" ? (
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* STEP 1: Phone Number */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <h2
                id="login-modal-title"
                className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
              >
                Sign in
              </h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Enter your 10-digit mobile number to receive a verification code.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <label
                htmlFor="phone-input"
                className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                Mobile Number
              </label>

              {/* +91 Disabled prefix + Phone input */}
              <div className="flex h-10 w-full rounded-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900 focus-within:border-[#1550A5] focus-within:ring-1 focus-within:ring-[#1550A5]">
                <span className="flex items-center justify-center border-r border-neutral-300 bg-neutral-100 px-3 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 select-none">
                  +91
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit number"
                  autoFocus
                  className="w-full bg-transparent px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isPhoneValid}
              className="w-full rounded-md bg-[#1550A5] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#124288] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* STEP 2: 4-Box OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <h2
                id="login-modal-title"
                className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
              >
                Verify OTP
              </h2>
              <div className="mt-1 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Code sent to +91 {phone}</span>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-[#1550A5] dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* 4 OTP Input Boxes */}
            <div className="flex items-center justify-center gap-3 py-2">
              {otp.map((digit, index) => (
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
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  aria-label={`Digit ${index + 1}`}
                  className="h-12 w-12 rounded-md border border-neutral-300 bg-white text-center text-lg font-bold text-neutral-900 focus:border-[#1550A5] focus:outline-none focus:ring-1 focus:ring-[#1550A5] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete}
              className="w-full rounded-md bg-[#1550A5] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#124288] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
            >
              Verify OTP
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setOtp(["", "", "", ""]);
                  otpInputsRef.current[0]?.focus();
                }}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Didn&apos;t receive code? <span className="font-medium text-[#1550A5] dark:text-blue-400 underline">Resend</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}