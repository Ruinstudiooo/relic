import { describe, expect, it } from "vitest";
import { profileSchema, safeParseProfile } from "./index.js";

const minimal = { slug: "demo", name: "demo" };

describe("profileSchema", () => {
  it("fills defaults for a minimal profile", () => {
    const p = profileSchema.parse(minimal);
    expect(p.theme.accent).toBe("#7c5cff");
    expect(p.effects.cursor).toBe("default");
    expect(p.links).toEqual([]);
    expect(p.noindex).toBe(false);
  });

  it("rejects an uppercase slug", () => {
    const r = safeParseProfile({ ...minimal, slug: "Demo" });
    expect(r.success).toBe(false);
  });

  it("rejects a malformed accent colour", () => {
    const r = safeParseProfile({ ...minimal, theme: { accent: "purple" } });
    expect(r.success).toBe(false);
  });

  it("caps links at 24", () => {
    const links = Array.from({ length: 25 }, (_, i) => ({ label: `l${i}`, url: "https://example.com" }));
    const r = safeParseProfile({ ...minimal, links });
    expect(r.success).toBe(false);
  });

  it("requires https-ish urls on links", () => {
    const r = safeParseProfile({ ...minimal, links: [{ label: "bad", url: "not a url" }] });
    expect(r.success).toBe(false);
  });
});
