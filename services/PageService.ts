import { MEDIA_BASE_URL } from "@/config";
import { get } from "@/lib/api-method";
import { formatHeadingHtml } from "@/lib/format-heading";

export interface PageData {
  id: string;
  heading: string;
  subheading: string;
  routeName: string;
  videoUrl?: string | null;
  gallery?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: string | null;
  updatedAt?: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function resolveMediaUrl(url: string): string {
  try {
    const base = MEDIA_BASE_URL.includes("localhost:3001")
      ? "https://admin.bytecode.co.in"
      : MEDIA_BASE_URL;
    return new URL(url, `${base.replace(/\/+$/, "")}/`).toString();
  } catch {
    return url;
  }
}

function isPageData(value: unknown): value is PageData {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.heading === "string" &&
    typeof value.subheading === "string" &&
    typeof value.routeName === "string" &&
    (value.videoUrl === undefined ||
      value.videoUrl === null ||
      typeof value.videoUrl === "string") &&
    (value.gallery === undefined ||
      value.gallery === null ||
      Array.isArray(value.gallery)) &&
    (value.metaTitle === undefined ||
      value.metaTitle === null ||
      typeof value.metaTitle === "string") &&
    (value.metaDescription === undefined ||
      value.metaDescription === null ||
      typeof value.metaDescription === "string") &&
    (value.content === undefined ||
      value.content === null ||
      typeof value.content === "string") &&
    (value.updatedAt === undefined ||
      value.updatedAt === null ||
      typeof value.updatedAt === "string")
  );
}

function normalizePage(page: PageData): PageData {
  const rawGallery = Array.isArray(page.gallery) ? page.gallery : [];
  const gallery = rawGallery
    .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
    .map((url) => resolveMediaUrl(url.trim()));

  return {
    ...page,
    heading: formatHeadingHtml(page.heading),
    videoUrl:
      typeof page.videoUrl === "string" && page.videoUrl.trim()
        ? resolveMediaUrl(page.videoUrl.trim())
        : null,
    gallery,
    metaTitle:
      typeof page.metaTitle === "string" && page.metaTitle.trim().length > 0
        ? page.metaTitle.trim()
        : null,
    metaDescription:
      typeof page.metaDescription === "string" && page.metaDescription.trim().length > 0
        ? page.metaDescription.trim()
        : null,
    content:
      typeof page.content === "string" && page.content.trim().length > 0
        ? page.content.trim()
        : null,
    updatedAt:
      typeof page.updatedAt === "string" && page.updatedAt.trim().length > 0
        ? page.updatedAt.trim()
        : null,
  };
}

export default class PageService {
  async getPages(): Promise<PageData[]> {
    try {
      const response = await get<{ data?: unknown[] }>("pages");
      if (response && isRecord(response) && Array.isArray(response.data)) {
        return response.data.filter(isPageData).map(normalizePage);
      }
    } catch {
      // Backend is unavailable or prerendering
    }
    return [];
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
        return normalizePage(response.data);
      }
    } catch {
      // Backend is unavailable or route not found
    }

    return null;
  }
}

export const pageService = new PageService();
