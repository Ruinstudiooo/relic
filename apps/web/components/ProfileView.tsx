import type { Profile } from "@relic/schema";

// inline svg, drawn on the server. no icon package, nothing to download, and it
// renders before any font or js loads. generic shapes, not brand marks.
const ICON_PATHS: Record<string, string> = {
  discord: "M4 5h16v11H9l-5 4V5z M8.5 10.5h.01 M12 10.5h.01 M15.5 10.5h.01",
  github: "M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16",
  x: "M5 5l14 14 M19 5L5 19",
  instagram: "M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M17 7h.01",
  tiktok: "M9 18a3 3 0 1 1 0-6 M9 18V4h4a4 4 0 0 0 4 4",
  youtube: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z M10 9l5 3-5 3z",
  spotify: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M7.5 9.5c3-1 6.5-.7 9 .8 M8 12.7c2.4-.7 5-.4 7 .7 M8.7 15.6c1.8-.4 3.6-.2 5 .5",
  telegram: "M21 4L3 11l6 2 2 6 3-4 4 3z M9 13l9-7",
  email: "M3 6h18v12H3z M3 7l9 6 9-6",
  website: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z",
  custom: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
};

function Icon({ name }: { name: string }) {
  return (
    <svg className="link-icon-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path d={ICON_PATHS[name] ?? ICON_PATHS.custom} />
    </svg>
  );
}

function hostOf(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol === "mailto:") return u.pathname;
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ProfileView({ profile }: { profile: Profile }) {
  const initials = profile.name.trim().slice(0, 1).toUpperCase();

  return (
    <div className="card">
      <div className="avatar-wrap">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="avatar" src={profile.avatar} alt="" width={96} height={96} />
        ) : (
          <div className="avatar avatar-fallback" aria-hidden>
            {initials}
          </div>
        )}
        {profile.status ? <span className="avatar-live" aria-hidden /> : null}
      </div>

      <div className="identity">
        <h1 className="name">{profile.name}</h1>
        {profile.status ? (
          <p className="status">
            <span className="dot" aria-hidden />
            {profile.status}
          </p>
        ) : null}
      </div>

      {profile.bio ? <p className="bio">{profile.bio}</p> : null}

      {profile.links.length > 0 ? (
        <nav className="links" aria-label={`${profile.name}'s links`}>
          {profile.links.map((link, i) => (
            <a
              key={`${i}-${link.url}`}
              className={link.highlight ? "link link--highlight" : "link"}
              href={link.url}
              rel="noopener noreferrer nofollow"
              target="_blank"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="link-icon">
                <Icon name={link.icon} />
              </span>
              <span className="link-text">
                <span className="link-label">{link.label}</span>
                <span className="link-host">{hostOf(link.url)}</span>
              </span>
              <span className="link-arrow" aria-hidden>
                &rarr;
              </span>
            </a>
          ))}
        </nav>
      ) : null}

    </div>
  );
}
