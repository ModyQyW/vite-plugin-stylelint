---
description: "Every option the plugin accepts: shared Stylelint options such as fix and cache, plus plugin options for file matching, workers, the overlay, and error reporting."
---

# Options

The plugin takes Stylelint [shared options](https://stylelint.io/user-guide/options) and its own extra options in one object. The plugin always overrides the `files` option.

## Shared Options

The sections below cover the most common ones. The link above covers the rest.

### `fix`

- Type: `boolean`
- Default: `false`

Whether Stylelint rewrites the problems it can fix.

### `cache`

- Type: `boolean`
- Stylelint default: `false`
- Plugin default: `true`

Whether to enable the cache. Stylelint disables it by default. The plugin enables it for speed.

### `cacheLocation`

- Type: `string`
- Default: `.stylelintcache`

The path to the cache file.

## Extra Options

### `test`

- Type: `boolean`
- Default: `false`

Whether to run Stylelint in `test` mode. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest).

### `dev`

- Type: `boolean`
- Default: `true`

Whether to run Stylelint under `serve`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface).

### `build`

- Type: `boolean`
- Default: `false`

Whether to run Stylelint under `build`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface).

### `include`

- Type: `string | string[]`
- Default: `["src/**/*.{css,scss,sass,less,styl,vue,svelte}"]`

The files to lint. Most projects never change it. Change it only when the `include` and `exclude` ranges overlap.

With the default settings, the plugin calls [stylelint.lint](https://stylelint.io/user-guide/node-api/) only in the `transform` hook. It builds a [filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) from this value. The filter decides whether to call Stylelint, and what to pass. So the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.

When `lintOnStart` is on, the plugin also calls [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `buildStart` hook. There it passes the value straight through as `files`. So the value must also be a glob that Stylelint understands. Stylelint 18 resolves globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).

When `lintDirtyOnly` is off, the plugin passes the value to [stylelint.lint](https://stylelint.io/user-guide/node-api/) on every call. So the value must also be a glob that Stylelint understands. Stylelint 18 resolves globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).

### `exclude`

- Type: `string | string[]`
- Default: `['node_modules', 'virtual:']`

The files not to lint. Most projects never change it. Change it only when the `include` and `exclude` ranges overlap.

The plugin always ignores the virtual module. You do not configure that here.

With the default settings, the plugin calls [stylelint.lint](https://stylelint.io/user-guide/node-api/) only in the `transform` hook. It builds a [filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) from this value. The filter decides whether to call Stylelint, and what to pass. So the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.

When `lintOnStart` is on, or `lintDirtyOnly` is off, this value has no effect. To leave those files out, adjust the `include` value.

### `stylelintPath`

- Type: `string`
- Default: `"stylelint"`

The path to the Stylelint used for linting. The plugin loads it with a [dynamic import](https://javascript.info/modules-dynamic-imports). Read [Vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.

### `formatter`

- Type: `string`
- Default: `"string"`

The formatter name, path or function. The plugin passes it to [Stylelint's formatter option](https://stylelint.io/user-guide/usage/options#formatter) to turn lint results into a human-readable or machine-readable string.

### `lintInWorker`

- Type: `boolean`
- Default: `false`

Lint in a [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran).

A worker keeps Vite fast. The trade-off: the build no longer stops on Stylelint errors, and Vite's native overlay is gone. The terminal still prints the errors. The custom overlay still works with `lintInWorker`.

[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) solves the same problem. Pick whichever fits your setup.

### `customOverlay`

- Type: `boolean | CustomOverlayOptions`
- Default: `false`

```ts
interface CustomOverlayOptions {
  initialIsOpen?: boolean | "error";
  position?: "tl" | "tr" | "bl" | "br";
  theme?: Partial<Record<ThemeKey, string>>;
  zIndex?: number;
}
```

Use the plugin's custom overlay instead of Vite's native error overlay.

The native overlay renders Stylelint's ANSI-colored `string` output verbatim. Color is lost in the browser, or the escape codes show through. The custom overlay renders structured results natively. It also works when `lintInWorker` is on, which the native overlay does not.

In an environment without a DOM entry (mini-programs, SSR, headless tests), the plugin does not inject the runtime. It warns once, then prints to the terminal only.

- `false`: keep Vite's native overlay. With `lintInWorker` there is no overlay at all.
- `true`: use the custom overlay with default styling.
- `{...}`: use the custom overlay with the given styling.

This option applies under `serve` only. In `build` mode the native `context.error` blocking behavior is always preserved.

### `lintOnStart`

- Type: `boolean`
- Default: `false`

Lint the files matched by `include` once, in the `buildStart` hook.

Without a cache, and without `lintInWorker`, this makes Vite's first start noticeably slower.

### `lintDirtyOnly`

- Type: `boolean`
- Default: `true`

Outside the `buildStart` hook, lint only the files a request touches. The files matched by `exclude` are skipped.

When this option is off, the plugin checks files against the `include` and `exclude` values instead.

### `emitError`

- Type: `boolean`
- Default: `true`

Emit found errors.

### `emitErrorAsWarning`

- Type: `boolean`
- Default: `false`

Emit found errors as warnings. Useful while prototyping.

### `emitWarning`

- Type: `boolean`
- Default: `true`

Emit found warnings.

### `emitWarningAsError`

- Type: `boolean`
- Default: `false`

Emit found warnings as errors.
