import Link from "next/link";
import { listProfiles } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await listProfiles();

  return (
    <main className="page">
      <div className="card">
        <div className="identity">
          <h1 className="name">relic</h1>
          <p className="status">
            <span className="dot" aria-hidden />
            {profiles.length} {profiles.length === 1 ? "profile" : "profiles"} hosted
          </p>
        </div>

        <p className="bio">
          self-hosted bio pages. open source, no watermark, and the page still
          renders when the javascript doesn&apos;t.
        </p>

        <nav className="links" aria-label="profiles">
          {profiles.length === 0 ? (
            <p className="bio">no profiles yet. drop a json file into data/profiles.</p>
          ) : (
            profiles.map((profile, i) => (
              <Link
                key={profile.slug}
                className="link"
                href={`/${profile.slug}`}
                style={
                  { "--accent": profile.theme.accent, "--i": i } as React.CSSProperties
                }
              >
                <span className="link-icon" aria-hidden>
                  <span style={{ fontWeight: 650, fontSize: 15, letterSpacing: "-0.01em" }}>
                    {profile.name.trim().slice(0, 1).toUpperCase()}
                  </span>
                </span>
                <span className="link-text">
                  <span className="link-label">{profile.name}</span>
                  <span className="link-host">/{profile.slug}</span>
                </span>
                <span className="link-arrow" aria-hidden>
                  &rarr;
                </span>
              </Link>
            ))
          )}
        </nav>

        <a className="footer" href="https://github.com/Ruinstudiooo/relic">
          source
        </a>
      </div>
    </main>
  );
}
