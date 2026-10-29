import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { profileSchema, slugPattern, type Profile } from "@relic/schema";

/**
 * v0.1 keeps profiles on disk so a self-host is one folder inside a volume.
 * Everything that reads a profile goes through here, so swapping in Postgres
 * later is one file instead of a rewrite.
 */

export const DATA_DIR = process.env.RELIC_DATA_DIR ?? path.join(process.cwd(), "data", "profiles");

export async function getProfile(slug: string): Promise<Profile | null> {
  if (!slugPattern.test(slug)) return null;

  try {
    const raw = await readFile(path.join(DATA_DIR, `${slug}.json`), "utf8");
    const parsed = profileSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error(`[relic] invalid profile "${slug}":`, parsed.error.flatten());
      return null;
    }
    return parsed.data;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function listProfileSlugs(): Promise<string[]> {
  try {
    const files = await readdir(DATA_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.slice(0, -5))
      .filter((s) => slugPattern.test(s))
      .sort();
  } catch {
    return [];
  }
}

export async function listProfiles(): Promise<Profile[]> {
  const slugs = await listProfileSlugs();
  const all = await Promise.all(slugs.map(getProfile));
  return all.filter((p): p is Profile => p !== null);
}
