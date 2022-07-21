# vite-plugin-stylelint

[![npm](https://img.shields.io/npm/v/vite-plugin-stylelint)](https://www.npmjs.com/package/vite-plugin-stylelint)
[![GitHub license](https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint)](https://github.com/ModyQyW/vite-plugin-stylelint/blob/master/LICENSE)

Vite Stylelint plugin. Supports vite@2 and vite@3.

You may want [Vite ESLint plugin](https://github.com/ModyQyW/vite-plugin-stylelint).

## Install

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` does not install and config Stylelint for you. You should handle these yourself.

<details>

<summary>Stylelint@13</summary>

```sh
npm install stylelint@^13 @types/stylelint@^13 -D
```

</details>

<details>

<summary>Stylelint@14</summary>

```sh
npm install stylelint@^14 -D
```

</details>

## Usage

```ts
import { defineConfig } from 'vite';
import StylelintPlugin from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [StylelintPlugin(options)],
});
```

## Options

You can pass Stylelint [shared options](https://stylelint.io/user-guide/usage/options) and [Node.js API options](https://stylelint.io/user-guide/usage/node-api) to the plugin.

```ts
import { defineConfig } from 'vite';
import StylelintPlugin from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [
    StylelintPlugin({
      fix: true,
      quite: true,
      ...,
    }),
  ],
});
```

Additional options and explanations are listed below.

### `cache`

- Type: `boolean`
- Default: `true`

Store the results of processed files when enabled. This is enabled by default to improve speed.

### `cacheLocation`

- Type: `string`
- Default: `path.join('node_modules', '.vite', 'vite-plugin-stylelint')`

Path to a file or directory for the cache location.

### `include`

- Type: `string | string[]`
- Default: `['src/**/*.css', 'src/**/*.scss', 'src/**/*.sass', 'src/**/*.less', 'src/**/*.styl', 'src/**/*.vue', 'src/**/*.svelte']`

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns.

This is used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine `files` option, which means your `files` option will be overridden.

### `exclude`

- Type: `string | string[]`
- Default: `['node_modules', 'virtual:']`

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns.

This is used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine `files` option, which means your `files` option will be overridden.

### `stylelintPath`

- Type: `string`
- Default: `'stylelint'`

Path to Stylelint instance that will be used for linting. Use [dynamic import](https://javascript.info/modules-dynamic-imports) under the hood. Read [vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.

### `lintOnStart`

- Type: `boolean`
- Default: `false`

Lint on start (in `buildStart` hook). Useful to lint all files once to find potential errors, but significantly slow down Vite. This is disabled by default.

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
    <li>Or delete the cache file (default <code>node_modules/.vite/vite-plugin-stylelint</code>), fix errors manully and restart Vite.
    </li>
  </ul>
  This problem should only happens when starting Vite with Stylelint errors. Have a better solution? PR welcome. :)
</details>

<details>
  <summary><code>Vite</code> is slow when using this plugin</summary>
  <p>You can try <a href="https://github.com/fi3ework/vite-plugin-checker">vite-plugin-checker</a>, or just run <code>Stylelint</code> besides <code>Vite</code>.</p>
</details>

## Examples

See [examples](https://github.com/ModyQyW/vite-plugin-stylelint/tree/main/examples).

## CHANGELOG

See [CHANGELOG.md](./CHANGELOG.md).

## Acknowledge

Initially forked from [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint).

## License

MIT
