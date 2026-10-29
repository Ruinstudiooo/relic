# contributing

**branches** — `main` is protected. branch, open a PR, someone reads it.

**before you push**

```
npm run typecheck
npm test
npm run build
```

CI runs the same three. A PR that fails CI isn't reviewed until it's green.

**style** — no prettier config, just match the file you're editing. no tailwind, no
component library, plain CSS in `app/globals.css`. if you need a dependency, say why
in the PR body; the answer is usually no.

**schema changes** — `packages/schema` is the contract between the renderer and the
future editor. changing it means updating the tests in the same commit, and saying in
the PR what happens to existing profile JSON.

**claiming work** — everything is in [docs/TASKS.md](docs/TASKS.md) and mirrored as
issues. comment on the issue before you start so two people don't build the same thing.
