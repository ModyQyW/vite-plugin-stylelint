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

### `fix`

- Type: `boolean`
- Default: `false`

Auto fix source code.

### `include`

- Type: `string | string[]`
- Default: `['src/**/*.css', 'src/**/*.less', 'src/**/*.scss', 'src/**/*.sass', 'src/**/*.styl', 'src/**/*.vue']`

A single file, or array of files, to include when linting.

### `exclude`

- Type: `string | string[]`
- Default: `'node_modules'`

A single file, or array of files, to exclude when linting.

### `formatter`

- Type: `string | FormatterType`
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
