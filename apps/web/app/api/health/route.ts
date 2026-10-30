import { NextResponse } from "next/server";
import { listProfiles } from "@/lib/profiles";

// for docker and anything else that needs to know the process is alive and can
// still read the data volume. a 200 with an empty profile list is fine, a 500
// means the volume is gone and the container should be replaced.
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();

  try {
    const profiles = await listProfiles();
    return NextResponse.json(
      {
        ok: true,
        profiles: profiles.length,
        uptime: Math.round(process.uptime()),
        readMs: Date.now() - started,
      },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    console.error("[relic] health check failed:", err);
    return NextResponse.json(
      { ok: false, error: "data directory unreadable" },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }
}
