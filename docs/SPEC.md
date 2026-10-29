# spec

what relic is, what it refuses to be, and what "better than guns.lol" is
supposed to mean when someone can actually check it.

## the claim

guns.lol isn't broken. it's a client rendered page, which means your discord
embed is a grey rectangle, crawlers see an empty div, and a bad deploy is a white
screen with no error anywhere. relic is a narrower thing:

1. name, bio and links are in the html on the first byte. js off, page still there.
2. discord, twitter and slack unfurls show something.
3. no watermark, no upsell, no account on a server you don't control.
4. a profile is a file. `data/profiles/ethan.json` is the whole thing. diff it,
   back it up with `cp`, move it to another host.
5. none of the above stops being true when an effect is switched on.

5 is the hard one. if a feature can't fit behind the effects bundle, it goes in
the "no" column until somebody finds a way to do it properly.

## feature matrix

| feature | guns.lol | relic 0.1 | relic 1.0 |
|---|---|---|---|
| name / bio / avatar | yes | yes | yes |
| link list with icons | yes | yes | yes |
| accent + background colour | yes | yes | yes |
| background image / video | yes | image only | yes |
| audio autoplay | yes | yes, gesture fallback | yes + playlist |
| custom cursor | yes | dot / ring | dot / ring / glow / image |
| particles | yes | yes | yes + presets |
| view counter | yes | no | yes, sqlite, no third party |
| custom domain | paid | no | yes |
| editor | yes | no | yes |
| themes / presets | yes | no | yes |
| seo, og tags, `noindex` | weak | yes | yes |
| self hostable | no | yes | yes |
| works with js off | no | yes | yes |

## not doing

- a social network. no feed, no follows, no comments, no friends list.
- a link shortener, or an analytics suite.
- saas billing. if you want to host pages for other people, fork it and run it.
- mobile apps.

## versions

**0.1** render a profile from json, correctly, effects opt in.
**0.2** editor + auth, so the owner of a page doesn't need git access.
**0.3** view counter on sqlite, a handful of presets.
**1.0** custom domains, a docs site, deploy in one command.
