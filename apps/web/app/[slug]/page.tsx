import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import ProfileView from "@/components/ProfileView";
import Effects from "@/components/Effects";
import { resolveTextColor, FONT_STACKS, FONT_URLS } from "@/lib/theming";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return { title: "not found" };

  const title = profile.seo.title ?? profile.name;
  const description = profile.seo.description ?? profile.bio;

  return {
    title,
    description,
    robots: profile.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: profile.seo.image ?? profile.avatar ?? undefined,
      type: "profile",
    },
    twitter: {
      card: profile.seo.image ? "summary_large_image" : "summary",
      title,
      description,
      images: profile.seo.image ?? undefined,
    },
  };
}

export default async function ProfilePage({ params }: Params) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  const textColor = resolveTextColor(profile.theme.text, profile.theme.background);
  const isDarkText = textColor === "dark";

  const fontStack = FONT_STACKS[profile.theme.font] ?? FONT_STACKS.inter;
  const fontUrl = FONT_URLS[profile.theme.font];

  const bg =
    profile.theme.background.type === "color"
      ? profile.theme.background.value
      : "#050505";

  const fg = isDarkText ? "#0a0a0c" : "#f5f5f7";
  const muted = isDarkText ? "#52525b" : "#9a9aa3";
  const border = isDarkText ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.1)";
  const cardBg = isDarkText ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.04)";
  const cardBgHover = isDarkText ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.07)";

  const blurStyle = profile.theme.background.blur
    ? `blur(${profile.theme.background.blur}px)`
    : undefined;

  return (
    <>
      {fontUrl ? (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontUrl} />
        </>
      ) : null}

      <main
        className="page"
        data-theme-text={textColor}
        style={
          {
            "--accent": profile.theme.accent,
            "--radius": `${profile.theme.radius}px`,
            "--bg": bg,
            "--fg": fg,
            "--muted": muted,
            "--border": border,
            "--card-bg": cardBg,
            "--card-bg-hover": cardBgHover,
            "--font": fontStack,
          } as React.CSSProperties
        }
      >
        {profile.theme.background.type === "video" ? (
          <video
            className="backdrop backdrop--video"
            src={profile.theme.background.value}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{ filter: blurStyle }}
          />
        ) : profile.theme.background.type === "image" ? (
          <div
            className="backdrop backdrop--image"
            style={{
              backgroundImage: `url(${profile.theme.background.value})`,
              filter: blurStyle,
            }}
            aria-hidden="true"
          />
        ) : null}

        <ProfileView profile={profile} />
        <Effects effects={profile.effects} />
      </main>
    </>
  );
}
