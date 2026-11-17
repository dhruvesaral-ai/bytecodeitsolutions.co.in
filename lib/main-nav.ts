import type { PageData } from "@/services/PageService";

export interface MainNavItem {
  label: string;
  href: string;
  highlight?: boolean;
  /** Off-site links open in the same tab unless `openInNewTab` is set. */
  external?: boolean;
  openInNewTab?: boolean;
}

export const BSEP_NAV_URL = "https://bsep.bytecode.co.in";

export const BSEP_NAV_ITEM: MainNavItem = {
  label: "BSEP",
  href: BSEP_NAV_URL,
  highlight: true,
  external: true,
};

export function isExternalNavItem(item: MainNavItem): boolean {
  return item.external === true || /^https?:\/\//i.test(item.href);
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

function pagesToNavItems(pages: PageData[]): MainNavItem[] {
  if (!pages?.length) return [];

  const items = pages.map((page) => ({
    label: formatNavLabel(page.routeName),
    href: formatNavHref(page.routeName),
  }));

  const uniqueItems: MainNavItem[] = [];
  const seenHrefs = new Set<string>();

  for (const item of items) {
    if (!seenHrefs.has(item.href)) {
      seenHrefs.add(item.href);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

/** API pages plus a fixed, highlighted BSEP entry (deduped). */
export function buildMainNavItems(pages: PageData[] = []): MainNavItem[] {
  const fromApi = pagesToNavItems(pages).filter((item) => {
    const label = item.label.trim().toLowerCase();
    const href = item.href.trim().toLowerCase();
    return (
      label !== "bsep" &&
      href !== "/bsep" &&
      !href.includes("bsep.bytecode.co.in")
    );
  });

  const homeIndex = fromApi.findIndex((item) => item.href === "/");
  if (homeIndex === -1) {
    return [BSEP_NAV_ITEM, ...fromApi];
  }

  return [
    ...fromApi.slice(0, homeIndex + 1),
    BSEP_NAV_ITEM,
    ...fromApi.slice(homeIndex + 1),
  ];
}