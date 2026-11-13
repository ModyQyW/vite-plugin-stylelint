---
description: "安装 vite-plugin-stylelint，在 vite.config.ts 里注册，并选好和项目匹配的 Stylelint 主版本与 Node.js 版本。"
---

# 起步

## 总览

`vite-plugin-stylelint` 在 Vite 里运行 Stylelint。支持 Vite v2 到 v8，以及 Stylelint v13 到 v18。

插件本身要求 Node.js 18 或更新版本。各个 Stylelint 主版本对 Node.js 的要求不一样，见下面的表格。

> 如果是 Nuxt 项目，请使用 [@nuxtjs/stylelint-module](https://github.com/nuxt-modules/stylelint)。

> 你可能还需要 [Vite ESLint 插件](https://github.com/ModyQyW/vite-plugin-eslint2)。

## 安装

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` 不会替你安装和配置 Stylelint。你需要自己安装想要使用的 Stylelint 主版本，以及它依赖的配置包。

| Stylelint | 安装命令                                     | Node.js                            |
| --------- | -------------------------------------------- | ---------------------------------- |
| 18        | `npm install stylelint@^18 -D`               | `^22.22.2 \|\| ^24.15.0 \|\| >=26` |
| 17        | `npm install stylelint@^17 -D`               | `>=20.19.0`                        |
| 16        | `npm install stylelint@^16 -D`               | `>=18.12.0`                        |
| 15        | `npm install stylelint@^15 -D`               | `^14.13.1 \|\| >=16.0.0`           |
| 14        | `npm install stylelint@^14 -D`               | `^12.20.0 \|\| ^14.13.1 \|\| >=16`  |
| 13        | `npm install stylelint@^13 @types/stylelint@^13 -D` | `>=10.13.0`               |

Stylelint 18 还需要支持它的配置包。`stylelint-config-recommended@^19` 就是其中一个。

有些社区配置包仍然只支持 Stylelint 17，`stylelint-config-recommended-scss` 是其中之一。

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

如果这个包对你有帮助，可以考虑 [赞助](https://github.com/ModyQyW/sponsors)。它让项目能持续开发和维护。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
