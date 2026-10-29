import Link from "next/link";
import { listProfiles } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await listProfiles();

  return (
    <main className="page">
      <div className="card">
        <h1 className="name">relic</h1>
        <p className="bio">
          self-hosted bio pages. open source, no watermark, and the page still renders when the
          javascript doesn&apos;t.
        </p>
        <div className="links">
          {profiles.length === 0 ? (
            <p className="bio">no profiles yet — drop a json file into data/profiles.</p>
          ) : (
            profiles.map((p) => (
              <Link key={p.slug} className="link" href={`/${p.slug}`}>
                <span>{p.name}</span>
                <span className="link-arrow">/{p.slug}</span>
              </Link>
            ))
          )}
        </div>
        <a className="footer" href="https://github.com/Ruinstudiooo/relic">
          source
        </a>
      </div>
    </main>
  );
}
