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
npm install stylelint@^13 @types/stylelint -D
```

</details>

<details>

<summary>Stylelint@14</summary>

```sh
npm install stylelint@^14 -D
```

</details>

## Usage

```js
import { defineConfig } from 'vite';
import StylelintPlugin from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [
    StylelintPlugin({
      // set options here
    }),
  ],
});
```

## Options

### `stylelintPath`

- Type: `string`
- Default: `'stylelint'`

Path to Stylelint instance that will be used for linting. You should read [vite server.fs options](https://vitejs.dev/config/#server-fs-strict) first.

### `cache`

- Type: `boolean`
- Default: `true`

Decrease execution time.

### `cacheLocation`

- Type: `string`
- Default: `path.join('node_modules', '.vite', 'vite-plugin-stylelint')`

Path to a file or directory for the cache location.

### `fix`

- Type: `boolean`
- Default: `false`

Auto fix source code.

### `include`

- Type: `string | string[] | RegExp`
- Default: `/.*\.(vue|css|scss|sass|less|styl)$/`

A single file, array of files, or RegExp to include when linting.

### `exclude`

- Type: `string | string[] | RegExp`
- Default: `/node_modules/`

A single file, array of files, or RegExp to exclude when linting.

### `formatter`

- Type: `Formatter | FormatterType`
- Default: `'string'`

Custom error formatter or the name of a built-in formatter.

### `throwOnWarning`

- Type: `boolean`
- Default: `true`

The warnings found will be emitted, default to true.

### `throwOnError`

- Type: `boolean`
- Default: `true`

The errors found will be emitted, default to true.

## CHANGELOG

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
