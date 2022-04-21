# CHANGELOG

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
