# contributing

`main` is protected. branch, open a PR, one of us reads it.

before you push:

```
npm run typecheck
npm test
npm run build
```

ci runs the same three in that order. red ci doesn't get reviewed, so fix it
before you ask.

no prettier config, no tailwind, no component library. plain css lives in
`app/globals.css`. match whatever file you're editing. don't reformat a file you changed one line
in. the diff is the only thing anyone reads in a hurry. new dependency? put the reason in the PR body. the answer is usually no,
but it isn't always.

`packages/schema` is the contract between the renderer and the editor. if you
change it, the tests change in the same commit, and the PR says what happens to
json files people already have on disk.

claim work by commenting on the issue before you start. otherwise two of us
build the same button twice and one of us throws it away.
