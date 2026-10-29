# spec

What relic is, what it isn't, and what "better than guns.lol" actually means in
measurable terms.

## the claim

guns.lol works. It's also a client-rendered page: your Discord embed is blank, your
page is invisible to crawlers, and a bad deploy means a white screen. The claim relic
makes is narrower and testable:

1. **The page is HTML on first byte.** JS disabled → name, bio and links still render.
2. **Embeds work.** Discord/Twitter/Slack unfurls show title, description and image.
3. **No watermark, no upsell, no account on someone else's infrastructure.**
4. **A profile is a file.** `data/profiles/ethan.json` is the source of truth, diffable
   in git, portable, no export button needed.

If a feature can't be delivered without breaking 1 or 2, it goes behind the effects
bundle or it doesn't ship.

## feature matrix

| feature | guns.lol | relic v0.1 | relic v1.0 |
|---|---|---|---|
| name / bio / avatar | yes | yes | yes |
| link list w/ icons | yes | yes | yes |
| accent + background colour | yes | yes | yes |
| background image / video | yes | image only | yes |
| audio autoplay | yes | yes (gesture fallback) | yes + playlist |
| custom cursor | yes | dot / ring | dot / ring / glow / image |
| particles | yes | yes | yes + presets |
| view counter | yes | no | yes (self-hosted, no third-party) |
| custom domain | paid | no | yes |
| editor UI | yes | no | yes |
| themes / presets | yes | no | yes |
| SEO / OG / `noindex` | weak | yes | yes |
| self-hostable | no | yes | yes |
| works without JS | no | yes | yes |

## non-goals

- a social network. no feed, no follows, no comments.
- a link shortener or analytics suite.
- multi-tenant SaaS billing. if someone wants to host it for others, that's their fork.
- mobile apps.

## v1.0 scope

v0.1 = render a profile from JSON, correctly, with effects opt-in.
v0.2 = editor UI + auth, so a non-technical owner can edit their own page.
v0.3 = view counter (sqlite, no third party) + presets.
v1.0 = custom domains, docs site, one-command deploy.
