"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // the digest is the only thing that ties this screen to the server log line
    console.error("[relic]", error.digest ?? "", error);
  }, [error]);

  return (
    <main className="page">
      <div className="card">
        <div className="avatar-wrap">
          <div className="avatar avatar-fallback" aria-hidden>
            !
          </div>
        </div>

        <div className="identity">
          <h1 className="name">that broke</h1>
          <p className="status">
            <span className="dot" aria-hidden />
            500
          </p>
        </div>

        <p className="bio">
          something threw while rendering this page. the digest below is the same
          one in the server log
          {error.digest ? ` (${error.digest})` : ""}.
        </p>

        <div className="links">
          <button
            className="link"
            onClick={reset}
            type="button"
            style={{ width: "100%", font: "inherit", color: "inherit", cursor: "pointer" }}
          >
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
                <path d="M20 12a8 8 0 1 1-2.6-5.9" />
                <path d="M20 4v5h-5" />
              </svg>
            </span>
            <span className="link-text">
              <span className="link-label">try again</span>
              <span className="link-host">same page, fresh render</span>
            </span>
            <span className="link-arrow" aria-hidden>
              &rarr;
            </span>
          </button>

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
        </div>
      </div>
    </main>
  );
}
