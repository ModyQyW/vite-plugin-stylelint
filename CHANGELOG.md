# CHANGELOG

## 3.0.9 (2022-11-24)

- perf: reduce dependencies

## 3.0.8

- fix: fix build

## 3.0.7

- perf: use `config.cacheDir` to get default `cacheLocation`

## 3.0.6

- fix: pass `ctx` to lintFiles method

## 3.0.5

- fix: warning styles

## 3.0.4

- perf: warn when `lintOnStart` is true

## 3.0.3

- perf: import path from `node:path` instead of `path`
- fix: fix `type: "module"` support

## 3.0.2

Just update `peerDependencies` in `package.json`.

## 3.0.1

- fix: fix type

## 3.0.0

This version supports vite@2 and vite@3. The breaking changes are caused by aligning behaviors with `Stylelint` Node.js API.

- feat!: remove `throwOnError` and `throwOnWarning` options (marked as `deprecated` before)
- feat!: `include` and `exclude` options now accept `string | string[]` only to align with `stylelint.lint`
- feat: add `lintOnStart` option
- feat: exclude `virtual:` by default

## 2.3.1

- fix: show error message when importing `stylelint` if possible
- fix: include `shims` into `dist`

## 2.3.0

- feat: support `vite@3`
- feat: ignore virtual modules
- perf: not to add `build.outDir` into `exclude`
- fix: fix `then` handling

## 2.2.3

- fix: revert [bee0a28](https://github.com/ModyQyW/vite-plugin-stylelint/commit/bee0a28b7691090e02d73e979bf62c27510a960d), closes [#8](https://github.com/ModyQyW/vite-plugin-stylelint/issues/8)

## 2.2.2

- fix: remove `allowSyntheticDefaultImports` and `esModuleInterop` in `tsconfig.json`, closes [#5](https://github.com/ModyQyW/vite-plugin-stylelint/issues/5)

## 2.2.1

- fix: try to fix `warning` output
- fix: fix regressions

## 2.2.0

- feat: include `.svelte` files by default

## 2.1.0

- perf: better output format
- feat: add `emitErrorAsWarning` and `emitWarningAsError` options

## 2.0.2

- fix: fix `index.html` dealing

## 2.0.1

- fix: fix `FilterPattern` type may be lost

## 2.0.0

- feat: bring back `throwOnError` and `throwOnWarning`

The plugin recommends `emitError` / `emitWarning` instead of `throwOnError` / `throwOnWarning` now. However, you can stay with `throwOnError` / `throwOnWarning` safely. This is actually a backward-compatible version update.

## 2.0.0-beta.0

- feat: support Stylelint options

### Breaking Changes

- `throwOnError` -> `emitError`
- `throwOnWarning` -> `emitWarning`

## 1.3.0-beta.1

- fix: `cacheLocation` use relative path

## 1.3.0-beta.0

- feat: add `stylelintPath` option

## 1.2.0

- feat: add `cacheLocation` option
- fix: fix script

## 1.1.3

- perf: minify dist by default
- fix: stricter `include`
- fix: ignore `index.html` `<style>`
- fix: fix vue example scripts
- chore: update workflow

## 1.1.2

## 1.1.1

## 1.1.1-beta.0

- fix: Fix internal parameter passing, closes [#1](https://github.com/ModyQyW/vite-plugin-stylelint/issues/1)
- chore: add `package.json` exports

## 1.1.0

- feat: support `.styl` by default
- perf: remove useless code
- chore: remove workflow

## 1.0.4

- fix: fix import

## 1.0.3

- Merge remote-tracking branch 'upstream/main'

## 1.0.2

- chore: update example
- chore: update tsconfig

## 1.0.1

- chore: update `package.json` keywords

## 1.0.0

Initial release.
