import { describe, expect, it } from "vitest";
import { getRelativeLuminance, resolveTextColor, FONT_STACKS, FONT_URLS } from "./theming.js";

describe("theming lib", () => {
  describe("getRelativeLuminance", () => {
    it("returns ~0 for pure black (#000000)", () => {
      expect(getRelativeLuminance("#000000")).toBe(0);
    });

    it("returns ~1 for pure white (#ffffff)", () => {
      expect(getRelativeLuminance("#ffffff")).toBeCloseTo(1, 2);
    });

    it("evaluates dark backgrounds as low luminance", () => {
      expect(getRelativeLuminance("#050505")).toBeLessThan(0.05);
      expect(getRelativeLuminance("#1a1a24")).toBeLessThan(0.1);
    });

    it("evaluates light backgrounds as high luminance", () => {
      expect(getRelativeLuminance("#f5f5f7")).toBeGreaterThan(0.8);
      expect(getRelativeLuminance("#ffff00")).toBeGreaterThan(0.8);
    });
  });

  describe("resolveTextColor", () => {
    it("respects explicit 'light' setting", () => {
      expect(resolveTextColor("light", { type: "color", value: "#ffffff", blur: 0 })).toBe("light");
    });

    it("respects explicit 'dark' setting", () => {
      expect(resolveTextColor("dark", { type: "color", value: "#000000", blur: 0 })).toBe("dark");
    });

    it("flips to dark text on light color background when 'auto'", () => {
      expect(resolveTextColor("auto", { type: "color", value: "#ffffff", blur: 0 })).toBe("dark");
      expect(resolveTextColor("auto", { type: "color", value: "#f0f0f0", blur: 0 })).toBe("dark");
      expect(resolveTextColor("auto", { type: "color", value: "#fffaed", blur: 0 })).toBe("dark");
    });

    it("flips to light text on dark color background when 'auto'", () => {
      expect(resolveTextColor("auto", { type: "color", value: "#050505", blur: 0 })).toBe("light");
      expect(resolveTextColor("auto", { type: "color", value: "#111118", blur: 0 })).toBe("light");
    });

    it("defaults to light text for image or video backgrounds when 'auto'", () => {
      expect(resolveTextColor("auto", { type: "image", value: "https://example.com/bg.png", blur: 0 })).toBe("light");
      expect(resolveTextColor("auto", { type: "video", value: "https://example.com/bg.mp4", blur: 0 })).toBe("light");
    });
  });

  describe("fonts", () => {
    it("has font stacks for all supported font options", () => {
      expect(FONT_STACKS.inter).toContain("Inter");
      expect(FONT_STACKS["space-grotesk"]).toContain("Space Grotesk");
      expect(FONT_STACKS["jetbrains-mono"]).toContain("JetBrains Mono");
      expect(FONT_STACKS.system).toContain("system-ui");
    });

    it("does not define webfont url for system font", () => {
      expect(FONT_URLS.system).toBeUndefined();
    });

    it("defines webfont url for inter, space-grotesk, jetbrains-mono", () => {
      expect(FONT_URLS.inter).toBeDefined();
      expect(FONT_URLS["space-grotesk"]).toBeDefined();
      expect(FONT_URLS["jetbrains-mono"]).toBeDefined();
    });
  });
});
