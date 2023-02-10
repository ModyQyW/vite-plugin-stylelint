# vite-plugin-stylelint

[![npm](https://img.shields.io/npm/v/vite-plugin-stylelint)](https://www.npmjs.com/package/vite-plugin-stylelint)
[![GitHub license](https://img.shields.io/github/license/ModyQyW/vite-plugin-stylelint)](https://github.com/ModyQyW/vite-plugin-stylelint/blob/master/LICENSE)

Vite Stylelint 插件。支持 Vite v2、v3 和 v4。要求 `node >= 14.18`。

你可能需要 [Vite ESLint 插件](https://github.com/ModyQyW/vite-plugin-eslint2)。

## 安装

```sh
npm install vite-plugin-stylelint -D
```

`vite-plugin-stylelint` 不会为你安装和配置 Stylelint。你应该自己处理这些。

<details>

<summary>Stylelint@15</summary>

```sh
npm install stylelint@^15 -D
```

</details>

<details>

<summary>Stylelint@14</summary>

```sh
npm install stylelint@^14 -D
```

</details>

<details>

<summary>Stylelint@13</summary>

```sh
npm install stylelint@^13 @types/stylelint@^13 -D
```

</details>

## 使用

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [stylelint(options)],
});
```

## 选项

你可以给这个插件传递 Stylelint [shared options](https://stylelint.io/user-guide/usage/options) 和 [Node.js API options](https://stylelint.io/user-guide/usage/node-api)。

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [
    stylelint({
      // 推荐启用自动修复
      fix: true,
      ...,
    }),
  ],
});
```

额外的选项和解释列写在下方。

### `dev`

- 类型：`boolean`
- 默认值：`true`

在 `serve` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。

### `build`

- 类型：`boolean`
- 默认值：`false`

在 `build` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。

### `cache`

- 类型：`boolean`
- 默认值：`true`

启用时，存储已处理的文件的结果。默认启用以提高速度。

### `cacheLocation`

- 类型：`string`
- 默认值：`.stylelintcache`

缓存位置的文件或目录的路径。`.stylelintcache` 是 Stylelint 的默认缓存位置。

### `include`

- 类型：`string | string[]`
- 默认值：`['src/**/*.{css,scss,sass,less,styl,vue,svelte}']`

一个有效的 [picomatch](https://github.com/micromatch/picomatch#globbing-features) 模式或模式数组。

这用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定 `files` 选项，这意味着你的 `files` 选项将被覆盖。

如果你正在使用 `nuxt`，你可能需要改变这个选项的值。

<details>
  <summary>nuxt 例子</summary>

```typescript
// nuxt.config.ts
import viteStylelint from 'vite-plugin-stylelint';

export default defineNuxtConfig({
  vite: {
    plugins: [
      viteStylelint({
        ...,
        include: [
          'assets/**/*.{css,less,scss,sass,vue}',
          'components/**/*.{css,less,scss,sass,vue}',
          'content/**/*.{css,less,scss,sass,vue}',
          'layouts/**/*.{css,less,scss,sass,vue}',
          'pages/**/*.{css,less,scss,sass,vue}',
          'server/**/*.{css,less,scss,sass,vue}',
          'src/**/*.{css,less,scss,sass,vue}',
          'styles/**/*.{css,less,scss,sass,vue}',
          'app.vue',
          'App.vue',
          'error.vue',
          'Error.vue',
        ],
      }),
    ],
  },
});
```

### `exclude`

- 类型：`string | string[]`
- 默认值：`['node_modules', 'virtual:']`

一个有效的 [picomatch](https://github.com/micromatch/picomatch#globbing-features) 模式或模式数组。

这用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定 `files` 选项，这意味着你的 `files` 选项将被覆盖。

### `stylelintPath`

- 类型：`string`
- 默认值：`'stylelint'`

Stylelint 路径，用于校验文件。底层使用使用 [dynamic import](https://javascript.info/modules-dynamic-imports)。请先阅读 [Vite server.fs 选项](https://cn.vitejs.dev/config/server-options.html#server-fs-strict)。

### `formatter`

- 类型：`StylelintFormatterType | StylelintFormatter`
- 默认值：`'string'`

格式化器的名称、路径或函数实现。

用于 [设置格式化器](https://stylelint.io/user-guide/usage/options#formatter)，以便将校验结果转换为人类或机器可读的字符串。

### `lintInWorker`

- 类型：`boolean`
- 默认值：`false`

在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 校验。默认禁用。

在 worker 中校验时，Vite 的构建过程会更快。即使终端显示了错误，Vite 的构建过程也不会停止。

这与 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 类似，但 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 可以在浏览器中显示错误。

### `lintOnStart`

- 类型：`boolean`
- 默认值：`false`

在开始时校验（在 `buildStart` 钩子中）。校验所有文件一次以发现潜在的错误。默认禁用。

如果你没有缓存而且没有启用 `lintInWorker`，这将大大降低 Vite 的初次启动速度。

### `chokidar`

- 类型：`boolean`
- 默认值：`false`

启用时，插件会尝试在 Chokidar `change` 事件中运行 Stylelint，而不是在 `transform` 钩子中运行。它允许校验由 `@import` 导入的样式文件。默认禁用。

如果你启用这个功能，建议同时启用 `lintOnStart`。

### `emitError`

- 类型：`boolean`
- 默认值：`true`

启用后，会输出发现的错误。默认启用。

### `emitErrorAsWarning`

- 类型：`boolean`
- 默认值：`false`

启用后，发现的错误会作为警告被输出。默认禁用，但你可能会在开发原型时启用这个。

### `emitWarning`

- 类型：`boolean`
- 默认值：`true`

启用后，会输出发现的警告。默认启用。

### `emitWarningAsError`

- 类型：`boolean`
- 默认值：`false`

启用后，发现的警告会作为错误被输出。默认禁用。

## FAQ

<details>
  <summary>Cache 失效</summary>
  <ul>
    <li>禁用 <code>cache</code> 选项。</li>
    <li>或删除缓存文件（默认是 <code>.stylelintcache</code>），手动修复错误后重启 Vite。
    </li>
  </ul>
  这个问题应该只会在启动 Vite 出现校验错误时出现。如果你有更好的解决方案，欢迎 PR。:)
</details>

<details>
  <summary>使用这个插件时 <code>Vite</code> 很慢</summary>
  <ul>
    <li>试试启用 <code>lintInWorker</code> 选项。</li>
    <li>或试试 <a href="https://github.com/fi3ework/vite-plugin-checker">vite-plugin-checker</a>。</li>
    <li>或在 Vite 外直接运行 Stylelint。</li>
  </ul>
</details>

## 例子

查看 [examples](https://github.com/ModyQyW/vite-plugin-stylelint/tree/main/examples)。

## 改动日志

查看 [CHANGELOG.md](./CHANGELOG.md)。

## 致谢

最初从 [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint) 分叉出来。

## License

MIT

## [赞助者们](https://github.com/ModyQyW/sponsors)

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
