"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pageService, type PageData } from "@/services/PageService";

interface PageVisitTrackerProps {
  pages: PageData[];
}

function normalizeRoute(route: string): string {
  const normalizedRoute = route.replace(/^\/+|\/+$/g, "").toLowerCase();
  return normalizedRoute || "home";
}

export default function PageVisitTracker({ pages }: PageVisitTrackerProps) {
  const pathname = usePathname();
  const lastVisitedPath = useRef<string | null>(null);
  const visitCounts = useRef(
    new Map(pages.map((page) => [page.id, page.visits ?? 0]))
  );

  useEffect(() => {
    if (!pathname || lastVisitedPath.current === pathname) return;

    lastVisitedPath.current = pathname;
    const route = normalizeRoute(pathname);
    const page = pages.find(
      (candidate) => normalizeRoute(candidate.routeName) === route
    );
    if (!page) return;

    const nextVisits = (visitCounts.current.get(page.id) ?? 0) + 1;
    visitCounts.current.set(page.id, nextVisits);

    void pageService
      .updateVisits(page.id, nextVisits)
      .catch((error: unknown) => {
        console.error(`Failed to update visits for page ${page.id}:`, error);
      });
  }, [pages, pathname]);

  return null;
}
