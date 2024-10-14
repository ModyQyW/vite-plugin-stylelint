# 选项配置

你可以给这个插件传递 Stylelint [shared options](https://stylelint.io/user-guide/options)，也可以传递这个插件特有的额外选项。`files` 选项总是会被覆盖。

## 构造器选项

常见的自带选项和说明如下，完整内容请查看上方链接。

### `fix`

- 类型：`boolean`
- 默认值：`false`

是否自动修复。

### `cache`

- 类型：`boolean`
- Stylelint 默认值：`false`
- 插件默认值：`true`

是否启用缓存。Stylelint 默认禁用，插件默认启用以提高速度。

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

是否在 `serve` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。

### `build`

- 类型：`boolean`
- 默认值：`false`

是否在 `build` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。

### `include`

- 类型：`string | string[]`
- 默认值：`["src/**/*.{css,scss,sass,less,styl,vue,svelte}"]`

这个选项指定你想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。

如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。这意味着选项值需要满足 [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1) 的要求。

如果你启用了 `lintOnStart` 选项，插件还会在 `buildStart` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值不会用于创建过滤器，而是直接用作调用参数。这意味着这个选项值还需要满足 [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) 的要求。

如果你禁用了 `lintDirtyOnly` 选项，插件每次调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/) 时都会将该选项值作为调用参数。这意味着这个选项值也需要满足 [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) 的要求。

### `exclude`

- 类型：`string | string[]`
- 默认值：`['node_modules', 'virtual:']`

这个选项指定你不想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。

插件强制忽略虚拟模块，你不需要在这里进行任何相关配置。

如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。这意味着选项值需要满足 [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1) 的要求。

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

在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 校验。默认禁用。

在 worker 中校验时，Vite 的构建过程会更快。即使终端显示了 Stylelint 校验错误，你也不会看到 Vite 错误遮罩层，Vite 构建也不会停止。

这与 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 类似，但 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 可以在浏览器中显示错误。

### `lintOnStart`

- 类型：`boolean`
- 默认值：`false`

在 `buildStart` 生命周期中校验 `include` 选项指定的文件一次以发现潜在的错误。默认禁用。

如果你没有缓存而且没有启用 `lintInWorker`，这将大大降低 Vite 的初次启动速度。

### `lintDirtyOnly`

- 类型：`boolean`
- 默认值：`true`

在 `buildStart` 生命周期之外运行 Stylelint 时，是否只校验修改过且没有包含在 `exclude` 选项值内的文件。默认启用。

禁用时，会根据 `include` 和 `exclude` 选项值确定需要校验文件。

### `emitError`

- 类型：`boolean`
- 默认值：`true`

输出发现的错误。默认启用。

### `emitErrorAsWarning`

- 类型：`boolean`
- 默认值：`false`

将发现的错误作为警告输出。默认禁用，但你可能会在开发原型时启用这个。

### `emitWarning`

- 类型：`boolean`
- 默认值：`true`

输出发现的警告。默认启用。

### `emitWarningAsError`

- 类型：`boolean`
- 默认值：`false`

将发现的警告作为错误输出。默认禁用。
