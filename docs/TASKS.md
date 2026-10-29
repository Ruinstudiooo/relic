# task split

Two of us, six issues, files split so nobody bumps into anybody. every task here
exists as an issue too, so comment on it before you start.

**the rule:** you own the files under your section. need something in the other
person's files? say it in `#dev-chat` or on their issue. a prop rename or a css
token doesn't need a ceremony. anything bigger does, because a silent edit to a
file someone has open in a branch is how merge conflicts get personal.

---

## ji-eun

### A1 · data layer + validation (0.1, blocks nothing)

`apps/web/lib/profiles.ts`, `scripts/validate-profiles.mjs`

`getProfile` and `listProfiles` already read the disk. what they don't do is fail
in a way you can debug.

- memoize reads in dev (slug + mtime key). no cache in prod
- when a profile fails zod, log the flattened error with the filename and path
- `npm run validate` walks `data/profiles/*.json` and exits non-zero on the first
  bad file, printing `file: field.path, message`
- a file that's valid json but not an object (array, `null`, `42`) must not throw
- reject anything over 5mb before parsing it, not after
- run `validate` in ci before `build`

done: `npm run validate` fails on a deliberately broken file with a message you
can act on, passes on `demo.json`, and a corrupt profile is a 404 instead of a 500.

### A2 · editor + auth (0.2)

`apps/web/app/admin/`, `apps/web/lib/auth.ts`

right now changing a bio means a commit. the point of this issue is that the
person who owns the page never opens a terminal.

- `/admin` lists profiles, links to each
- `/admin/[slug]` form: name, bio, status, avatar, links (add / remove / reorder),
  accent, radius, background
- server side `profileSchema` validation *before* the write, not after
- atomic write, temp file then rename, because a crash mid-write shouldn't leave
  a half a profile on disk
- auth is one shared token in `RELIC_ADMIN_TOKEN`, httpOnly + sameSite cookie. no
  user table, i'm not building a login system for one person
- preview is the real `ProfileView`, not a mock that drifts
- `POST /api/revalidate?path=/{slug}` so saving doesn't wait out the 60s ISR

done: create and edit a profile entirely in the browser, and `git diff` shows
`data/profiles/{slug}.json` as the only changed file.

### A3 · deploy (0.1, blocks the tag)

`Dockerfile`, `docker-compose.yml`, `.github/workflows/`, `docs/DEPLOY.md`

the image has never been built. standalone output in a monorepo puts `server.js`
somewhere surprising, which is exactly the class of bug that only shows up on the
first real deploy.

- build it, boot it, confirm `/demo` comes back 200
- `RELIC_DATA_DIR` on a read only mount has to work
- and when the mount is missing entirely, fail loudly. an empty home page is the
  worst possible outcome
- GHCR publish on tag: `ghcr.io/ruinstudiooo/relic:0.1.0`
- `docs/DEPLOY.md` covering compose, reverse proxy + tls, the volume, backup with
  `cp -r`, and how to upgrade
- commit the lockfile so the image is reproducible

done: clean machine, `docker compose up`, working page on `localhost:3000/demo`.

---

## romeo

### B1 · rendering + theming (0.1)

`apps/web/components/ProfileView.tsx`, `apps/web/app/globals.css`,
`apps/web/app/[slug]/page.tsx`

the render works, the theming is half finished. video backgrounds are in the
schema and quietly become a still image, `theme.font` is ignored, `text: auto`
does nothing at all.

- background `type: "video"` → a real `<video autoplay muted loop playsinline>`.
  if that's the wrong call, open a PR removing it from the schema instead. what
  can't happen is leaving it in there doing nothing
- map `theme.font` (inter / space-grotesk / jetbrains-mono / system) onto the css
  var. don't load webfonts, `next/font` or nothing
- `theme.text: "auto"` means read the background luminance and pick a foreground
- 320px wide has to be usable, and 24 links has to scroll rather than overflow
- focus rings that are more than "the accent at 2px", on a dark background with a
  dark accent that's invisible
- heading order and the `aria-label` on the nav. there's one `h1` and it should
  be the name

done: `/demo` plus a stress profile (24 links, 280 char bio, no avatar, video
background) at 320 / 768 / 1440, and tabbing through it doesn't surprise you.

### B2 · effects runtime (0.1)

`apps/web/components/Effects.tsx`

effects work but nothing about them is measured. particles run in a background
tab, audio can't be muted without navigating away, and the cursor hides the real
pointer with no way back.

- audio: mute / play control, remember it in `localStorage`, stop the track on
  unmount
- keep the gesture fallback, but don't stack listeners when the component remounts
- particles: pause on `visibilitychange` and when the canvas leaves the viewport
- particles: scale density down by device pixel ratio. a 3x screen shouldn't cost
  three times as much
- only hide the native cursor while a custom one is actually painted
- the ring should settle when the pointer stops. right now it jitters forever
- every one of these no-ops under `prefers-reduced-motion: reduce`

done: 160 particles holds 60fps on a mid range phone, a background tab burns no
frames, and a profile with no effects attaches nothing.

### B3 · tests (0.1, start here)

`packages/schema/src/*.test.ts`, `apps/web/**/*.test.tsx`

five schema tests, no render tests, and ci has never actually run because there's
no test runner in `apps/web`. i'm not reviewing anything on this repo until ci is
green, so this is the first thing.

- schema: defaults, the 24 / 25 link boundary, bad accent, bad slug, missing name
- render: snapshot `ProfileView` for minimal, full and stress profiles
- render: assert `Effects` returns null when a profile has no effects. that's the
  whole "works without js" promise, it deserves a test rather than a comment
- add vitest + `@testing-library/react` + jsdom to `apps/web`, wired so `npm test`
  at the root still runs everything
- keep the workflow order: typecheck, test, build

done: `npm test` covers schema and both render paths, and ci has been green three
pushes in a row.

---

## 0.1

A1, A3, B1, B2, B3. A2 is 0.2 and doesn't block the tag.

if two people are waiting on one branch, the branch is wrong.
