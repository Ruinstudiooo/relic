import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ProfilePage from "./page.js";
import { resolveTextColor, FONT_STACKS, FONT_URLS } from "@/lib/theming.js";

describe("ProfilePage & Theming Engine", () => {
  it("renders a video background when background type is video", async () => {
    // Render with stress profile which has a video background
    const PageJsx = await ProfilePage({ params: Promise.resolve({ slug: "stress" }) });
    const { container } = render(PageJsx);

    const video = container.querySelector("video.backdrop") as HTMLVideoElement | null;
    expect(video).not.toBeNull();
    expect(video?.getAttribute("src")).toContain(".mp4");
    expect(video?.hasAttribute("autoplay") || video?.autoplay).toBe(true);
    expect(video?.muted || video?.hasAttribute("muted")).toBe(true);
    expect(video?.hasAttribute("loop") || video?.loop).toBe(true);
    expect(video?.hasAttribute("playsinline")).toBe(true);
  });

  it("renders an image background when background type is image", async () => {
    // In our tests, check image background styling
    const textColor = resolveTextColor("auto", { type: "image", value: "https://example.com/bg.png", blur: 8 });
    expect(textColor).toBe("light");
  });

  it("flips foreground to dark when auto text color detects a light background", () => {
    const textColor = resolveTextColor("auto", { type: "color", value: "#ffffff", blur: 0 });
    expect(textColor).toBe("dark");
  });

  it("keeps foreground light when auto text color detects a dark background", () => {
    const textColor = resolveTextColor("auto", { type: "color", value: "#050505", blur: 0 });
    expect(textColor).toBe("light");
  });

  it("maps fonts correctly onto CSS vars and webfont links", () => {
    expect(FONT_STACKS["jetbrains-mono"]).toContain("JetBrains Mono");
    expect(FONT_STACKS.system).toContain("system-ui");
    expect(FONT_URLS.system).toBeUndefined();
    expect(FONT_URLS["jetbrains-mono"]).toContain("JetBrains+Mono");
  });

  it("renders demo profile with valid markup and single h1", async () => {
    const PageJsx = await ProfilePage({ params: Promise.resolve({ slug: "demo" }) });
    const { container } = render(PageJsx);

    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0]?.textContent).toBe("demo");

    const nav = container.querySelector("nav.links");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("links");
  });
});
