import Link from "next/link";

export const metadata = { title: "not found" };

export default function NotFound() {
  return (
    <main className="page">
      <div className="card">
        <div className="avatar avatar-fallback" aria-hidden>
          ?
        </div>
        <div>
          <h1 className="name">no such profile</h1>
          <p className="status">
            <span className="dot" aria-hidden />
            404
          </p>
        </div>
        <p className="bio">
          nothing lives at that slug. either it was never made or someone typed it
          wrong.
        </p>
        <nav className="links" aria-label="links">
          <Link className="link" href="/">
            <span>all profiles</span>
            <span className="link-arrow" aria-hidden>
              &rarr;
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
