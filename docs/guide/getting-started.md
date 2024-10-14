# Getting Started

## Overview

`vite-plugin-stylelint` is a project providing Stylelint plugin for Vite. Supports Vite v2 ~ v5 and Stylelint v13 ~ v16. Requires `node>=18`.

> For Nuxt projects, please use [@nuxtjs/stylelint-module](https://github.com/nuxt-modules/stylelint).

> You may also want [Vite ESLint plugin](https://github.com/ModyQyW/vite-plugin-eslint2).

## Install

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` does not install and config Stylelint for you. You should handle these yourself.

::: details Stylelint v16

```sh
npm install stylelint@^16 -D
```

:::

::: details Stylelint v15

```sh
npm install stylelint@^15 -D
```

:::

::: details Stylelint v14

```sh
npm install stylelint@^14 -D
```

:::

::: details Stylelint v13

```sh
npm install stylelint@^13 @types/stylelint@^13 -D
```

:::

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

If this package is helpful to you, please consider [sponsoring](https://github.com/ModyQyW/sponsors), which will benefit the ongoing development and maintenance of the project.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
