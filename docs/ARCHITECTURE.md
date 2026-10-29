# architecture

```
packages/schema     zod schema + types
apps/web            next.js app router
  app/[slug]        server component. reads the json, renders the html
  components/       ProfileView is server, Effects is the one client file
  data/profiles     storage for 0.1
  lib/profiles.ts   the only code that touches disk
```

## why it looks like this

Server components until something genuinely needs a browser. ProfileView never
runs on the client, so what it returns *is* the html in the response. Effects is
the only `"use client"` boundary in the tree, and it returns null for profiles
with nothing configured, so a profile with no effects attaches no listeners.

Json files instead of a database. self hosting should be a volume and a restart,
and a profile should be something i can `git diff`. every read goes through
`apps/web/lib/profiles.ts`, so swapping the backing store later is one file and
nothing in `app/` changes. not that postgres is planned. it's just the seam.

Zod at the edge. `getProfile()` parses once and returns null (and logs) when a
file is bad, so malformed json is a 404 instead of a stack trace inside jsx. the
editor will use the same schema, which moves the error to save time rather than
render time.

One css file, custom properties, inline `--accent` / `--radius` / `--bg` on the
main element for per profile theming. 12kb of stylesheet beats a build step, and
it stays readable for people who don't live in frontend.

Effects degrade to nothing. audio is constructed only when `effects.audio`
exists. when autoplay is blocked, and it will be, we wait for the first pointer
or key event instead of showing an unmute prompt nobody reads. particles bail
out under `prefers-reduced-motion`.

ISR at 60s. edit a profile and it's live within a minute with no rebuild. static
only would mean redeploying to change a bio, and no cache at all would hit the
disk on every request.

## sharp edges

- `next build` needs `transpilePackages` for `@relic/schema`. without it the
  failure shows up at build time, not typecheck time, which is annoying to debug.
- standalone output puts `server.js` at `apps/web/server.js`, so the docker cmd
  looks wrong for a monorepo if you don't know that.
- background `type: "video"` parses and then renders as a still frame. either
  implement `<video>` (#4) or take `"video"` out of the schema. don't leave it
  claiming something it doesn't do.
- a page with no client components still pulls the next hydration runtime,
  ~100kB. "works without js" is true, "ships zero js" isn't. yet.

## later

`lib/profiles.ts` is the seam. same four functions, different store underneath.
