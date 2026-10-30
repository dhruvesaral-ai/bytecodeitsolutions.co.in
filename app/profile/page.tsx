"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, sendOtp, verifyOtp, resendOtp } = useAuth();

  // Login form state if unauthenticated
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input on step switch
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 50);
    }
  }, [step]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
    setErrorMessage("");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setStep("otp");
        setResendCooldown(30);
      } else {
        setErrorMessage(res.error || "Failed to send OTP. Please check the number and try again.");
      }
    } catch {
      setErrorMessage("Unable to send OTP at this time. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const updated = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtp(updated);
    const focusIndex = Math.min(pasted.length, 3);
    otpInputsRef.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 4) {
      setErrorMessage("Please enter all 4 digits of the OTP");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    try {
      const res = await verifyOtp(phone, code);
      if (!res.success) {
        setErrorMessage(res.error || "Incorrect OTP. Please try again.");
      }
    } catch {
      setErrorMessage("Failed to verify OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (retrytype: "text" | "voice" = "text") => {
    if (resendCooldown > 0) return;
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="size-6 animate-spin text-[#1550A5]" />
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // 1. Unauthenticated View (Login with OTP)
  // ==========================================
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#1550A5]/10 text-[#1550A5] dark:bg-blue-400/10 dark:text-blue-400">
              <User className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Student Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              {step === "phone"
                ? "Enter your mobile number to sign in or view your profile"
                : `Enter the 4-digit code sent to +91 ${phone}`}
            </p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-phone"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Mobile Number
                </label>
                <div className="flex h-11 w-full rounded-lg border border-neutral-300 bg-white focus-within:border-[#1550A5] focus-within:ring-2 focus-within:ring-[#1550A5]/20 dark:border-neutral-700 dark:bg-neutral-900">
                  <span className="flex items-center justify-center border-r border-neutral-200 bg-neutral-50 px-3.5 text-xs font-semibold text-neutral-600 select-none dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
                    +91
                  </span>
                  <input
                    id="profile-phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-transparent px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={phone.length !== 10 || submitting}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-[#1550A5] text-sm font-semibold text-white transition-colors hover:bg-[#124288] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Code sent to +91 {phone}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setErrorMessage("");
                  }}
                  className="flex items-center gap-1 text-[#1550A5] dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  <ArrowLeft className="size-3" />
                  <span>Edit number</span>
                </button>
              </div>

              {/* 4-Box OTP Input */}
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
                    className="h-12 w-12 rounded-lg border border-neutral-300 bg-white text-center text-lg font-bold text-neutral-900 focus:border-[#1550A5] focus:outline-none focus:ring-2 focus:ring-[#1550A5]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={otp.some((d) => !d) || submitting}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-[#1550A5] text-sm font-semibold text-white transition-colors hover:bg-[#124288] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Sign In</span>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs text-neutral-500">
                <span>Didn&apos;t receive code?</span>
                {resendCooldown > 0 ? (
                  <span className="font-medium text-neutral-400">Resend in {resendCooldown}s</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleResend("text")}
                      className="font-semibold text-[#1550A5] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Resend SMS
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleResend("voice")}
                      className="font-semibold text-[#1550A5] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Call Me
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    );
  }

  // ==========================================
  // 2. Authenticated Profile View
  // ==========================================
  const displayName = user.profile?.name || `Student ${user.username.slice(-4)}`;
  const displayEmail = user.profile?.email || "Not specified";
  const displayPhone = user.username.startsWith("91") && user.username.length === 12
    ? `+91 ${user.username.slice(2, 7)} ${user.username.slice(7)}`
    : user.username;
  const roleName = user.role?.name || "Student";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back to courses */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1550A5] dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Profile Header Banner Card */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        {/* Accent Top Strip */}
        <div className="h-24 bg-gradient-to-r from-[#1550A5] to-[#124288] relative">
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-xs font-medium text-white border border-white/30">
              <ShieldCheck className="size-3.5" />
              <span>Verified Account</span>
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-2xl border-4 border-white dark:border-neutral-900 bg-[#1550A5] text-white shadow-md font-bold text-2xl sm:text-3xl select-none">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="pb-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {displayName}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                  {displayPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                {roleName}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1550A5] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60">
                Active
              </span>
            </div>
          </div>

          {/* Grid Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#1550A5]/10 text-[#1550A5] dark:bg-blue-400/10 dark:text-blue-400">
                <Phone className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Registered Mobile
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white font-mono">
                  {displayPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#F58216]/10 text-[#F58216]">
                <Mail className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {displayEmail}
                </p>
              </div>
            </div>

            {memberSince && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {memberSince}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Account Status
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white capitalize">
                  {user.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Exploration */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/courses"
          className="group flex items-center justify-between p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:border-[#1550A5] hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1550A5]/10 text-[#1550A5] dark:bg-blue-400/10 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Explore Available Courses
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Browse Full Stack, AI & placement guaranteed batches
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 text-neutral-400 group-hover:text-[#1550A5] group-hover:translate-x-1 transition-all" />
        </Link>

        <div className="flex items-center justify-between p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#F58216]/10 text-[#F58216]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Career Counseling & Support
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Talk directly with our technical advisors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Logout Action */}
      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Signed in as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{user.username}</span>
        </p>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-950/60 cursor-pointer disabled:opacity-50"
        >
          {loggingOut ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
