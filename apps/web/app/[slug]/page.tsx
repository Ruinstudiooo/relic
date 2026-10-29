import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import ProfileView from "@/components/ProfileView";
import Effects from "@/components/Effects";

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

  const backdrop =
    profile.theme.background.type === "color"
      ? undefined
      : { backgroundImage: `url(${profile.theme.background.value})` };

  return (
    <main
      className="page"
      style={
        {
          "--accent": profile.theme.accent,
          "--radius": `${profile.theme.radius}px`,
          "--bg": profile.theme.background.type === "color" ? profile.theme.background.value : "#050505",
        } as React.CSSProperties
      }
    >
      {backdrop ? (
        <div
          className="backdrop"
          style={{ ...backdrop, filter: `blur(${profile.theme.background.blur}px)` }}
          aria-hidden
        />
      ) : null}

      <ProfileView profile={profile} />
      <Effects effects={profile.effects} />
    </main>
  );
}
