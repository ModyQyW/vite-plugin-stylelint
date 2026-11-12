# Options

You can pass Stylelint [shared options](https://stylelint.io/user-guide/options) to the plugin, or you can pass the extra options. The `files` option will always be overridden.

## Shared Options

The most common ones are listed below; the link above covers the rest.

### `fix`

- Type: `boolean`
- Default: `false`

Whether Stylelint rewrites the problems it can fix.

### `cache`

- Type: `boolean`
- Stylelint default: `false`
- Plugin default: `true`

Whether to enable the cache. Stylelint disables it by default; the plugin enables it for speed.

### `cacheLocation`

- Type: `string`
- Default: `.stylelintcache`

The path to the cache.

## Extra Options

Extra options and explanations are listed below.

### `test`

- Type: `boolean`
- Default: `false`

Whether to run Stylelint in `test` mode. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest) for more.

### `dev`

- Type: `boolean`
- Default: `true`

Whether to run Stylelint under `serve`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.

### `build`

- Type: `boolean`
- Default: `false`

Whether to run Stylelint under `build`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.

### `include`

- Type: `string | string[]`
- Default: `["src/**/*.{css,scss,sass,less,styl,vue,svelte}"]`

This option specifies the files you want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.

If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, so the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.

If you enable the `lintOnStart` option, the plugin will also call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `buildStart` hook. There the value is passed straight through as `files`, so it must also be a glob Stylelint understands; v18 globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).

If you disable the `lintDirtyOnly` option, the plugin passes the value to [stylelint.lint](https://stylelint.io/user-guide/node-api/) every time, so it must also be a glob Stylelint understands; v18 globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).

### `exclude`

- Type: `string | string[]`
- Default: `['node_modules', 'virtual:']`

This option specifies the files you don't want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.

The plugin forces the virtual module to be ignored and you don't need to do any configuration related to it here.

If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, so the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.

If you enable the `lintOnStart` option or disable the `lintDirtyOnly` option, the option value will not take effect. You need to change `include` value to include this option value.

### `stylelintPath`

- Type: `string`
- Default: `"stylelint"`

Path to Stylelint that will be used for linting. Use [dynamic import](https://javascript.info/modules-dynamic-imports) under the hood. Read [Vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.

### `formatter`

- Type: `string`
- Default: `"string"`

The name, the path or the function implementation of a formatter. This is used to [set a formatter](https://stylelint.io/user-guide/usage/options#formatter) in order to convert lint results to a human- or machine-readable string.

### `lintInWorker`

- Type: `boolean`
- Default: `false`

Lint in a [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran).

Linting in a worker keeps Vite fast. The trade-off is that the build no longer stops on Stylelint errors, even though the terminal still prints them, and Vite's native overlay is gone. The custom overlay still works with `lintInWorker`.

It solves the same problem as [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker); pick whichever fits your setup.

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

The native overlay renders Stylelint's ANSI-colored `string` output verbatim, which loses color (or shows escape codes) in the browser. The custom overlay renders structured results natively, and unlike the native overlay it also works when `lintInWorker` is enabled.

In environments without a DOM entry (mini-programs, SSR, headless tests), the runtime is not injected; the plugin warns once and falls back to terminal-only output.

- `false`: keep Vite's native overlay. With `lintInWorker` there is no overlay at all in this case.
- `true`: use the custom overlay with default styling.
- `{...}`: use the custom overlay with the given styling.

Only takes effect under `serve`. In `build` mode the native `context.error` blocking behavior is always preserved.

### `lintOnStart`

- Type: `boolean`
- Default: `false`

Lint the files matched by `include` once in the `buildStart` hook. Disabled by default.

Without a cache, and without `lintInWorker`, this makes Vite's first start noticeably slower.

### `lintDirtyOnly`

- Type: `boolean`
- Default: `true`

Whether to lint only the files a request touches, minus the ones matched by `exclude`, when running outside the `buildStart` hook. Enabled by default.

When disabled, files are checked against the `include` and `exclude` option values.

### `emitError`

- Type: `boolean`
- Default: `true`

Emit found errors. Enabled by default.

### `emitErrorAsWarning`

- Type: `boolean`
- Default: `false`

Emit found errors as warnings. Disabled by default; useful while prototyping.

### `emitWarning`

- Type: `boolean`
- Default: `true`

Emit found warnings. Enabled by default.

### `emitWarningAsError`

- Type: `boolean`
- Default: `false`

Emit found warnings as errors. Disabled by default.
