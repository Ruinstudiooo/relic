import { describe, expect, it } from "vitest";
import { profileSchema, safeParseProfile } from "./index.js";

const minimal = { slug: "demo", name: "demo" };

describe("profileSchema", () => {
  describe("defaults", () => {
    it("fills defaults for a minimal profile", () => {
      const p = profileSchema.parse(minimal);
      expect(p.slug).toBe("demo");
      expect(p.name).toBe("demo");
      expect(p.bio).toBe("");
      expect(p.avatar).toBeUndefined();
      expect(p.status).toBeUndefined();
      expect(p.links).toEqual([]);
      expect(p.noindex).toBe(false);

      // theme defaults
      expect(p.theme.accent).toBe("#7c5cff");
      expect(p.theme.text).toBe("light");
      expect(p.theme.font).toBe("inter");
      expect(p.theme.radius).toBe(12);
      expect(p.theme.background).toEqual({ type: "color", value: "#050505", blur: 0 });

      // effects defaults
      expect(p.effects.cursor).toBe("default");
      expect(p.effects.particles).toEqual({ enabled: false, density: 40 });
      expect(p.effects.tilt).toBe(false);
      expect(p.effects.audio).toBeUndefined();

      // seo defaults
      expect(p.seo).toEqual({});
    });
  });

  describe("the 24 / 25 link boundary", () => {
    it("accepts exactly 24 links", () => {
      const links = Array.from({ length: 24 }, (_, i) => ({
        label: `link-${i}`,
        url: "https://example.com",
      }));
      const r = safeParseProfile({ ...minimal, links });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.links).toHaveLength(24);
      }
    });

    it("rejects 25 links", () => {
      const links = Array.from({ length: 25 }, (_, i) => ({
        label: `link-${i}`,
        url: "https://example.com",
      }));
      const r = safeParseProfile({ ...minimal, links });
      expect(r.success).toBe(false);
    });
  });

  describe("bad accent", () => {
    it("rejects a named colour", () => {
      const r = safeParseProfile({ ...minimal, theme: { accent: "purple" } });
      expect(r.success).toBe(false);
    });

    it("rejects a 3-digit hex colour", () => {
      const r = safeParseProfile({ ...minimal, theme: { accent: "#fff" } });
      expect(r.success).toBe(false);
    });

    it("rejects a 7-digit hex colour", () => {
      const r = safeParseProfile({ ...minimal, theme: { accent: "#1234567" } });
      expect(r.success).toBe(false);
    });

    it("rejects an accent missing the hash prefix", () => {
      const r = safeParseProfile({ ...minimal, theme: { accent: "7c5cff" } });
      expect(r.success).toBe(false);
    });

    it("rejects non-hex characters", () => {
      const r = safeParseProfile({ ...minimal, theme: { accent: "#zzzzzz" } });
      expect(r.success).toBe(false);
    });

    it("accepts valid 6-digit hex colours", () => {
      const r1 = safeParseProfile({ ...minimal, theme: { accent: "#7c5cff" } });
      const r2 = safeParseProfile({ ...minimal, theme: { accent: "#000000" } });
      const r3 = safeParseProfile({ ...minimal, theme: { accent: "#FFFFFF" } });
      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(r3.success).toBe(true);
    });
  });

  describe("bad slug", () => {
    it("rejects an uppercase slug", () => {
      const r = safeParseProfile({ ...minimal, slug: "Demo" });
      expect(r.success).toBe(false);
    });

    it("rejects a slug starting with a dash", () => {
      const r = safeParseProfile({ ...minimal, slug: "-demo" });
      expect(r.success).toBe(false);
    });

    it("rejects a single-character slug", () => {
      const r = safeParseProfile({ ...minimal, slug: "d" });
      expect(r.success).toBe(false);
    });

    it("rejects an empty slug", () => {
      const r = safeParseProfile({ ...minimal, slug: "" });
      expect(r.success).toBe(false);
    });

    it("rejects special characters and underscores", () => {
      const r1 = safeParseProfile({ ...minimal, slug: "demo_user" });
      const r2 = safeParseProfile({ ...minimal, slug: "demo@site" });
      const r3 = safeParseProfile({ ...minimal, slug: "demo.lol" });
      expect(r1.success).toBe(false);
      expect(r2.success).toBe(false);
      expect(r3.success).toBe(false);
    });

    it("accepts valid slugs with lowercase letters, digits, and dashes", () => {
      const r1 = safeParseProfile({ ...minimal, slug: "demo" });
      const r2 = safeParseProfile({ ...minimal, slug: "user-123" });
      const r3 = safeParseProfile({ ...minimal, slug: "42-answer" });
      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(r3.success).toBe(true);
    });
  });

  describe("missing name", () => {
    it("rejects missing name property", () => {
      const r = safeParseProfile({ slug: "demo" });
      expect(r.success).toBe(false);
    });

    it("rejects empty string name", () => {
      const r = safeParseProfile({ ...minimal, name: "" });
      expect(r.success).toBe(false);
    });

    it("rejects whitespace-only name", () => {
      const r = safeParseProfile({ ...minimal, name: "    " });
      expect(r.success).toBe(false);
    });

    it("accepts and trims valid name", () => {
      const p = profileSchema.parse({ ...minimal, name: "  Romeo  " });
      expect(p.name).toBe("Romeo");
    });
  });

  describe("link urls", () => {
    it("requires valid urls on links", () => {
      const r = safeParseProfile({ ...minimal, links: [{ label: "bad", url: "not a url" }] });
      expect(r.success).toBe(false);
    });
  });
});
