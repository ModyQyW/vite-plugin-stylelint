# react-ts example

A Vite + React + TypeScript app that runs `vite-plugin-stylelint` against the local build in `packages/core`.

## Run it

```sh
# from the repo root
pnpm dev                                   # keep rebuilding packages/core/dist
pnpm -C examples/react-ts dev              # dev server with the plugin active
pnpm -C examples/react-ts build            # production build
```

The plugin only lints in `serve` with the default options. To watch it run during a build, add `build: true` and `lintOnStart: true` to the `stylelint(...)` call in `vite.config.ts`.

## What to look at

- `vite.config.ts` — the plugin is called with defaults; commented blocks show the `fix`, worker and `customOverlay` variants, plus a recommended combination.
- `stylelint.config.mjs` — extends `stylelint-config-recommended`, which is the config pair for Stylelint 18.
- `src/App.css`, `src/index.css` — the files the plugin lints.

Add a stylelint violation (for example `color: #zzz;`) and start the dev server to see the plugin report it.
