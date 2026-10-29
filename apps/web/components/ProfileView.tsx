import type { Profile } from "@relic/schema";

// unicode glyphs instead of an icon package. renders before any font or js
// loads, and it's one less dependency to audit.
const ICON_GLYPH: Record<string, string> = {
  discord: "\u25c8",
  github: "\u25cf",
  x: "\u2715",
  instagram: "\u25a3",
  tiktok: "\u266a",
  youtube: "\u25b6",
  spotify: "\u266b",
  telegram: "\u2708",
  email: "\u2709",
  website: "\u2197",
  custom: "\u2022",
};

export default function ProfileView({ profile }: { profile: Profile }) {
  const initials = profile.name.trim().slice(0, 1).toUpperCase();

  return (
    <div className="card">
      {profile.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="avatar" src={profile.avatar} alt="" width={96} height={96} />
      ) : (
        <div className="avatar avatar-fallback" aria-hidden>
          {initials}
        </div>
      )}

      <div>
        <h1 className="name">{profile.name}</h1>
        {profile.status ? (
          <p className="status">
            <span className="dot" aria-hidden />
            {profile.status}
          </p>
        ) : null}
      </div>

      {profile.bio ? <p className="bio">{profile.bio}</p> : null}

      <nav className="links" aria-label="links">
        {profile.links.map((link) => (
          <a
            key={`${link.label}-${link.url}`}
            className={link.highlight ? "link link--highlight" : "link"}
            href={link.url}
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            <span>
              <span aria-hidden>{ICON_GLYPH[link.icon] ?? ICON_GLYPH.custom} </span>
              {link.label}
            </span>
            <span className="link-arrow" aria-hidden>
              &rarr;
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
