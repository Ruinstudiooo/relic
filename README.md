# relic

bio pages you host yourself. an alternative to guns.lol, written in next.js.

the point is server rendering. a guns.lol page is drawn by javascript, so when
someone pastes your link in discord the embed is a blank rectangle and google
indexes an empty div. relic sends the name, bio and links as html. effects load
afterwards, and only if the profile asks for them.

no watermark, no account on my server, one json file per profile.

```
npm install
npm run dev          # localhost:3000/demo
docker compose up    # same thing in a container
```

## why

guns.lol is fine, honestly. i just got tired of a page that stops existing when
the bundle doesn't load.

so `app/[slug]/page.tsx` is a server component, `ProfileView` is a server
component, and the only `"use client"` in the tree is `Effects`, which returns
null when a profile has nothing to play with.

## what works in 0.1

- `/{slug}` from `data/profiles/{slug}.json`, parsed with zod
- accent colour, corner radius, background colour / image, blur
- links with icons, one of them allowed to be highlighted
- effects, opt in: dot or ring cursor, particles, audio
- per profile title, description, og image, `noindex`
- docker image and compose file, data dir mounted read only

## what doesn't

- no editor, no login, no database. edit the json and redeploy
- no view counter, no custom domains
- video backgrounds get stored and then drawn as a still frame. #4 is where that
  either becomes a `<video>` or stops being an option in the schema
- next ships its hydration runtime even on a page with no client components.
  ~100kB. i'm not going to pretend otherwise, and getting it to zero is 0.2 work

## layout

```
apps/web
  app/[slug]        the page
  components        ProfileView (server) + Effects (client, opt in)
  data/profiles     json, one file per slug
packages/schema     zod schema shared by the renderer and the future editor
docs                spec, architecture, task split
```

## contributing

split is in [docs/TASKS.md](docs/TASKS.md), rules are in
[CONTRIBUTING.md](CONTRIBUTING.md). gpl-3.0.
