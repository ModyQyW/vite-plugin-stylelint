---
description: "插件接受的全部选项：fix、cache 等 Stylelint 共享选项，以及文件匹配、worker、浮层、错误上报等插件特有选项。"
---

# 选项配置

你可以给这个插件传递 Stylelint [shared options](https://stylelint.io/user-guide/options)，也可以传递这个插件特有的额外选项。`files` 选项总是会被覆盖。

## 共享选项

下面列出常用的几个，其余见上面的链接。

### `fix`

- 类型：`boolean`
- 默认值：`false`

是否让 Stylelint 改写它能修的问题。

### `cache`

- 类型：`boolean`
- Stylelint 默认值：`false`
- 插件默认值：`true`

是否启用缓存。Stylelint 默认关掉；插件默认打开，为了快一点。

### `cacheLocation`

- 类型：`string`
- 默认值：`.stylelintcache`

缓存位置。

## 额外选项

额外的选项和说明如下。

### `test`

- 类型：`boolean`
- 默认值：`false`

是否在 `test` 模式下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 和 [配置 Vitest](https://cn.vitest.dev/guide/) 了解更多。

### `dev`

- 类型：`boolean`
- 默认值：`true`

是否在 `serve` 下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。

### `build`

- 类型：`boolean`
- 默认值：`false`

是否在 `build` 下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。

### `include`

- 类型：`string | string[]`
- 默认值：`["src/**/*.{css,scss,sass,less,styl,vue,svelte}"]`

这个选项指定你想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。

如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。

如果你启用了 `lintOnStart` 选项，插件还会在 `buildStart` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这时选项值会原样传给 `files`，所以它还得是 Stylelint 认得的 glob；v18 用的是 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby)。

如果你禁用了 `lintDirtyOnly` 选项，插件每次调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/) 都会把这个选项值传过去，所以它同样得是 Stylelint 认得的 glob；v18 用的是 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby)。

### `exclude`

- 类型：`string | string[]`
- 默认值：`['node_modules', 'virtual:']`

这个选项指定你不想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。

插件强制忽略虚拟模块，你不需要在这里进行任何相关配置。

如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。

如果你启用了 `lintOnStart` 选项或者禁用了 `lintDirtyOnly` 选项，这个选项值不会生效。你需要调整 `include` 值以包含该选项值。

### `stylelintPath`

- 类型：`string`
- 默认值：`"stylelint"`

Stylelint 路径，用于校验文件。底层使用使用 [dynamic import](https://javascript.info/modules-dynamic-imports)。请先阅读 [Vite server.fs 选项](https://cn.vitejs.dev/config/server-options.html#server-fs-strict)。

### `formatter`

- 类型：`string`
- 默认值：`"string"`

格式化器的名称、路径或函数实现。用于 [设置格式化器](https://stylelint.io/user-guide/usage/options#formatter)，以便将校验结果转换为人类或机器可读的字符串。

### `lintInWorker`

- 类型：`boolean`
- 默认值：`false`

在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 里校验。

放到 worker 里校验，Vite 跑得更快。代价是构建不会因为 Stylelint 报错停下来（终端照样打印），Vite 原生遮罩层也没了。开 `lintInWorker` 时自定义遮罩层依然可用。

它和 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 解决的是同一个问题，挑一个顺手的就行。

### `customOverlay`

- 类型：`boolean | CustomOverlayOptions`
- 默认值：`false`

```ts
interface CustomOverlayOptions {
  initialIsOpen?: boolean | "error";
  position?: "tl" | "tr" | "bl" | "br";
  theme?: Partial<Record<ThemeKey, string>>;
  zIndex?: number;
}
```

使用插件的自定义遮罩层，替代 Vite 原生错误遮罩层。

原生遮罩层会把 Stylelint 带 ANSI 颜色的 `string` 输出原样渲染，在浏览器中颜色丢失（或显示转义字符）。自定义遮罩层原生渲染结构化结果，和原生遮罩层不同，开 `lintInWorker` 时也能用。

在没有 DOM 入口的环境（小程序、SSR、无头测试）中，运行时不会被注入；插件会警告一次并降级为仅终端输出。

- `false`：保留 Vite 原生遮罩层（当前行为；worker 模式下无遮罩层）。
- `true`：使用自定义遮罩层，默认样式。
- `{...}`：使用自定义遮罩层，并按给定配置定制样式。

仅在 `serve` 下生效。`build` 模式下始终保留原生 `context.error` 的阻塞行为。

### `lintOnStart`

- 类型：`boolean`
- 默认值：`false`

在 `buildStart` 钩子里把 `include` 匹配到的文件校验一次。默认关闭。

没有缓存、又没开 `lintInWorker` 时，Vite 第一次启动会明显变慢。

### `lintDirtyOnly`

- 类型：`boolean`
- 默认值：`true`

在 `buildStart` 之外运行 Stylelint 时，是否只校验本次请求涉及、且没被 `exclude` 匹配到的文件。默认开启。

禁用时，会根据 `include` 和 `exclude` 选项值确定需要校验文件。

### `emitError`

- 类型：`boolean`
- 默认值：`true`

输出发现的错误。默认开启。

### `emitErrorAsWarning`

- 类型：`boolean`
- 默认值：`false`

把发现的错误当警告输出。默认关闭，做原型时可以打开。

### `emitWarning`

- 类型：`boolean`
- 默认值：`true`

输出发现的警告。默认开启。

### `emitWarningAsError`

- 类型：`boolean`
- 默认值：`false`

把发现的警告当错误输出。默认关闭。
