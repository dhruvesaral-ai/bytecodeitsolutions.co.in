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

export default class PageService {
  async getPages(): Promise<PageData[]> {
    try {
      const response = await get<{ data?: unknown[] }>("pages");
      if (response && isRecord(response) && Array.isArray(response.data)) {
        return response.data.filter(isPageData);
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
        return response.data;
      }
    } catch {
      // Backend is unavailable or route not found
    }

    return null;
  }
}

export const pageService = new PageService();
