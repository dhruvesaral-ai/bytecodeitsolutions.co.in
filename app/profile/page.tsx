"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/login?next=/profile");
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="size-6 animate-spin text-[#1550A5]" />
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      </main>
    );
  }

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
      <Link href="/courses">
        <ArrowLeft className="size-3.5" />
        <span className="text-xs font-semibold text-[#1550A5] dark:text-blue-400 hover:underline">Back to Courses</span>
      </Link>

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
