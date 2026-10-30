import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profiles";
import { ogCard, OG_SIZE } from "@/lib/og";

export const alt = "profile on relic";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    return new ImageResponse(
      ogCard({
        eyebrow: "404",
        title: "no such profile",
        subtitle: `nothing is hosted at /${slug}.`,
        footer: `/${slug}`,
        accent: "#7c5cff",
      }),
      size
    );
  }

  return new ImageResponse(
    ogCard({
      eyebrow: profile.status ?? `/${profile.slug}`,
      title: profile.name,
      subtitle: profile.seo.description ?? profile.bio,
      footer: `/${profile.slug}`,
      accent: profile.theme.accent,
    }),
    OG_SIZE
  );
}
