import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // nothing exists behind these yet. listing them now means a 404 later
        // doesn't get crawled as a page when the editor lands.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
