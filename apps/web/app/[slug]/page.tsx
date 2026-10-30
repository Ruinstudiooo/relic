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

  // a profile can point at its own image. when it doesn't, leave the key out
  // entirely so the generated opengraph-image.tsx card is used. setting it to
  // undefined would overwrite that card with nothing.
  const image = profile.seo.image ?? profile.avatar ?? null;

  return {
    title,
    description,
    alternates: { canonical: `/${profile.slug}` },
    robots: profile.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: `/${profile.slug}`,
      type: "profile",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
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
