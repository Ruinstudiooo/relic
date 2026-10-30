// one place that decides what the site calls itself. everything that has to emit
// an absolute url (robots, sitemap, share cards, canonical tags) goes through here,
// so moving to a real domain is a single env var and not a find and replace.

export const SITE_NAME = "relic";
export const SITE_DESCRIPTION =
  "Self-hosted bio pages. One json file per profile, server rendered, no watermark.";

export function baseUrl() {
  const raw = process.env.RELIC_BASE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
