import { MEDIA_BASE_URL } from "@/config";
import { ApiRequestError, get } from "@/lib/api-method";
import fallbackData from "@/coursesdata.json";

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
    return new URL(url, `${MEDIA_BASE_URL.replace(/\/+$/, "")}/`).toString();
  } catch {
    throw new Error(`Invalid course image URL: ${url}`);
  }
}

function getFallbackCategories(): CourseCategory[] {
  return (fallbackData.course_categorie || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
}

function getFallbackCourses(): Course[] {
  const categories = getFallbackCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (fallbackData.course || []).map((c) => {
    const description = typeof c.description === "string" ? c.description : "";
    return {
      id: c.id,
      name: c.name,
      shortDescription: description,
      longDescription: description,
      originalPrice: typeof c.originalPrice === "number" ? c.originalPrice : 0,
      discountedPrice: typeof c.discountedPrice === "number" ? c.discountedPrice : 0,
      rating: typeof c.rating === "number" ? c.rating : 5,
      technologyTags: Array.isArray(c.technology_tags) ? c.technology_tags : [],
      duration: typeof c.duration === "string" ? c.duration : "",
      status: "active",
      courseImgUrl: c.course_img_url,
      courseCategorieId: c.course_categorie_id,
      isInSale: c.is_in_sale === true,
      syllabus: Array.isArray(c.syllabus) ? c.syllabus.join("\n") : (c.syllabus || null),
      isPlacementGurranted: c.is_placement_gurranted === true,
      courseCategorie: categoryMap.get(c.course_categorie_id) || null,
    };
  });
}

export default class CourseService {
  async getCourseCategories(): Promise<CourseCategory[]> {
    try {
      const response = await get<{ data: unknown[] }>("course-categories");

      if (response && Array.isArray(response.data) && response.data.every(isCourseCategory)) {
        return response.data;
      }
    } catch {
      // Backend is unavailable, use local fallback
    }

    return getFallbackCategories();
  }

  async getCourses(): Promise<Course[]> {
    try {
      const response = await get<unknown>("courses");

      if (isRecord(response) && Array.isArray(response.data)) {
        return response.data.map(parseCourse);
      }
    } catch {
      // Backend is unavailable, use local fallback
    }

    return getFallbackCourses();
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
      // Backend is unavailable, use local fallback
    }

    const localCourse = getFallbackCourses().find((c) => c.id === id);
    return localCourse || null;
  }
}

export const courseService = new CourseService();

