import type { MetadataRoute } from "next";
import { listProfiles } from "@/lib/profiles";
import { baseUrl } from "@/lib/site";

// regenerated every hour. a profile added to the volume shows up here without a
// rebuild, which is the whole point of running it self hosted.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const profiles = await listProfiles();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  for (const profile of profiles) {
    if (profile.noindex) continue;
    entries.push({
      url: `${base}/${profile.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
