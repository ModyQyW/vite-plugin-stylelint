# vite-plugin-stylelint

A Vite plugin that runs Stylelint against the modules Vite processes. Published from a monorepo whose only published package is `packages/core`.

## Project

- **Runtime.** Repo toolchain needs Node `^22.22.2 || >=24.15.0` (root `engines`); `.node-version` is `24` and CI tests 22, 24 and 26. The published package declares `engines.node: ">=18"` because it still works with Stylelint 13–16 — do not raise that floor to match the toolchain.
- **Package manager.** pnpm 12, pinned by `packageManager: pnpm@12.18.0`; `preinstall` runs `only-allow pnpm`. Settings live in `pnpm-workspace.yaml`, not `.npmrc` (pnpm 12 reads only auth, registry, TLS, proxy and `local-address` from `.npmrc`).
- **Dependency versions.** Every `dependencies`/`devDependencies` entry is written as `catalog:` (peer ranges and `workspace:*` are the exceptions). Bump the version in the `catalog:` map of `pnpm-workspace.yaml`; editing a member's `package.json` version string breaks the convention.
- **Build.** tsdown emits two entries from `packages/core/tsdown.config.ts`: `index.ts` + `worker.ts` as ESM and CJS with `.d.mts`/`.d.cts`, and `client/runtime.ts` as a browser-only ESM bundle (`dist/client-runtime.js`, no types) that `index.ts` inlines via `readFileSync`. The public entry is dual: `exports["."].import` (ESM) and `exports["."].require` (CJS), each with its own types file.
- **Peer dependencies** (`packages/core`): `stylelint ^13 || ^14 || ^15 || ^16 || ^17 || ^18`, `vite ^2 … ^8`, plus optional `@types/stylelint`, `postcss`, `rollup`, `rolldown`. Widening a peer range is a user-facing change.
- **Workspace.** `docs`, `packages/*`, `examples/*`. Only `packages/core` is published; `docs` and `examples/react-ts` are private. `dist/` is git-ignored and never committed.

## Commands

```bash
pnpm install           # workspace install; pnpm 12 verifies the lockfile against supply-chain policy
pnpm build             # rimraf packages/*/dist, then tsdown per package, then build-post
pnpm dev               # tsdown --watch for packages/* — required while working on an example
pnpm test              # vitest run (no config file; picks up **/*.test.ts)
pnpm test:coverage     # same, with @vitest/coverage-v8
pnpm typecheck         # tsc --noEmit, then tsc --noEmit inside docs/
pnpm check             # ultracite check (Biome): report only
pnpm fix               # ultracite fix (Biome): apply safe fixes
pnpm docs:dev          # rspress dev for docs/
pnpm docs:build        # rspress build; also emits llms.txt and one .md per page
pnpm -C examples/react-ts run build   # needs `pnpm build` first, see below
```

`pnpm build` must run before any example builds or runs: the example resolves `vite-plugin-stylelint` through `packages/core`'s `exports`, which points at `dist/`, so an unbuilt tree fails with `TS2307: Cannot find module 'vite-plugin-stylelint'`.

## Architecture

| Module | Role |
| --- | --- |
| `packages/core/src/index.ts` | The Vite plugin object. Wires `apply`, `configResolved`, `configureServer`, `buildStart`, `resolveId`, `load`, `transformIndexHtml`, `transform`, `buildEnd`; owns the overlay handshake state and the worker instance. |
| `packages/core/src/linter.ts` | The deep module. `createLinter(options, adapters)` returns `{ lint, lintAll }`; also exports `filterResults`, `buildOverlayPayload`, `OverlayManager`, `shouldIgnoreModule` for testing. Knows Stylelint plus the Vite plugin-context type; no Vite hooks. |
| `packages/core/src/worker.ts` | Worker adapter, under 40 lines. Forwards `parentPort` messages to `linter.lint(id)` and overlay payloads back to the main thread. |
| `packages/core/src/client/preamble.ts` | Builds the inline `<script>` that imports the runtime virtual module and calls `inject()`. |
| `packages/core/src/client/runtime.ts` | Browser side of the custom overlay. Standalone ESM, Shadow DOM, zero imports at runtime. |
| `packages/core/src/types.ts` | Public option types. JSDoc here is bilingual (English block, then Chinese) and is the source the docs site mirrors. |
| `packages/core/src/constants.ts` | Plugin name, Stylelint severity strings, WebSocket event names, virtual module IDs, `PLUGIN_OPTION_KEYS`. |
| `packages/core/src/utils.ts` | `getOptions`, which turns user options into the fully-defaulted shape. |

### Options share one namespace with Stylelint

`StylelintPluginOptions extends StylelintLinterOptions`, so plugin options and Stylelint options live in one flat object. `getStylelintLinterOptions` filters out everything listed in `PLUGIN_OPTION_KEYS` and forwards the rest to `stylelint.lint()`. Adding a plugin option therefore takes four edits:

1. the field in `StylelintPluginOptions` (`types.ts`), with bilingual JSDoc,
2. its default in `getOptions` (`utils.ts`),
3. its name in `PLUGIN_OPTION_KEYS` (`constants.ts`) — miss this and the option is silently forwarded to Stylelint,
4. `filterResults` plus a test if it affects filtering or severity.

`cache`, `cacheLocation` and `fix` are deliberately absent from `PLUGIN_OPTION_KEYS`: they are real Stylelint options the plugin passes through.

### `context` is per call, never captured

Vite runs `transform` hooks concurrently. The linter takes the `PluginContext` as an argument on every `lint`/`lintAll` call; a captured closure would be overwritten between concurrent lints and emit to the wrong module. The worker omits it entirely and emits to stdout.

### Custom overlay handshake

Under `serve` with `customOverlay` on, `index.ts` injects the runtime via `transformIndexHtml`, then waits for a `vite:stylelint:runtime-loaded` ping over the Vite WebSocket before pushing `vite:stylelint:overlay` payloads. Payloads arriving before the ping are buffered in `pendingPayload` and replayed. No ping within `OVERLAY_DEGRADE_GRACE_MS` (2000 ms) means a DOM-less environment (mini-program, SSR, headless): warn once, stop pushing, keep printing to the terminal. In this mode `index.ts` passes an `emit` adapter that writes to `console.log`, so `report` never reaches `context.error`/`context.warn` — doing so would trigger the native overlay the custom one replaces.

The WebSocket event names are inlined as string literals in `client/runtime.ts` (it must bundle without importing node-side modules) **and** exported from `constants.ts`. Change both or the handshake silently stops matching.

### `filterResults` mutates its input

`filterResults(linterResult, options)` returns `{ results, textType }` with no I/O and no Stylelint instance, which is why it carries the emit-filter tests — but it does clear `linterResult.errored` when `emitError` is off, so the severity channel matches the filtered result. Do not treat it as pure, and do not reuse a `LinterResult` object across calls.

### Worker color

A worker's stdout is a pipe, so picocolors disables color at module load. `getWorkerEnv` forwards the main thread's color support, honors `NO_COLOR`/`FORCE_COLOR`, and forces color only when the parent is a TTY.

### `.vue` / `.svelte` differ from the ESLint plugin

Stylelint lints `<style>` blocks, so `x.vue?type=style` / `y.svelte?type=style` submodules are kept and plain `.vue`/`.svelte` modules are ignored. See `shouldIgnoreModule`.

## Conventions

- **Lint.** Biome through `ultracite` (`biome.json` extends `ultracite/biome/core` and `ultracite/biome/react`, trailing commas everywhere). `biome.json` excludes `**/examples` and `**/.pi`. There is no git hook: CI runs `pnpm check` and `.vscode/settings.json` formats on save, nothing else enforces it locally.
- **Comments and docs.** Public option JSDoc in `types.ts` and the guide pages in `docs/docs/*/guide/options.md` are mirrored in English and Chinese; change both in the same commit. File comments are English.
- **Tests.** Vitest at the behavior boundary. `linter.test.ts` covers the pure-ish helpers with hand-built `LinterResult` fixtures. `linter.integration.test.ts` runs the installed Stylelint against a temp directory — extend it rather than mocking Stylelint's API shape, since it is what catches a Stylelint major breaking the plugin. Use `mkdtemp` + `tmpdir` and clean up in `afterEach`.
- **Docs site.** Rspress, content root `docs/docs/`, one directory per locale (`en`, `zh`). Nav and sidebar come from `_nav.json` and `_meta.json` in each locale directory, not from the config. `en` is the default locale so its routes carry no prefix; `zh` keeps `/zh/`. Page URLs are stable — `/guide/*` and `/zh/guide/*` — so keep file names when editing.
- **Commits.** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`). `pnpm release` runs lerna version on `main` after `preversion` (`fix`, `typecheck`, `test`).
