import type { Theme } from "@relic/schema";

export const FONT_STACKS: Record<Theme["font"], string> = {
  inter: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  "space-grotesk": '"Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  "jetbrains-mono": '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export const FONT_URLS: Partial<Record<Theme["font"], string>> = {
  inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  "space-grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap",
  "jetbrains-mono": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
};

/**
 * Calculates standard WCAG relative luminance of a 6-digit hex color string.
 * Returns a value between 0 (darkest) and 1 (lightest).
 */
export function getRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return 0;
  }

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Resolves whether the foreground text should be "light" or "dark".
 * When text is "auto", evaluates the background luminance.
 */
export function resolveTextColor(
  textSetting: Theme["text"],
  background: Theme["background"]
): "light" | "dark" {
  if (textSetting === "light" || textSetting === "dark") {
    return textSetting;
  }

  // text: "auto"
  if (background.type === "color") {
    const lum = getRelativeLuminance(background.value);
    // Relative luminance threshold >= 0.45 indicates a light background
    return lum >= 0.45 ? "dark" : "light";
  }

  // Image or video background defaults to light text
  return "light";
}
