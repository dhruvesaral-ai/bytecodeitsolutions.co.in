import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

