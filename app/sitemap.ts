import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config";
import { pageService } from "@/services/PageService";
import { courseService } from "@/services/CourseService";
import { projectService } from "@/services/ProjectService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/+$/, "");

  // Fetch all entities in parallel with fault tolerance
  const [pages, courses, projects] = await Promise.all([
    pageService.getPages().catch(() => []),
    courseService.getCourses().catch(() => []),
    projectService.getProjects().catch(() => []),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const visitedUrls = new Set<string>();

  // 1. Core high-priority static landing pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/development`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trainings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  for (const route of coreRoutes) {
    sitemapEntries.push(route);
    visitedUrls.add(route.url);
  }

  // 2. Custom CMS routes from Pages API
  for (const page of pages) {
    const rawRoute = page.routeName ? page.routeName.trim().replace(/^\/+/, "") : "";
    if (!rawRoute) continue;

    const lower = rawRoute.toLowerCase();
    const url =
      lower === "home"
        ? `${baseUrl}/`
        : lower === "courses"
        ? `${baseUrl}/courses`
        : lower === "training" || lower === "trainings"
        ? `${baseUrl}/trainings`
        : `${baseUrl}/${rawRoute}`;

    if (!visitedUrls.has(url)) {
      visitedUrls.add(url);
      sitemapEntries.push({
        url,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // 3. Dynamic course detail pages
  for (const course of courses) {
    if (!course.id) continue;
    const url = `${baseUrl}/courses/${encodeURIComponent(course.id)}`;
    if (!visitedUrls.has(url)) {
      visitedUrls.add(url);
      sitemapEntries.push({
        url,
        lastModified: course.updatedAt ? new Date(course.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // 4. Dynamic project showcase pages
  for (const project of projects) {
    if (!project.id) continue;
    const url = `${baseUrl}/development/projects/${encodeURIComponent(project.id)}`;
    if (!visitedUrls.has(url)) {
      visitedUrls.add(url);
      sitemapEntries.push({
        url,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return sitemapEntries;
}
