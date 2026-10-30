"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Sun, Moon, User, SlidersHorizontal } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { useTheme } from "@/context/theme-context";
import { useSettings } from "@/context/setting-context";
import { useAuth } from "@/context/auth-context";
import { useEnquiry } from "@/context/enquiry-context";

export default function AppSidebar() {
  const pathname = usePathname();
  const {
    isOpen,
    view,
    filterTitle,
    filterContent,
    navItems,
    closeSidebar,
  } = useSidebar();
  const { resolvedTheme, toggleTheme } = useTheme();
  const {
    companyName,
    companyLightThemedLogoUrl,
    companyDarkThemedLogoUrl,
  } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const { openEnquiry } = useEnquiry();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSidebar]);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const displayName = companyName || "Bytecode IT Solutions";
  const lightLogo =
    companyLightThemedLogoUrl || "/bytecode-light-theme-logo.png";
  const darkLogo =
    companyDarkThemedLogoUrl || "/bytecode-dark-theme-logo.png";
  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <>
      {/* Backdrop with high z-index (z-[70]) placed strictly above enquire icon (z-50) */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-xs sm:max-w-sm bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={view === "filter" ? filterTitle || "Filters" : "Mobile Navigation"}
      >
        {/* Drawer Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-neutral-200 dark:border-neutral-800">
          {view === "filter" ? (
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal
                className="size-5 text-[#1550A5] dark:text-blue-400"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {filterTitle || "Filters"}
              </h2>
            </div>
          ) : (
            <div className="flex items-center">
              <Image
                src={lightLogo}
                alt={displayName}
                width={160}
                height={53}
                priority
                className="h-8 w-auto object-contain dark:hidden"
              />
              <Image
                src={darkLogo}
                alt={displayName}
                width={160}
                height={53}
                priority
                className="hidden h-8 w-auto object-contain dark:block"
              />
            </div>
          )}

          <button
            type="button"
            onClick={closeSidebar}
            aria-label={view === "filter" ? "Close filters" : "Close navigation menu"}
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {view === "filter" ? (
          /* FILTER MODE CONTENT */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {filterContent}
            <div id="sidebar-filter-portal" className="contents" />
          </div>
        ) : (
          /* NAVIGATION MODE CONTENT */
          <>
            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav
                className="flex flex-col space-y-1.5"
                aria-label="Mobile Navigation Links"
              >
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-100 font-semibold text-[#1550A5] dark:bg-neutral-800 dark:text-blue-400"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3 shrink-0">
              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={closeSidebar}
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <User className="size-4 text-[#1550A5] dark:text-blue-400" />
                  <span>My Profile ({user?.username})</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  closeSidebar();
                  openEnquiry("course");
                }}
                className="w-full flex items-center justify-center rounded-md bg-[#F58216] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#DE5426] active:bg-[#c7451a] cursor-pointer"
              >
                Enquire Now
              </button>

              <div className="flex items-center justify-between pt-1 px-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span>Appearance</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                >
                  {isDarkMode ? (
                    <Sun className="size-3.5" />
                  ) : (
                    <Moon className="size-3.5" />
                  )}
                  <span>{isDarkMode ? "Dark" : "Light"}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

