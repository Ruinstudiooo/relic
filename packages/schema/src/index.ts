import { z } from "zod";

/**
 * The whole point of this package: a profile is a plain JSON file that both the
 * renderer and the editor agree on. If it doesn't parse here, it doesn't ship.
 */

export const LINK_ICONS = [
  "discord", "github", "x", "instagram", "tiktok", "youtube",
  "spotify", "telegram", "email", "website", "custom",
] as const;

export const linkSchema = z.object({
  label: z.string().trim().min(1).max(48),
  url: z.string().url().max(2048),
  icon: z.enum(LINK_ICONS).default("website"),
  highlight: z.boolean().default(false),
});

export const audioSchema = z.object({
  src: z.string().min(1).max(2048),
  volume: z.number().min(0).max(1).default(0.35),
  loop: z.boolean().default(true),
});

export const effectsSchema = z.object({
  audio: audioSchema.nullish(),
  cursor: z.enum(["default", "dot", "ring", "glow"]).default("default"),
  particles: z
    .object({
      enabled: z.boolean().default(false),
      density: z.number().int().min(1).max(160).default(40),
    })
    .default({ enabled: false, density: 40 }),
  tilt: z.boolean().default(false),
});

export const themeSchema = z.object({
  background: z
    .object({
      type: z.enum(["color", "image", "video"]).default("color"),
      value: z.string().min(1).max(2048).default("#050505"),
      blur: z.number().min(0).max(40).default(0),
    })
    .default({ type: "color", value: "#050505", blur: 0 }),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "accent must be a 6-digit hex colour")
    .default("#7c5cff"),
  text: z.enum(["light", "dark", "auto"]).default("light"),
  font: z.enum(["inter", "space-grotesk", "jetbrains-mono", "system"]).default("inter"),
  radius: z.number().int().min(0).max(32).default(12),
});

export const seoSchema = z.object({
  title: z.string().max(70).nullish(),
  description: z.string().max(200).nullish(),
  image: z.string().max(2048).nullish(),
});

export const slugPattern = /^[a-z0-9][a-z0-9-]{1,30}$/;

export const profileSchema = z.object({
  slug: z.string().regex(slugPattern, "slug must be lowercase letters, digits and dashes"),
  name: z.string().trim().min(1).max(40),
  bio: z.string().max(280).default(""),
  avatar: z.string().max(2048).nullish(),
  status: z.string().max(60).nullish(),
  links: z.array(linkSchema).max(24).default([]),
  theme: themeSchema.default({ background: { type: "color", value: "#050505", blur: 0 }, accent: "#7c5cff", text: "light", font: "inter", radius: 12 }),
  effects: effectsSchema.default({ cursor: "default", particles: { enabled: false, density: 40 }, tilt: false }),
  seo: seoSchema.default({}),
  noindex: z.boolean().default(false),
});

export type Profile = z.infer<typeof profileSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
export type Link = z.infer<typeof linkSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Effects = z.infer<typeof effectsSchema>;

export function parseProfile(value: unknown): Profile {
  return profileSchema.parse(value);
}

export function safeParseProfile(value: unknown) {
  return profileSchema.safeParse(value);
}
