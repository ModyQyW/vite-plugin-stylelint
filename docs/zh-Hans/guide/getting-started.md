# 起步

## 总览

`vite-plugin-stylelint` 是 Vite Stylelint 插件。支持 Vite v2 ~ v6 和 Stylelint v13 ~ v16。要求 `node>=18`。

> 对于 Nuxt 项目，请使用[@nuxtjs/stylelint-module](https://github.com/nuxt-modules/stylelint)。

> 你也可能想要 [Vite ESlint 插件](https://github.com/ModyQyW/vite-plugin-eslint2)。

## 安装

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` 不会为你安装和配置 Stylelint。你应该自己处理这些。

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

如果这个包对你有所帮助，请考虑 [赞助](https://github.com/ModyQyW/sponsors) 支持，这将有利于项目持续开发和维护。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
