import { get } from "@/lib/api-method";

interface SuccessStoriesGroup {
  id: string;
  videoIds: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSuccessStoriesGroup(value: unknown): value is SuccessStoriesGroup {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    Array.isArray(value.videoIds) &&
    value.videoIds.every((videoId) => typeof videoId === "string")
  );
}

export default class SuccessStoriesService {
  async getVideoIds(): Promise<string[]> {
    const response = await get<unknown>("success-stories");

    if (
      !isRecord(response) ||
      !Array.isArray(response.data) ||
      !response.data.every(isSuccessStoriesGroup)
    ) {
      throw new Error("Success stories API response must contain valid video IDs.");
    }

    return response.data.flatMap((group) => group.videoIds);
  }
}

export const successStoriesService = new SuccessStoriesService();
