import Link from "next/link";

export const metadata = { title: "not found" };

export default function NotFound() {
  return (
    <main className="page">
      <div className="card">
        <div className="avatar-wrap">
          <div className="avatar avatar-fallback" aria-hidden>
            ?
          </div>
        </div>

        <div className="identity">
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

        <nav className="links" aria-label="where to go">
          <Link className="link" href="/">
            <span className="link-icon" aria-hidden>
              <svg
                className="link-icon-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 11l8-6 8 6" />
                <path d="M6.5 9.5V19h11V9.5" />
              </svg>
            </span>
            <span className="link-text">
              <span className="link-label">every profile</span>
              <span className="link-host">back to the index</span>
            </span>
            <span className="link-arrow" aria-hidden>
              &rarr;
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
