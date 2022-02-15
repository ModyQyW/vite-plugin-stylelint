# vite-plugin-stylelint

[![npm](https://img.shields.io/npm/v/vite-plugin-stylelint)](https://www.npmjs.com/package/vite-plugin-stylelint)
[![GitHub license](https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint)](https://github.com/ModyQyW/vite-plugin-stylelint/blob/master/LICENSE)

Stylelint plugin for vite.

## Install

```sh
npm install vite-plugin-stylelint --save-dev
# or
yarn add vite-plugin-stylelint --dev
```

`vite-plugin-stylelint` does not install and config Stylelint for you. You should handle these yourself.

## Usage

```js
import { defineConfig } from 'vite';
import StylelintPlugin from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [StylelintPlugin()],
});
```

## Options

### `cache`

- Type: `boolean`
- Default: `true`

Decrease execution time.

### `cacheLocation`

- Type: `string`
- Default: `path.resolve(process.cwd(), 'node_modules', '.vite', 'vite-plugin-stylelint')`

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

## License

MIT
