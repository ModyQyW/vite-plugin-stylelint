# vite-plugin-stylelint

[English](./README.md) | 简体中文

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

## 介绍

Vite 的 Stylelint 插件。支持 Vite v2 到 v8，以及 Stylelint v13 到 v18。要求 `node>=18`。

用法、选项和示例见[文档](https://vite-plugin-stylelint.modyqyw.top/)。

> 你可能还需要 [Vite ESLint 插件](https://github.com/ModyQyW/vite-plugin-eslint2)。

## 安装

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` 不会替你安装和配置 Stylelint。你需要自己安装想要使用的 Stylelint 主版本；各个版本对 Node.js 的要求见[起步](https://vite-plugin-stylelint.modyqyw.top/zh/guide/getting-started)。

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

## 使用

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
  plugins: [stylelint()],
});
```

## 致谢

最初从 [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint) 分叉出来。

## 贡献者们

该项目由 [ModyQyW](https://github.com/ModyQyW) 创建。

感谢 [所有贡献者](https://github.com/ModyQyW/vite-plugin-stylelint/graphs/contributors) 的付出！

## 赞助

如果这个包对你有所帮助，请考虑 [赞助](https://github.com/ModyQyW/sponsors) 支持，这能让项目持续开发和维护。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
