"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useSettings } from "@/context/setting-context";
import LoginModal from "@/components/login";
import type { PageData } from "@/services/PageService";

export interface NavItem {
  label: string;
  href: string;
}

export function formatNavLabel(routeName: string): string {
  const clean = routeName.trim().replace(/^\/+/, "");
  if (!clean || clean.toLowerCase() === "home") {
    return "Home";
  }
  return clean
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatNavHref(routeName: string): string {
  const clean = routeName.trim().replace(/^\/+/, "");
  if (!clean || clean.toLowerCase() === "home") {
    return "/";
  }
  return `/${clean}`;
}

export function pagesToNavItems(pages: PageData[]): NavItem[] {
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return [];
  }

  const items = pages.map((page) => ({
    label: formatNavLabel(page.routeName),
    href: formatNavHref(page.routeName),
  }));

  const uniqueItems: NavItem[] = [];
  const seenHrefs = new Set<string>();

  for (const item of items) {
    if (!seenHrefs.has(item.href)) {
      seenHrefs.add(item.href);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

interface HeaderProps {
  initialPages?: PageData[];
}

export default function Header({ initialPages }: HeaderProps = {}) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const {
    companyName,
    companyLightThemedLogoUrl,
    companyDarkThemedLogoUrl,
  } = useSettings();
  const displayName = companyName || "Bytecode IT Solutions";
  const lightLogo =
    companyLightThemedLogoUrl || "/bytecode-light-theme-logo.png";
  const darkLogo =
    companyDarkThemedLogoUrl || "/bytecode-dark-theme-logo.png";
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(() =>
    initialPages && initialPages.length > 0 ? pagesToNavItems(initialPages) : []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setNavItems(
      initialPages && initialPages.length > 0 ? pagesToNavItems(initialPages) : []
    );
  }, [initialPages]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Company Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] rounded-md"
            aria-label={`${displayName} Home`}
          >
            <Image
              src={lightLogo}
              alt={displayName}
              width={200}
              height={67}
              priority
              className="h-9 w-auto object-contain dark:hidden"
            />
            <Image
              src={darkLogo}
              alt={displayName}
              width={200}
              height={67}
              priority
              className="hidden h-9 w-auto object-contain dark:block"
            />
          </Link>
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] rounded ${
                  isActive
                    ? "font-semibold text-[#1550A5] dark:text-blue-400 border-b-2 border-[#1550A5] dark:border-blue-400"
                    : "font-medium text-neutral-700 hover:text-[#1550A5] dark:text-neutral-300 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Theme Toggle & Login Button) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light theme" : "Switch to dark theme"
            }
            title={
              isDarkMode ? "Switch to light theme" : "Switch to dark theme"
            }
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
          >
            {mounted ? (
              isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="hidden md:block rounded-md bg-orange-400 px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] focus-visible:ring-offset-2 active:bg-[#0e336b] cursor-pointer"
          >
            Enquire Now
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="rounded-md bg-[#1550A5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] focus-visible:ring-offset-2 active:bg-[#0e336b] cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Mobile Controls (Theme Toggle & Menu Button) */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light theme" : "Switch to dark theme"
            }
            title={
              isDarkMode ? "Switch to light theme" : "Switch to dark theme"
            }
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
          >
            {mounted ? (
              isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Off-Canvas Sidebar (Sliding from Right) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center">
            <Image
              src={lightLogo}
              alt={displayName}
              width={160}
              height={53}
              className="h-8 w-auto object-contain dark:hidden"
            />
            <Image
              src={darkLogo}
              alt={displayName}
              width={160}
              height={53}
              className="hidden h-8 w-auto object-contain dark:block"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation Links">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
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

        {/* Sidebar Bottom Footer Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setLoginModalOpen(true);
            }}
            className="w-full flex items-center justify-center rounded-md bg-[#1550A5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#124288] cursor-pointer"
          >
            Login
          </button>

          <div className="flex items-center justify-between pt-1 px-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Appearance</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              <span>{isDarkMode ? "Dark" : "Light"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </header>
  );
}