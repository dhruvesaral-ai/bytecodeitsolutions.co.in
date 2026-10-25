import { MEDIA_BASE_URL } from "@/config";
import { get } from "@/lib/api-method";

export interface StudentTestimonial {
  id: string;
  name: string;
  profile_img: string;
  company_name: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function resolveMediaUrl(url: string): string {
  try {
    return new URL(url, `${MEDIA_BASE_URL.replace(/\/+$/, "")}/`).toString();
  } catch {
    return url;
  }
}

function isStudentTestimonial(value: unknown): value is StudentTestimonial {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.profile_img === "string" &&
    typeof value.company_name === "string"
  );
}

export default class TestimonialService {
  async getTestimonials(): Promise<StudentTestimonial[]> {
    try {
      const response = await get<{ data?: unknown[] }>("testimonials");
      if (response && isRecord(response) && Array.isArray(response.data)) {
        return response.data
          .filter(isStudentTestimonial)
          .map((item) => ({
            ...item,
            profile_img: resolveMediaUrl(item.profile_img),
          }));
      }
    } catch {
      // Backend is unavailable
    }
    return [];
  }
}

export const testimonialService = new TestimonialService();
