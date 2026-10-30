"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, User } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useSettings } from "@/context/setting-context";
import { useEnquiry } from "@/context/enquiry-context";
import { useAuth } from "@/context/auth-context";
import { useSidebar } from "@/context/sidebar-context";
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
  const { openNav, setNavItems: setSidebarNavItems } = useSidebar();
  const { openEnquiry } = useEnquiry();
  const { user, isAuthenticated } = useAuth();
  const [navItems, setNavItems] = useState<NavItem[]>(() =>
    initialPages && initialPages.length > 0 ? pagesToNavItems(initialPages) : []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialPages && initialPages.length > 0) {
      const items = pagesToNavItems(initialPages);
      setNavItems(items);
      setSidebarNavItems(items);
    }
  }, [initialPages, setSidebarNavItems]);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <header className="w-full border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
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
                scroll={true}
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

          {/* Profile Icon (when authenticated) */}
          {isAuthenticated && (
            <Link
              href="/profile"
              aria-label="View Profile"
              title={user?.profile?.name || user?.username || "My Profile"}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-[#1550A5] transition-colors hover:bg-neutral-100 hover:border-[#1550A5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-blue-400 dark:hover:bg-neutral-900 cursor-pointer"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => openEnquiry("course")}
            className="hidden md:block rounded-md bg-[#F58216] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#DE5426] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58216] focus-visible:ring-offset-2 active:bg-[#c7451a] cursor-pointer"
          >
            Enquire Now
          </button>
        </div>

        {/* Mobile Controls (Profile & Theme Toggle & Menu Button) */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <Link
              href="/profile"
              aria-label="View Profile"
              title={user?.profile?.name || user?.username || "My Profile"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-[#1550A5] transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-blue-400 dark:hover:bg-neutral-900 cursor-pointer"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
          )}
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
            onClick={openNav}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1550A5] dark:border-neutral-700 dark:bg-black dark:text-neutral-200 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
