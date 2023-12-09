# vite-plugin-stylelint

[![npm](https://img.shields.io/npm/v/vite-plugin-stylelint)](https://www.npmjs.com/package/vite-plugin-stylelint)
[![GitHub license](https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint)](https://github.com/ModyQyW/vite-plugin-stylelint/blob/master/LICENSE)

Vite Stylelint plugin. Runs Stylelint in `transform` hook by default.

Supports Vite v2 ~ v5. Requires `node>=18`.

You may want [Vite ESLint plugin](https://github.com/ModyQyW/vite-plugin-eslint2).

## Install

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` does not install and config Stylelint for you. You should handle these yourself.

<details>

<summary>Stylelint@16</summary>

```sh
npm install stylelint@^15 -D
```

</details>

<details>

<summary>Stylelint@15</summary>

```sh
npm install stylelint@^15 -D
```

</details>

<details>

<summary>Stylelint@14</summary>

```sh
npm install stylelint@^14 -D
```

</details>

<details>

<summary>Stylelint@13</summary>

```sh
npm install stylelint@^13 @types/stylelint@^13 -D
```

</details>

## Usage

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [stylelint(options)],
});
```

## Options

You can pass Stylelint [shared options](https://stylelint.io/user-guide/usage/options) and [Node.js API options](https://stylelint.io/user-guide/usage/node-api) to the plugin.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [
    stylelint({
      // recommend to enable auto fix
      fix: true,
      ...,
    }),
  ],
});
```

Additional options and explanations are listed below.

### `test`

- Type: `boolean`
- Default: `false`

Run Stylelint under `test` mode. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest) for more.

### `dev`

- Type: `boolean`
- Default: `true`

Run Stylelint under `serve` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.

### `build`

- Type: `boolean`
- Default: `false`

Run Stylelint under `build` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.

### `cache`

- Type: `boolean`
- Default: `true`

Store the results of processed files when enabled. This is enabled by default to improve speed.

### `cacheLocation`

- Type: `string`
- Default: `.stylelintcache`

Path to a file or directory for the cache location. `.stylelintcache` is the default cache location of Stylelint.

### `include`

- Type: `string | string[]`
- Default: `['src/**/*.{css,scss,sass,less,styl,vue,svelte}']`

This option specifies the files you want to lint. You don't need to change it in most cases, unless you're using a framework like Nuxt, or if the `include` and `exclude` ranges overlap.

If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, which means that the option value needs to fulfill the requirements of [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1).

If you enable the `lintOnStart` option, the plugin will also call `stylelint.lint` in the `buildStart` hook. The option value will not be used to create a filter, but will be used directly as the call parameter, which means that the option value also needs to fulfill the [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) requirement.

If you disable the `lintDirtyOnly` option, the plugin will use the option value as the call parameter every time it calls `stylelint.lint`, which means that the option value also needs to fulfill the requirements of `globby@11.1.0`.

### `exclude`

- Type: `string | string[]`
- Default: `['node_modules', 'virtual:']`

This option specifies the files you don't want to lint. You don't need to change it in most cases, unless you're using a framework such as Nuxt, or if the `include` and `exclude` ranges overlap.

If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, which means that the option value needs to fulfill the requirements of [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1).

If you enable the `lintOnStart` option or disable the `lintDirtyOnly` option, the option value will not take effect. You need to change `include` value to include this option value.

### `stylelintPath`

- Type: `string`
- Default: `'stylelint'`

Path to Stylelint that will be used for linting. Use [dynamic import](https://javascript.info/modules-dynamic-imports) under the hood. Read [Vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.

### `formatter`

- Type: `StylelintFormatterType | StylelintFormatter`
- Default: `'string'`

The name, the path or the function implementation of a formatter.

This is used to [set a formatter](https://stylelint.io/user-guide/usage/options#formatter) in order to convert lint results to a human- or machine-readable string.

### `lintInWorker`

- Type: `boolean`
- Default: `false`

Lint in [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran). This is disabled by default.

When lint in worker, Vite build process will be faster. Vite build process will not be stopped, even with errors shown in terminal.

It is similar with [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker), but [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) can show you errors and warnings in browsers.

### `lintOnStart`

- Type: `boolean`
- Default: `false`

Lint `include` option specified files once in `buildStart` hook to find potential errors. This is disabled by default.

This will significantly slow down Vite first starting if you have no caches and don't enable `lintInWorker`.

### `lintDirtyOnly`

- Type: `boolean`
- Default: `true`

Lint changed files only when running Stylelint except from `buildStart` hook. This is enabled by default.

This plugin will lint `include` option specified files when disabled.

### `chokidar`

- Type: `boolean`
- Default: `false`

Run Stylelint in Chokidar `change` event instead of `transform` hook. This is disabled by default.

This plugin can lint style files imported by `@import` when enable this option.

Recommend to enable `lintOnStart` if you enable this one.

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

## FAQ

<details>
  <summary>Do I need this plugin?</summary>
  <p><strong>You don't need this in most cases</strong>.</p>
  <p>It is usual to use <a href="https://github.com/webpack-contrib/stylelint-webpack-plugin">stylelint-webpack-plugin</a> in Webpack. And this plugin does almost the same in Vite.</p>
  <p>However, our IDE is already probably giving all the info we need. We only need to add <a href="https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint">Stylelint plugin</a> in VSCode. WebStorm already includes the functionality. We can also run Stylelint in CI or CLI.</p>
  <p>Since we have these ways to run Stylelint, it is unnecessary to run Stylelint in Vite, which means we don't need this plugin in most cases.</p>
  <p>If you really want some errors and warnings, try enable <code>lintInWorker</code> option, which  keeps Vite speed and prints in console. Or try <a href="https://github.com/fi3ework/vite-plugin-checker">vite-plugin-checker</a>, which prints in browser.
</details>

<details>
  <summary>Cache is broken</summary>
  <ul>
    <li>Disable <code>cache</code> option.</li>
    <li>Or delete the cache file (default <code>.stylelintcache</code>), fix errors manully and restart Vite.
    </li>
  </ul>
  <p>This problem should only happens when starting Vite with Stylelint errors. Have a better solution? PR welcome. :)</p>
</details>

<details>
  <summary><code>Vite</code> is slow when using this plugin</summary>
  <ul>
    <li>Try enable <code>lintInWorker</code> option.</li>
    <li>Or try <a href="https://github.com/fi3ework/vite-plugin-checker">vite-plugin-checker.</a></li>
    <li>Or run Stylelint directly besides Vite.</li>
  </ul>
</details>

## Examples

See [examples](https://github.com/ModyQyW/vite-plugin-stylelint/tree/main/examples).

## CHANGELOG

See [CHANGELOG.md](./CHANGELOG.md).

## Acknowledge

Initially forked from [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint).

## License

MIT

## [Sponsors](https://github.com/ModyQyW/sponsors)

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img alt="sponsors" src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
