"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import LoginModal from "@/components/login";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Development", href: "/development" },
  { label: "Programs", href: "/programs" },
  { label: "Trainings", href: "/trainings" },
];

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Company Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] rounded-md"
            aria-label="Bytecode IT Solutions Home"
          >
            <Image
              src="/bytecode-light-theme-logo.png"
              alt="Bytecode IT Solutions"
              width={200}
              height={67}
              priority
              className="h-9 w-auto object-contain dark:hidden"
            />
            <Image
              src="/bytecode-dark-theme-logo.png"
              alt="Bytecode IT Solutions"
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
          {NAV_ITEMS.map((item) => {
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

          {/* Login Button */}
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="rounded-md bg-[#1550A5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#124288] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] focus-visible:ring-offset-2 active:bg-[#0e336b] cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Mobile Controls (Menu Toggle & Theme Toggle) */}
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-black md:hidden">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-100 font-semibold text-[#1550A5] dark:bg-neutral-900 dark:text-blue-400"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="flex w-full items-center justify-center rounded-md bg-[#1550A5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#124288] cursor-pointer"
              >
                Login
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </header>
  );
}