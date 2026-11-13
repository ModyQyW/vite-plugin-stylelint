---
description: "插件接受的全部选项：fix、cache 等 Stylelint 共享选项，以及文件匹配、worker、浮层、错误上报等插件特有选项。"
---

# 选项配置

插件在一个对象里接收 Stylelint [shared options](https://stylelint.io/user-guide/options) 和插件特有的额外选项。`files` 选项总是会被插件覆盖。

## 共享选项

下面列常用的几个，其余见上面的链接。

### `fix`

- 类型：`boolean`
- 默认值：`false`

是否让 Stylelint 改写它能修的问题。

### `cache`

- 类型：`boolean`
- Stylelint 默认值：`false`
- 插件默认值：`true`

是否启用缓存。Stylelint 默认关掉。插件默认打开，为了快一点。

### `cacheLocation`

- 类型：`string`
- 默认值：`.stylelintcache`

缓存文件的位置。

## 额外选项

### `test`

- 类型：`boolean`
- 默认值：`false`

是否在 `test` 模式下运行 Stylelint。见 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 和 [配置 Vitest](https://cn.vitest.dev/guide/)。

### `dev`

- 类型：`boolean`
- 默认值：`true`

是否在 `serve` 下运行 Stylelint。见 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface)。

### `build`

- 类型：`boolean`
- 默认值：`false`

是否在 `build` 下运行 Stylelint。见 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface)。

### `include`

- 类型：`string | string[]`
- 默认值：`["src/**/*.{css,scss,sass,less,styl,vue,svelte}"]`

要校验的文件。大多数项目不用改它。只有 `include` 和 `exclude` 范围重合时才需要调整。

用默认设置时，插件只在 `transform` 钩子里调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。它用这个选项值 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter)。过滤器决定是否调用 Stylelint，以及传什么参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。

开了 `lintOnStart` 时，插件还会在 `buildStart` 钩子里调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这时选项值原样传给 `files`。所以它还得是 Stylelint 认得的 glob。Stylelint 18 用 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) 解析 glob。

关了 `lintDirtyOnly` 时，插件每次调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/) 都会传这个选项值。所以它同样得是 Stylelint 认得的 glob。Stylelint 18 用 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) 解析 glob。

### `exclude`

- 类型：`string | string[]`
- 默认值：`['node_modules', 'virtual:']`

不要校验的文件。大多数项目不用改它。只有 `include` 和 `exclude` 范围重合时才需要调整。

插件总是忽略虚拟模块。这里不用配置。

用默认设置时，插件只在 `transform` 钩子里调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。它用这个选项值 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter)。过滤器决定是否调用 Stylelint，以及传什么参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。

开了 `lintOnStart`，或者关了 `lintDirtyOnly` 时，这个选项值不生效。要排除这些文件，得改 `include` 值。

### `stylelintPath`

- 类型：`string`
- 默认值：`"stylelint"`

用于校验的 Stylelint 路径。底层用 [dynamic import](https://javascript.info/modules-dynamic-imports) 加载。请先读 [Vite server.fs 选项](https://cn.vitejs.dev/config/server-options.html#server-fs-strict)。

### `formatter`

- 类型：`string`
- 默认值：`"string"`

格式化器的名称、路径或函数。插件把它传给 [Stylelint 的格式化器选项](https://stylelint.io/user-guide/usage/options#formatter)，把校验结果转成人类或机器可读的字符串。

### `lintInWorker`

- 类型：`boolean`
- 默认值：`false`

在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 里校验。

放到 worker 里校验，Vite 跑得更快。代价是构建不会因为 Stylelint 报错停下来，Vite 原生遮罩层也没了。终端照样打印错误。开 `lintInWorker` 时自定义遮罩层依然可用。

[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 解决的是同一个问题。挑一个顺手的就行。

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

用插件的自定义遮罩层，替代 Vite 原生错误遮罩层。

原生遮罩层把 Stylelint 带 ANSI 颜色的 `string` 输出原样渲染。浏览器里颜色丢失，或者直接显示转义字符。自定义遮罩层原生渲染结构化结果。它还能配合 `lintInWorker` 使用，原生遮罩层做不到。

环境里没有 DOM 入口时（小程序、SSR、无头测试），插件不注入运行时。它警告一次，之后只打到终端。

- `false`：保留 Vite 原生遮罩层。配合 `lintInWorker` 时完全没有遮罩层。
- `true`：使用自定义遮罩层，默认样式。
- `{...}`：使用自定义遮罩层，按给定配置定制样式。

这个选项只在 `serve` 下生效。`build` 模式下始终保留原生 `context.error` 的阻塞行为。

### `lintOnStart`

- 类型：`boolean`
- 默认值：`false`

在 `buildStart` 钩子里，把 `include` 匹配到的文件校验一次。

没有缓存、又没开 `lintInWorker` 时，Vite 第一次启动会明显变慢。

### `lintDirtyOnly`

- 类型：`boolean`
- 默认值：`true`

在 `buildStart` 之外，只校验本次请求涉及的文件。被 `exclude` 匹配到的文件跳过。

关掉这个选项时，插件改为按 `include` 和 `exclude` 的值判断要校验哪些文件。

### `emitError`

- 类型：`boolean`
- 默认值：`true`

输出发现的错误。

### `emitErrorAsWarning`

- 类型：`boolean`
- 默认值：`false`

把发现的错误当警告输出。做原型时可以打开。

### `emitWarning`

- 类型：`boolean`
- 默认值：`true`

输出发现的警告。

### `emitWarningAsError`

- 类型：`boolean`
- 默认值：`false`

把发现的警告当错误输出。
