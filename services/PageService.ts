import { ApiRequestError, get } from "@/lib/api-method";

export interface PageData {
  id: string;
  heading: string;
  subheading: string;
  routeName: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPageData(value: unknown): value is PageData {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.heading === "string" &&
    typeof value.subheading === "string" &&
    typeof value.routeName === "string"
  );
}

export const DEFAULT_PAGES: PageData[] = [
  {
    id: "default-courses",
    heading: "Learn AI-Powered Modern Tech Courses with Real MNC Developers",
    subheading:
      "Industry-designed bootcamps and specialization tracks built to take you from foundational concepts to production-grade engineering. Get live 1-on-1 code reviews, system design mentorship, and dedicated placement assistance.",
    routeName: "courses",
  },
  {
    id: "default-home",
    heading: "We Develop Technology & We Train Talent",
    subheading:
      "Building digital solutions for businesses and developing the next generation of tech professionals through practical, industry-focused training.",
    routeName: "home",
  },
];

export default class PageService {
  async getPages(): Promise<PageData[]> {
    try {
      const response = await get<{ data?: unknown[] }>("pages");
      if (response && isRecord(response) && Array.isArray(response.data)) {
        const pages = response.data.filter(isPageData);
        if (pages.length > 0) {
          return pages;
        }
      }
    } catch {
      // Backend is unavailable or prerendering
    }
    return DEFAULT_PAGES;
  }

  async getPageByRoute(routeName: string): Promise<PageData | null> {
    try {
      const response = await get<{ data?: unknown; error?: string }>(
        `pages/by-route/${encodeURIComponent(routeName)}`
      );
      if (
        response &&
        isRecord(response) &&
        "data" in response &&
        isPageData(response.data)
      ) {
        return response.data;
      }
    } catch {
      // Backend is unavailable or route not found
    }

    const fallback = DEFAULT_PAGES.find(
      (p) => p.routeName.toLowerCase() === routeName.toLowerCase()
    );
    return fallback || null;
  }
}

export const pageService = new PageService();
