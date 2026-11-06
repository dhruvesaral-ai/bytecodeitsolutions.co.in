import { MEDIA_BASE_URL } from "@/config";
import { ApiRequestError, get } from "@/lib/api-method";
import type {
  ApiResponse,
  CourseByIdResponse,
  CourseModuleResponse,
  InstallmentResponse,
  InstallmentPlanResponse,
} from "@/response";

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  originalPrice: number;
  discountedPrice: number;
  bookingAmount: number | null;
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
  modules: CourseModuleResponse[];
  courseModuleIds: string[];
  installmentPlans: CourseInstallmentPlan[];
  updatedAt?: string;
  createdAt?: string;
}

interface CourseInstallment extends Omit<InstallmentResponse, "amount"> {
  amount: number;
}

interface CourseInstallmentPlan
  extends Omit<InstallmentPlanResponse, "installments"> {
  installments: CourseInstallment[];
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

function isCourseModule(value: unknown): value is CourseModuleResponse {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string"
  );
}

function isInstallmentResponse(value: unknown): value is InstallmentResponse {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.planId === "string" &&
    typeof value.installmentNo === "number" &&
    typeof value.amount === "string" &&
    typeof value.dueAfterDays === "number"
  );
}

function isInstallmentPlanResponse(
  value: unknown
): value is InstallmentPlanResponse {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.courseId === "string" &&
    typeof value.isActive === "boolean" &&
    Array.isArray(value.installments) &&
    value.installments.every(isInstallmentResponse)
  );
}

function isCourseByIdResponse(value: unknown): value is CourseByIdResponse {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.shortDescription === "string" &&
    (typeof value.longDescription === "string" ||
      value.longDescription === null) &&
    typeof value.originalPrice === "string" &&
    typeof value.discountedPrice === "string" &&
    typeof value.bookingAmount === "string" &&
    typeof value.rating === "number" &&
    Array.isArray(value.technologyTags) &&
    value.technologyTags.every((tag) => typeof tag === "string") &&
    typeof value.duration === "string" &&
    typeof value.status === "string" &&
    typeof value.courseImgUrl === "string" &&
    (typeof value.portraitImgUrl === "string" ||
      value.portraitImgUrl === null) &&
    (typeof value.syllabus === "string" || value.syllabus === null) &&
    typeof value.courseCategorieId === "string" &&
    typeof value.isPlacementGurranted === "boolean" &&
    typeof value.isInSale === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (value.courseCategorie === null ||
      isCourseCategory(value.courseCategorie)) &&
    Array.isArray(value.modules) &&
    value.modules.every(isCourseModule) &&
    Array.isArray(value.courseModuleIds) &&
    value.courseModuleIds.every((moduleId) => typeof moduleId === "string") &&
    Array.isArray(value.installmentPlans) &&
    value.installmentPlans.every(isInstallmentPlanResponse)
  );
}

function isCourseByIdApiResponse(
  value: unknown
): value is ApiResponse<CourseByIdResponse> {
  return (
    isRecord(value) &&
    "data" in value &&
    isCourseByIdResponse(value.data)
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
    typeof value.shortDescription === "string" ? value.shortDescription : "";
  const modules = Array.isArray(value.modules)
    ? value.modules.map((module, moduleIndex) => {
        if (!isCourseModule(module)) {
          throw new Error(
            `Courses API returned an invalid module at item ${moduleIndex} for course ${index}.`
          );
        }
        return {
          id: module.id,
          title: module.title,
          description: module.description,
        };
      })
    : [];
  const installmentPlans = Array.isArray(value.installmentPlans)
    ? value.installmentPlans.map((plan, planIndex) => {
        if (
          !isRecord(plan) ||
          typeof plan.id !== "string" ||
          typeof plan.courseId !== "string" ||
          typeof plan.isActive !== "boolean" ||
          !Array.isArray(plan.installments)
        ) {
          throw new Error(
            `Courses API returned an invalid installment plan at item ${planIndex} for course ${index}.`
          );
        }
        return {
          id: plan.id,
          courseId: plan.courseId,
          isActive: plan.isActive,
          installments: plan.installments.map((installment, installmentIndex) => {
            if (!isInstallmentResponse(installment)) {
              throw new Error(
                `Courses API returned an invalid installment at item ${installmentIndex} in plan ${planIndex} for course ${index}.`
              );
            }
            return {
              id: installment.id,
              planId: installment.planId,
              installmentNo: installment.installmentNo,
              amount: parsePrice(
                installment.amount,
                "installment amount",
                installmentIndex
              ),
              dueAfterDays: installment.dueAfterDays,
            };
          }),
        };
      })
    : [];

  return {
    id: value.id,
    name: value.name,
    shortDescription: description,
    longDescription:
      typeof value.longDescription === "string" ? value.longDescription : null,
    originalPrice: parsePrice(value.originalPrice, "originalPrice", index),
    discountedPrice: parsePrice(value.discountedPrice, "discountedPrice", index),
    bookingAmount:
      value.bookingAmount === undefined || value.bookingAmount === null
        ? null
        : parsePrice(value.bookingAmount, "bookingAmount", index),
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
    modules,
    courseModuleIds: Array.isArray(value.courseModuleIds)
      ? value.courseModuleIds.filter(
          (moduleId): moduleId is string => typeof moduleId === "string"
        )
      : [],
    installmentPlans,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
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
      const response = await get<unknown>(
        `courses/${encodeURIComponent(id)}`
      );

      if (isRecord(response) && response.error === "Course not found") {
        return null;
      }

      if (isCourseByIdApiResponse(response)) {
        return parseCourse(response.data, 0);
      }

      throw new Error("Courses API returned an invalid course detail response.");
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      console.error(`Failed to load course ${id}:`, error);
    }

    return null;
  }
}

export const courseService = new CourseService();
