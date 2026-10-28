import { MEDIA_BASE_URL } from "@/config";
import { ApiRequestError, get } from "@/lib/api-method";

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  technologyTags: string[];
  duration: string;
  status: string;
  courseImgUrl: string;
  portraitImgUrl: string | null;
  courseCategorieId: string;
  isInSale: boolean;
  syllabus: string | null;
  isPlacementGurranted: boolean;
  courseCategorie: CourseCategory | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCourseCategory(value: unknown): value is CourseCategory {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.slug === "string"
  );
}

function parsePrice(value: unknown, field: string, index: number): number {
  const price = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(price)) {
    throw new Error(`Courses API returned an invalid ${field} for item ${index}.`);
  }
  return price;
}

function parseCourse(value: unknown, index: number): Course {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.courseCategorieId !== "string" ||
    typeof value.status !== "string" ||
    typeof value.courseImgUrl !== "string"
  ) {
    throw new Error(`Courses API returned an invalid course at item ${index}.`);
  }

  const technologyTags = Array.isArray(value.technologyTags)
    ? value.technologyTags.filter(
        (tag): tag is string => typeof tag === "string"
      )
    : [];
  const description =
    typeof value.shortDescription === "string"
      ? value.shortDescription
      : typeof value.longDescription === "string"
        ? value.longDescription
        : "";

  return {
    id: value.id,
    name: value.name,
    shortDescription: description,
    longDescription:
      typeof value.longDescription === "string"
        ? value.longDescription
        : description,
    originalPrice: parsePrice(value.originalPrice, "originalPrice", index),
    discountedPrice: parsePrice(value.discountedPrice, "discountedPrice", index),
    rating: typeof value.rating === "number" ? value.rating : 0,
    technologyTags,
    duration: typeof value.duration === "string" ? value.duration : "",
    status: value.status,
    portraitImgUrl:
      typeof value.portraitImgUrl === "string"
        ? resolveMediaUrl(value.portraitImgUrl)
        : null,
    courseImgUrl: resolveMediaUrl(value.courseImgUrl),
    courseCategorieId: value.courseCategorieId,
    isInSale: value.isInSale === true,
    syllabus:
      typeof value.syllabus === "string"
        ? resolveMediaUrl(value.syllabus)
        : null,
    isPlacementGurranted: value.isPlacementGurranted === true,
    courseCategorie: isCourseCategory(value.courseCategorie)
      ? value.courseCategorie
      : null,
  };
}

function resolveMediaUrl(url: string): string {
  try {
    const base = MEDIA_BASE_URL.includes("localhost:3001")
      ? "https://admin.bytecode.co.in"
      : MEDIA_BASE_URL;
    return new URL(url, `${base.replace(/\/+$/, "")}/`).toString();
  } catch {
    throw new Error(`Invalid course image URL: ${url}`);
  }
}

export default class CourseService {
  async getCourseCategories(): Promise<CourseCategory[]> {
    try {
      const response = await get<{ data: unknown[] }>("course-categories");

      if (response && Array.isArray(response.data) && response.data.every(isCourseCategory)) {
        return response.data;
      }
    } catch {
      // Backend is unavailable
    }

    return [];
  }

  async getCourses(): Promise<Course[]> {
    try {
      const response = await get<unknown>("courses");

      if (isRecord(response) && Array.isArray(response.data)) {
        return response.data.map(parseCourse);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    }

    return [];
  }

  async getCourseById(id: string): Promise<Course | null> {
    try {
      const response = await get<unknown>(`courses/${encodeURIComponent(id)}`);

      if (isRecord(response) && response.error === "Course not found") {
        return null;
      }

      if (isRecord(response) && "data" in response) {
        return parseCourse(response.data, 0);
      }
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      // Backend is unavailable
    }

    return null;
  }
}

export const courseService = new CourseService();

