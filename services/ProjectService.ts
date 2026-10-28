import { MEDIA_BASE_URL } from "@/config";
import { ApiRequestError, get } from "@/lib/api-method";

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  imgUrl: string;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
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
    throw new Error(`Invalid project media URL: ${url}`);
  }
}

function parseProject(value: unknown, index: number): Project {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.imgUrl !== "string"
  ) {
    throw new Error(`Projects API returned an invalid project at item ${index}.`);
  }

  return {
    id: value.id,
    name: value.name,
    shortDescription:
      typeof value.shortDescription === "string" ? value.shortDescription : "",
    longDescription:
      typeof value.longDescription === "string" ? value.longDescription : null,
    imgUrl: resolveMediaUrl(value.imgUrl),
    videoUrl:
      typeof value.videoUrl === "string"
        ? resolveMediaUrl(value.videoUrl)
        : null,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : "",
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : "",
  };
}

export default class ProjectService {
  async getProjects(): Promise<Project[]> {
    try {
      const response = await get<unknown>("projects");

      if (isRecord(response) && Array.isArray(response.data)) {
        const projects = response.data.map(parseProject);
        projects.sort((a, b) => {
          const at = Date.parse(a.createdAt || a.updatedAt) || 0;
          const bt = Date.parse(b.createdAt || b.updatedAt) || 0;
          if (at !== bt) return at - bt;
          return a.id.localeCompare(b.id);
        });
        return projects;
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }

    return [];
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const response = await get<unknown>(`projects/${encodeURIComponent(id)}`);

      if (isRecord(response) && isRecord(response.data)) {
        return parseProject(response.data, 0);
      }
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      console.error(`Failed to load project ${id}:`, error);
    }

    return null;
  }
}

export const projectService = new ProjectService();
