# vite-plugin-stylelint

English | [简体中文](./README.zh-CN.md)

<div style="display: flex; justify-content: center; align-items: center; gap: 8px;">
  <a href="https://github.com/ModyQyW/vite-plugin-stylelint/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint?style=for-the-badge" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-stylelint">
    <img src="https://img.shields.io/npm/v/vite-plugin-stylelint?style=for-the-badge" alt="npm" />
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-stylelint">
    <img src="https://img.shields.io/npm/dm/vite-plugin-stylelint?style=for-the-badge" alt="npm downloads" />
  </a>
</div>

## Introduction

Stylelint plugin for Vite. Supports Vite v2 to v8 and Stylelint v13 to v18. Requires `node>=18`.

See the [documentation](https://vite-plugin-stylelint.modyqyw.top/) for usage, options and examples.

> You may also want the [ESLint plugin for Vite](https://github.com/ModyQyW/vite-plugin-eslint2).

## Install

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` does not install or configure Stylelint for you. Install the Stylelint major you want; each one has its own Node.js requirement, listed in the [getting started guide](https://vite-plugin-stylelint.modyqyw.top/guide/getting-started).

<details>

<summary>Stylelint v18</summary>

```sh
npm install stylelint@^18 -D
```

</details>

<details>

<summary>Stylelint v17</summary>

```sh
npm install stylelint@^17 -D
```

</details>

<details>

<summary>Stylelint v16</summary>

```sh
npm install stylelint@^16 -D
```

</details>

<details>

<summary>Stylelint v15</summary>

```sh
npm install stylelint@^15 -D
```

</details>

<details>

<summary>Stylelint v14</summary>

```sh
npm install stylelint@^14 -D
```

</details>

<details>

<summary>Stylelint v13</summary>

```sh
npm install stylelint@^13 @types/stylelint@^13 -D
```

</details>

## Usage

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
  plugins: [stylelint()],
});
```

## Acknowledge

Initially forked from [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint).

## Contributors

This project was created by [ModyQyW](https://github.com/ModyQyW).

Thanks to [all contributors](https://github.com/ModyQyW/vite-plugin-stylelint/graphs/contributors) for their contributions!

## Sponsors

If this package is helpful to you, please consider [sponsoring](https://github.com/ModyQyW/sponsors). It keeps the project developed and maintained.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
