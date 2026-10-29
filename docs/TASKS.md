# task split

Two people, six tasks, no file collisions. Everything below is also an issue; comment
on the issue before you start.

**rule:** you own the files listed under your task. Need to change something in the
other person's files? comment on their issue or say it in `#dev-chat`. One-line
changes (a prop name, a CSS token) don't need a ceremony — anything bigger does.

---

## ji-eun

### A1 — data layer + profile validation (v0.1, blocks nothing)
`apps/web/lib/profiles.ts`, `scripts/validate-profiles.mjs`

- `getProfile` / `listProfiles` already read the disk; harden them: cache reads in
  dev, log the exact zod path when a profile is invalid
- add `npm run validate` that walks `data/profiles/*.json` and fails non-zero on the
  first invalid file, with the file name and the field path
- handle a profile file that's valid JSON but not an object, and one that's 5 MB

**done when** `npm run validate` catches a broken file, CI runs it, and a bad profile
shows 404 instead of a 500.

### A2 — editor UI + auth (v0.2)
`apps/web/app/admin/`, `apps/web/lib/auth.ts`

- `/admin` lists profiles, `/admin/[slug]` edits one field-by-field
- writes go through zod before touching disk; no partial writes (write temp, rename)
- auth: single shared token from `RELIC_ADMIN_TOKEN`, httpOnly cookie, no user table
- preview pane renders the real `ProfileView`

**done when** you can create a profile from the browser and `git diff` shows only the
JSON file changed.

### A3 — deploy (v0.1, blocks release)
`Dockerfile`, `docker-compose.yml`, `.github/workflows/`

- verify the standalone image actually boots and serves `/demo`
- publish to GHCR on tag
- write `docs/DEPLOY.md`: docker compose, reverse proxy + TLS, volume, what breaks
  when `RELIC_DATA_DIR` is unwritable

**done when** a clean machine can `docker compose up` and get a working page.

---

## romeo

### B1 — render engine + theming (v0.1)
`apps/web/components/ProfileView.tsx`, `apps/web/app/globals.css`, `app/[slug]/page.tsx`

- finish theming: background image and video, per-profile font from the schema enum,
  `text: auto` reading the background luminance
- responsive down to 320px; card never overflows with 24 links
- accessibility: focus rings, `prefers-reduced-motion`, alt handling, heading order

**done when** the demo page and a stress profile (24 links, long bio, no avatar) both
look right at 320 / 768 / 1440, and keyboard tab order is sane.

### B2 — effects runtime (v0.1)
`apps/web/components/Effects.tsx`

- audio: gesture fallback already exists — add a mute/play control, persist the choice
  in `localStorage`, stop the track on unmount
- cursor: ring lag tuning, hide the native cursor only when a custom one is active
- particles: cap the frame cost, pause when the tab is hidden or the element is
  off-screen
- everything must no-op when `prefers-reduced-motion: reduce`

**done when** a mid-range phone holds 60fps with 160 particles, and a profile with no
effects ships no listeners.

### B3 — tests (v0.1, starts now)
`packages/schema/src/*.test.ts`, `apps/web/**/*.test.tsx`

- schema: defaults, boundary values, rejections (there are four tests already)
- render: snapshot `ProfileView` for the minimal / full / stress profiles
- effects: assert the component returns null when no effects are configured
- CI must be green on `main` before v0.1 is tagged

**done when** `npm test` covers the schema and both render paths, and CI has been green
for three consecutive pushes.

---

## v0.1 milestone

A1 + A3 + B1 + B2 + B3. A2 is v0.2 and does not block the tag.
