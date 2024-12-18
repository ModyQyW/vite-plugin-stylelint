import type { CreateFilter } from "@rollup/pluginutils";
import type * as Rollup from "rollup";
import type * as Stylelint from "stylelint";
import type stylelint from "stylelint";

export type FilterPattern = string | string[];
export type Filter = ReturnType<CreateFilter>;

export type StylelintLinterOptions = Partial<Stylelint.LinterOptions>;
export type StylelintInstance = typeof stylelint;
export type StylelintFormatter = Exclude<
  StylelintLinterOptions["formatter"],
  string | undefined
>;
export type StylelintFormatterType = Exclude<
  StylelintLinterOptions["formatter"],
  StylelintFormatter | undefined
>;
export type StylelintLinterResult = Stylelint.LinterResult;

export interface StylelintPluginOptions extends StylelintLinterOptions {
  /**
   * Whether to enable the cache. This is disabled in Stylelint by default and enabled in plugin by default to improve speed.
   *
   * 是否启用缓存。Stylelint 默认禁用，插件默认启用以提高速度。
   *
   * @default true
   */
  cache: boolean;

  /**
   * Run Stylelint under `test` mode. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest) for more.
   *
   * 在 `test` 模式下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 和 [配置 Vitest](https://cn.vitest.dev/guide/) 了解更多。
   *
   * @default false
   */
  test: boolean;
  /**
   * Run Stylelint under `serve` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.
   *
   * 在 `serve` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。
   *
   * @default true
   */
  dev: boolean;
  /**
   * Run Stylelint under `build` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.
   *
   * 在 `build` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。
   *
   * @default false
   */
  build: boolean;
  /**
   * This option specifies the files you want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.
   *
   * If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, which means that the option value needs to fulfill the requirements of [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1).
   *
   * If you enable the `lintOnStart` option, the plugin will also call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `buildStart` hook. The option value will not be used to create a filter, but will be used directly as the call parameter, which means that the option value also needs to fulfill the [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) requirement.
   *
   * If you disable the `lintDirtyOnly` option, the plugin will use the option value as the call parameter every time it calls [stylelint.lint](https://stylelint.io/user-guide/node-api/), which means that the option value also needs to fulfill the requirements of [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0).
   *
   * 这个选项指定你想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。
   *
   * 如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。这意味着选项值需要满足 [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1) 的要求。
   *
   * 如果你启用了 `lintOnStart` 选项，插件还会在 `buildStart` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值不会用于创建过滤器，而是直接用作调用参数。这意味着这个选项值还需要满足 [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) 的要求。
   *
   * 如果你禁用了 `lintDirtyOnly` 选项，插件每次调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/) 时都会将该选项值作为调用参数。这意味着这个选项值也需要满足 [globby@11.1.0](https://github.com/sindresorhus/globby/tree/v11.1.0) 的要求。
   */
  include: FilterPattern;
  /**
   * This option specifies the files you don't want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.
   *
   * The plugin forces the virtual module to be ignored and you don't need to do any configuration related to it here.
   *
   * If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, which means that the option value needs to fulfill the requirements of [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1).
   *
   * If you enable the `lintOnStart` option or disable the `lintDirtyOnly` option, the option value will not take effect. You need to change `include` value to include this option value.
   *
   * 这个选项指定你不想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。
   *
   * 插件强制忽略虚拟模块，你不需要在这里进行任何相关配置。
   *
   * 如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。这意味着选项值需要满足 [picomatch@2.3.1](https://github.com/micromatch/picomatch/tree/2.3.1) 的要求。
   *
   * 如果你启用了 `lintOnStart` 选项或者禁用了 `lintDirtyOnly` 选项，这个选项值不会生效。你需要调整 `include` 值以包含该选项值。
   */
  exclude: FilterPattern;
  /**
   * Path to Stylelint that will be used for linting. Use [dynamic import](https://javascript.info/modules-dynamic-imports) under the hood. Read [Vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.
   *
   * Stylelint 路径，用于校验文件。底层使用使用 [dynamic import](https://javascript.info/modules-dynamic-imports)。请先阅读 [Vite server.fs 选项](https://cn.vitejs.dev/config/server-options.html#server-fs-strict)。
   *
   * @default "stylelint"
   */
  stylelintPath: string;
  /**
   * The name, the path or the function implementation of a formatter. This is used to [set a formatter](https://stylelint.io/user-guide/usage/options#formatter) in order to convert lint results to a human- or machine-readable string.
   *
   * 格式化器的名称、路径或函数实现。用于 [设置格式化器](https://stylelint.io/user-guide/usage/options#formatter)，以便将校验结果转换为人类或机器可读的字符串。
   *
   * @default "string"
   */
  formatter: StylelintFormatterType | StylelintFormatter;
  /**
   * Lint in [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran). This is disabled by default.
   *
   * When lint in worker, Vite build process will be faster. You will not see Vite error overlay, Vite build process will not be stopped, even with errors shown in terminal.
   *
   * It is similar with [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker), but vite-plugin-checker can show you errors and warnings in browsers.
   *
   * 在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 校验。默认禁用。
   *
   * 在 worker 中校验时，Vite 的构建过程会更快。即使终端显示了 Stylelint 校验错误，你也不会看到 Vite 错误遮罩层，Vite 构建也不会停止。
   *
   * 这与 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 类似，但 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 可以在浏览器中显示错误。
   *
   * @default false
   */
  lintInWorker: boolean;
  /**
   * Lint `include` option specified files once in `buildStart` hook to find potential errors. This is disabled by default.
   *
   * This will significantly slow down Vite first starting if you have no caches and don't enable `lintInWorker`.
   *
   * 在 `buildStart` 生命周期中校验 `include` 选项指定的文件一次以发现潜在的错误。默认禁用。
   *
   * 如果你没有缓存而且没有启用 `lintInWorker`，这将大大降低 Vite 的初次启动速度。
   *
   * @default false
   */
  lintOnStart: boolean;
  /**
   * Whether or not to checkout only modified files that are not included in the `exclude` option value when running Stylelint outside of the `buildStart` lifecycle. Enabled by default.
   *
   * When disabled, files are checked against the `include` and `exclude` option values.
   *
   * 在 `buildStart` 生命周期之外运行 Stylelint 时，是否只校验修改过且没有包含在 `exclude` 选项值内的文件。默认启用。
   *
   * 禁用时，会根据 `include` 和 `exclude` 选项值确定需要校验文件。
   *
   * @default true
   */
  lintDirtyOnly: boolean;
  /**
   * Emit found errors. This is enabled by default.
   *
   * 输出发现的错误。默认启用。
   *
   * @default true
   */
  emitError: boolean;
  /**
   * Emit found errors as warnings. This is disabled by default but you may want it enabled when
   * prototyping.
   *
   * 将发现的错误作为警告输出。默认禁用，但你可能会在开发原型时启用这个。
   *
   * @default false
   */
  emitErrorAsWarning: boolean;
  /**
   * Emit found warnings. This is enabled by default.
   *
   * 输出发现的警告。默认启用。
   *
   * @default true
   */
  emitWarning: boolean;
  /**
   * Emit found warnings as errors when enabled. This is disabled by default.
   *
   * 将发现的警告作为错误输出。默认禁用。
   *
   * @default false
   */
  emitWarningAsError: boolean;
}
export type StylelintPluginUserOptions = Partial<StylelintPluginOptions>;

export type LintFiles = (
  config: {
    files: FilterPattern;
    stylelintInstance: StylelintInstance;
    formatter: StylelintFormatter;
    options: StylelintPluginOptions;
  },
  context?: Rollup.PluginContext,
) => Promise<void>;

export type TextType = "error" | "warning" | "plugin";
