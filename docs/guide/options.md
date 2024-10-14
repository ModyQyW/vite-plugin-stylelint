# Options

You can pass Stylelint [shared options](https://stylelint.io/user-guide/options) to the plugin, or you can pass the extra options. The `files` option will always be overridden.

## Shared Options

Common options and descriptions are listed below, complete links are provided above.

### `fix`

- Type: `boolean`
- Default: `false`

Whether to automatically fix.

### `cache`

- Type: `boolean`
- Stylelint default: `false`
- Plugin default: `true`

Whether to enable the cache. This is disabled in Stylelint by default and enabled in plugin by default to improve speed.

### `cacheLocation`

- Type: `string`
- Default: `.stylelintcache`

The path to the cache.

## Extra Options

Extra options and explanations are listed below.

### `test`

- Type: `boolean`
- Default: `false`

Whether to run Stylelint under `test` mode. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest) for more.

### `dev`

- Type: `boolean`
- Default: `true`

Whether to run Stylelint under `serve` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.

### `build`

- Type: `boolean`
- Default: `false`

Whether to run Stylelint under `build` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.

### `include`

- Type: `string | string[]`
- Default: `["src/**/*.{css,scss,sass,less,styl,vue,svelte}"]`

This option specifies the files you want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.

If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, which means that the option value needs to fulfill the requirements of [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1).

If you enable the `lintOnStart` option, the plugin will also call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `buildStart` hook. The option value will not be used to create a filter, but will be used directly as the call parameter, which means that the option value also needs to fulfill the [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) requirement.

If you disable the `lintDirtyOnly` option, the plugin will use the option value as the call parameter every time it calls [stylelint.lint](https://stylelint.io/user-guide/node-api/), which means that the option value also needs to fulfill the requirements of [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0).

### `exclude`

- Type: `string | string[]`
- Default: `['node_modules', 'virtual:']`

This option specifies the files you don't want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.

The plugin forces the virtual module to be ignored and you don't need to do any configuration related to it here.

If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, which means that the option value needs to fulfill the requirements of [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1).

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

Lint in [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran). This is disabled by default.

When lint in worker, Vite build process will be faster. You will not see Vite error overlay, Vite build process will not be stopped, even with errors shown in terminal.

It is similar with [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker), but vite-plugin-checker can show you errors and warnings in browsers.

### `lintOnStart`

- Type: `boolean`
- Default: `false`

Lint `include` option specified files once in `buildStart` hook to find potential errors. This is disabled by default.

This will significantly slow down Vite first starting if you have no caches and don't enable `lintInWorker`.

### `lintDirtyOnly`

- Type: `boolean`
- Default: `true`

Whether or not to checkout only modified files that are not included in the `exclude` option value when running Stylelint outside of the `buildStart` lifecycle. Enabled by default.

When disabled, files are checked against the `include` and `exclude` option values.

### `emitError`

- Type: `boolean`
- Default: `true`

Emit found errors. This is enabled by default.

### `emitErrorAsWarning`

- Type: `boolean`
- Default: `false`

Emit found errors as warnings. This is disabled by default but you may want it enabled when prototyping.

### `emitWarning`

- Type: `boolean`
- Default: `true`

Emit found warnings. This is enabled by default.

### `emitWarningAsError`

- Type: `boolean`
- Default: `false`

Emit found warnings as errors when enabled. This is disabled by default.
