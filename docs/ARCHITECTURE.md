# architecture

## shape

```
packages/schema   zod schema + types. the contract.
apps/web          next.js app router. server components by default.
  app/[slug]      server component: reads profile, renders HTML
  components/     ProfileView is a server component, Effects is "use client"
  data/profiles   one JSON file per slug (v0.1 storage)
```

## decisions

**Server components by default, client only for effects.** `ProfileView` never runs
on the client. `Effects` is the only `"use client"` boundary, and it returns `null`
when a profile has no effects. That's what makes "works without JS" true rather than
a slogan.

**JSON files before a database.** v0.1 storage is a directory. It makes self-hosting
one volume mount, makes a profile diffable, and makes backup `cp -r`. The read path
is isolated in `apps/web/lib/profiles.ts`; when a DB is warranted (v0.3 analytics),
that's the only file that changes.

**zod at the edge, not in the renderer.** Everything crossing into the app is parsed
once in `getProfile()`. A malformed profile returns `null` and logs, instead of
throwing inside JSX. Editors get the same schema, so validation errors happen at save
time rather than at render time.

**No tailwind, no component library.** One CSS file with custom properties, themed
per-profile through inline `--accent` / `--radius` / `--bg`. A 12 KB stylesheet beats
a build step, and it keeps the diff readable for people who aren't frontend devs.

**Effects are opt-in per profile and degrade to nothing.** Audio is created only when
`effects.audio` exists, and autoplay failure falls back to the first pointer/key event
rather than an unmute prompt. Particles bail out entirely under
`prefers-reduced-motion`.

**ISR at 60s.** `revalidate = 60` means a profile edit shows up within a minute without
a rebuild, and the page is still served from cache. Static-only would need a redeploy;
no cache would hammer the disk on every request.

## known sharp edges

- `next build` requires the `@relic/schema` workspace to resolve — hence
  `transpilePackages`.
- Standalone output puts `server.js` at `apps/web/server.js`, which is why the Docker
  `CMD` looks odd for a monorepo.
- Video backgrounds are stored in the schema but rendered as a still frame in v0.1.
  Whoever picks up B1 should either implement `<video>` or narrow the schema — do not
  leave it claiming something it doesn't do.

## future

`lib/profiles.ts` is the seam. Swap file reads for Postgres, keep the same signature,
and nothing in `app/` changes.
