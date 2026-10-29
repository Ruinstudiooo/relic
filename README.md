# relic

An open source alternative to guns.lol. Self-hosted bio pages that render on the
server, so the link preview works, the crawler works, and the page still exists
when the JavaScript doesn't.

No watermark. No account on someone else's server. One folder of JSON per profile.

```
npm install
npm run dev            # http://localhost:3000/demo
docker compose up      # or this
```

## Why another one

guns.lol and everything shaped like it are single-page apps that draw the page with
JavaScript. That means a Discord embed of your page is a blank rectangle, Google
indexes an empty div, and the whole thing stops working when the bundle breaks.

relic renders the profile as HTML on the server. Effects — audio, particles, custom
cursor — hydrate afterwards and only if the profile asks for them. A profile with
no effects ships zero client JavaScript.

## What works today (v0.1)

- `/{slug}` renders from `data/profiles/{slug}.json`, validated by zod
- theme: accent colour, radius, background colour/image/video, blur
- links with icons and a highlight state
- opt-in effects: dot/ring cursor, particles, autoplay audio with gesture fallback
- per-profile SEO: title, description, OG image, `noindex`
- Docker image + compose file, data dir mounted read-only

## What doesn't (yet)

- no editor UI, no auth, no database — you edit JSON and redeploy
- no analytics or view counter
- no custom domains
- video backgrounds render an `<img>`-style backdrop, not a `<video>` element

## Layout

```
apps/web            next.js app (server components, no tailwind)
  app/[slug]        the page itself
  components        ProfileView (server) + Effects (client, opt-in)
  data/profiles     profile JSON, one file per slug
packages/schema     zod schema shared by renderer and future editor
docs                spec, architecture, task split
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/TASKS.md](docs/TASKS.md) for who is
on what. GPL-3.0.
