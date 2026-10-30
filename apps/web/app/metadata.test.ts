import path from "node:path";
import { describe, expect, it } from "vitest";
import robots from "./robots";
import manifest from "./manifest";

describe("robots.txt", () => {
  it("keeps admin and api out of the index", () => {
    const rules = robots().rules;
    const first = (Array.isArray(rules) ? rules[0] : rules) as {
      userAgent?: string | string[];
      disallow?: string | string[];
    };

    expect(first.userAgent).toBe("*");
    expect(first.disallow).toEqual(["/admin", "/api/"]);
  });

  it("points at the sitemap and nothing absolute that isn't a url", () => {
    const sitemap = robots().sitemap as string;
    expect(sitemap.endsWith("/sitemap.xml")).toBe(true);
    expect(() => new URL(sitemap)).not.toThrow();
  });
});

describe("manifest", () => {
  it("is installable", () => {
    const m = manifest();
    expect(m.name).toContain("relic");
    expect(m.short_name).toBe("relic");
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
    expect(m.icons?.length).toBeGreaterThan(0);
  });

  it("uses the same near black as the site", () => {
    expect(manifest().background_color).toBe("#050505");
    expect(manifest().theme_color).toBe("#050505");
  });
});

describe("sitemap.xml", () => {
  it("lists the index and every readable profile", async () => {
    process.env.RELIC_DATA_DIR = path.resolve(__dirname, "../data/profiles");

    // imported after the env var so lib/profiles picks up the fixture directory
    const { default: sitemap } = await import("./sitemap");
    const entries = await sitemap();
    const locs = entries.map((e) => new URL(e.url as string).pathname);

    expect(locs[0]).toBe("/");
    expect(locs).toContain("/demo");
    expect(locs).toContain("/ruinstudio");
  });

  it("gives every url an absolute origin and a lastmod", async () => {
    const { default: sitemap } = await import("./sitemap");
    const entries = await sitemap();

    for (const entry of entries) {
      expect(new URL(entry.url as string).origin).toMatch(/^https?:\/\//);
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
