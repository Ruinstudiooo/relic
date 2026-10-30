import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE } from "@/lib/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const alt = "relic — self-hosted bio pages";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: "self-hosted",
      title: "relic",
      subtitle: SITE_DESCRIPTION,
      footer: "one json file per profile",
      accent: "#7c5cff",
    }),
    size
  );
}
