# 起步

## 总览

`vite-plugin-stylelint` 在 Vite 里运行 Stylelint。支持 Vite v2 到 v8，以及 Stylelint v13 到 v18。插件本身要求 Node.js 18 或更新版本；各个 Stylelint 主版本对 Node.js 的要求见下表。

> 如果是 Nuxt 项目，请使用 [@nuxtjs/stylelint-module](https://github.com/nuxt-modules/stylelint)。

> 你可能还需要 [Vite ESLint 插件](https://github.com/ModyQyW/vite-plugin-eslint2)。

## 安装

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` 不会替你安装和配置 Stylelint。你需要自己安装想要使用的 Stylelint 主版本，以及它依赖的配置包。

| Stylelint | 安装命令                                     | Node.js                            |
| --------- | -------------------------------------------- | ---------------------------------- |
| 18        | `npm install stylelint@^18 -D`              | `^22.22.2 \|\| ^24.15.0 \|\| >=26` |
| 17        | `npm install stylelint@^17 -D`              | `>=20.19.0`                        |
| 16        | `npm install stylelint@^16 -D`              | `>=18.12.0`                        |
| 15        | `npm install stylelint@^15 -D`              | `^14.13.1 \|\| >=16.0.0`           |
| 14        | `npm install stylelint@^14 -D`              | `^12.20.0 \|\| ^14.13.1 \|\| >=16`  |
| 13        | `npm install stylelint@^13 @types/stylelint@^13 -D` | `>=10.13.0`               |

Stylelint 18 还需要配套的配置包支持它，例如 `stylelint-config-recommended@^19`。有些社区配置包仍停留在 Stylelint 17，`stylelint-config-recommended-scss` 就是其中之一。

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
