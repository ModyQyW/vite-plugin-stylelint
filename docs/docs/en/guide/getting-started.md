# Getting Started

## Overview

`vite-plugin-stylelint` runs Stylelint inside Vite. It supports Vite v2 to v8 and Stylelint v13 to v18. The plugin needs Node.js 18 or newer; each Stylelint major has its own Node.js requirement, listed below.

> For Nuxt projects, use [@nuxtjs/stylelint-module](https://github.com/nuxt-modules/stylelint).

> You may also want the [Vite ESLint plugin](https://github.com/ModyQyW/vite-plugin-eslint2).

## Install

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` does not install or configure Stylelint for you. Install the Stylelint major you want and the configs it needs.

| Stylelint | Install                                     | Node.js                            |
| --------- | ------------------------------------------- | ---------------------------------- |
| 18        | `npm install stylelint@^18 -D`              | `^22.22.2 \|\| ^24.15.0 \|\| >=26` |
| 17        | `npm install stylelint@^17 -D`              | `>=20.19.0`                        |
| 16        | `npm install stylelint@^16 -D`              | `>=18.12.0`                        |
| 15        | `npm install stylelint@^15 -D`              | `^14.13.1 \|\| >=16.0.0`           |
| 14        | `npm install stylelint@^14 -D`              | `^12.20.0 \|\| ^14.13.1 \|\| >=16`  |
| 13        | `npm install stylelint@^13 @types/stylelint@^13 -D` | `>=10.13.0`               |

Stylelint 18 also needs configs that support it, such as `stylelint-config-recommended@^19`. Some community configs, `stylelint-config-recommended-scss` among them, still require Stylelint 17.

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
