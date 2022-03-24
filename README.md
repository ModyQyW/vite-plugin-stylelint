# vite-plugin-stylelint

[![npm](https://img.shields.io/npm/v/vite-plugin-stylelint)](https://www.npmjs.com/package/vite-plugin-stylelint)
[![GitHub license](https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint)](https://github.com/ModyQyW/vite-plugin-stylelint/blob/master/LICENSE)

Vite Stylelint plugin.

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

Store the results of processed files. This is enabled by default to improve speed.

### `cacheLocation`

- Type: `string`
- Default: `path.join('node_modules', '.vite', 'vite-plugin-stylelint')`

Path to a file or directory for the cache location.

### `include`

- Type: `FilterPattern`
- Default: `[/.*\.(vue|css|scss|sass|less|styl)$/]`

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns.

This is used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine `files` option, which means your `files` option will be overridden.

### `exclude`

- Type: `FilterPattern`
- Default: `[/node_modules/, viteConfig.build.outDir]`

A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or array of patterns.

This is used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine `files` option, which means your `files` option will be overridden.

### `stylelintPath`

- Type: `string`
- Default: `'stylelint'`

Path to Stylelint instance that will be used for linting. Read [vite server.fs options](https://vitejs.dev/config/#server-fs-strict) first.

### `emitError`

- Type: `boolean`
- Default: `true`

The errors found will be emitted by default.

### `emitWarning`

- Type: `boolean`
- Default: `true`

The warnings found will be emitted by default.

## CHANGELOG

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
