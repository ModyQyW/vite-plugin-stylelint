# vite-plugin-stylelint

[![npm](https://img.shields.io/npm/v/vite-plugin-stylelint)](https://www.npmjs.com/package/vite-plugin-stylelint)
[![GitHub license](https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint)](https://github.com/ModyQyW/vite-plugin-stylelint/blob/master/LICENSE)

Vite Stylelint plugin. Supports Vite v2, v3 and v4. Requires `node >= 14.18`.

You may want [Vite ESLint plugin](https://github.com/ModyQyW/vite-plugin-eslint2).

## Install

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` does not install and config Stylelint for you. You should handle these yourself.

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

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns.

This is used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine `files` option, which means your `files` option will be overridden.

You may want to change this option if you are using `nuxt`.

<details>
  <summary>nuxt example</summary>

```typescript
// nuxt.config.ts
import viteStylelint from 'vite-plugin-stylelint';

export default defineNuxtConfig({
  vite: {
    plugins: [
      viteStylelint({
        ...,
        include: [
          'assets/**/*.{css,less,scss,sass,vue}',
          'components/**/*.{css,less,scss,sass,vue}',
          'content/**/*.{css,less,scss,sass,vue}',
          'layouts/**/*.{css,less,scss,sass,vue}',
          'pages/**/*.{css,less,scss,sass,vue}',
          'server/**/*.{css,less,scss,sass,vue}',
          'src/**/*.{css,less,scss,sass,vue}',
          'styles/**/*.{css,less,scss,sass,vue}',
          'app.vue',
          'App.vue',
          'error.vue',
          'Error.vue',
        ],
      }),
    ],
  },
});
```

</details>

### `exclude`

- Type: `string | string[]`
- Default: `['node_modules', 'virtual:']`

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns.

This is used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine `files` option, which means your `files` option will be overridden.

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

Lint on start (in `buildStart` hook). Useful to lint all files once to find potential errors. This is disabled by default.

This will significantly slow down Vite first starting if you have no caches and don't enable `lintInWorker`.

### `chokidar`

- Type: `boolean`
- Default: `false`

With this option enabled, this plugin will try to run Stylelint in Chokidar `change` event instead of `transform` hook. It makes linting style files imported by `@import` possible. This is disabled by default.

Recommend to enable `lintOnStart` too, if you enable this one.

### `emitError`

- Type: `boolean`
- Default: `true`

The errors found will be emitted when enabled. This is enabled by default.

### `emitErrorAsWarning`

- Type: `boolean`
- Default: `false`

The errors found will be emitted as warnings when enabled. This is disabled by default but you may want it enabled when prototyping.

### `emitWarning`

- Type: `boolean`
- Default: `true`

The warnings found will be emitted when enabled. This is enabled by default.

### `emitWarningAsError`

- Type: `boolean`
- Default: `false`

The warnings found will be emitted as errors when enabled. This is disabled by default.

## FAQ

<details>
  <summary>Cache is broken</summary>
  <ul>
    <li>Disable <code>cache</code> option.</li>
    <li>Or delete the cache file (default <code>.stylelintcache</code>), fix errors manully and restart Vite.
    </li>
  </ul>
  This problem should only happens when starting Vite with Stylelint errors. Have a better solution? PR welcome. :)
</details>

<details>
  <summary><code>Vite</code> is slow when using this plugin</summary>
  <ul>
    <li>Try enable <code>lintInWorker</code> option</li>
    <li>Or try <a href="https://github.com/fi3ework/vite-plugin-checker">vite-plugin-checker</a></li>
    <li>Or run Stylelint directly besides Vite</li>
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
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
