import type { CreateFilter } from "@rollup/pluginutils";
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
   * Run Stylelint under `build` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.
   *
   * 在 `build` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。
   *
   * @default false
   */
  build: boolean;
  /**
   * Whether to enable the cache. Stylelint disables it by default; the plugin enables it for speed.
   *
   * 是否启用缓存。Stylelint 默认禁用，插件默认启用以提高速度。
   *
   * @default true
   */
  cache: boolean;
  /**
   * Use the plugin's custom overlay instead of Vite's native error overlay.
   *
   * The native overlay renders Stylelint's ANSI-colored `string` output verbatim, which loses color (or shows escape codes) in the browser. The custom overlay renders structured results natively, and unlike the native overlay it also works when `lintInWorker` is enabled.
   *
   * In environments without a DOM entry (mini-programs, SSR, headless tests), the runtime is not injected; the plugin warns once and falls back to terminal-only output.
   *
   * - `false`: keep Vite's native overlay. With `lintInWorker` there is no overlay at all in this case.
   * - `true`: use the custom overlay with default styling.
   * - `{...}`: use the custom overlay with the given styling.
   *
   * Only takes effect under `serve`. In `build` mode the native `context.error` blocking behavior is always preserved.
   *
   * 使用插件的自定义遮罩层，替代 Vite 原生错误遮罩层。
   *
   * 原生遮罩层会把 Stylelint 带 ANSI 颜色的 `string` 输出原样渲染，在浏览器中颜色丢失（或显示转义字符）。自定义遮罩层原生渲染结构化结果，和原生遮罩层不同，开 `lintInWorker` 时也能用。
   *
   * 在没有 DOM 入口的环境（小程序、SSR、无头测试）中，运行时不会被注入；插件会警告一次并降级为仅终端输出。
   *
   * - `false`：保留 Vite 原生遮罩层。配合 `lintInWorker` 时完全没有遮罩层。
   * - `true`：使用自定义遮罩层，默认样式。
   * - `{...}`：使用自定义遮罩层，并按给定配置定制样式。
   *
   * 仅在 `serve` 下生效。`build` 模式下始终保留原生 `context.error` 的阻塞行为。
   *
   * @default false
   */
  customOverlay: false | true | CustomOverlayOptions;
  /**
   * Run Stylelint under `serve` command. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) for more.
   *
   * 在 `serve` 命令下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 了解更多。
   *
   * @default true
   */
  dev: boolean;
  /**
   * Emit found errors. Enabled by default.
   *
   * 输出发现的错误。默认开启。
   *
   * @default true
   */
  emitError: boolean;
  /**
   * Emit found errors as warnings. This is disabled by default but you may want it enabled when
   * prototyping.
   *
   * 把发现的错误当警告输出。默认关闭，做原型时可以打开。
   *
   * @default false
   */
  emitErrorAsWarning: boolean;
  /**
   * Emit found warnings. Enabled by default.
   *
   * 输出发现的警告。默认开启。
   *
   * @default true
   */
  emitWarning: boolean;
  /**
   * Emit found warnings as errors. Disabled by default.
   *
   * 把发现的警告当错误输出。默认关闭。
   *
   * @default false
   */
  emitWarningAsError: boolean;
  /**
   * This option specifies the files you don't want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.
   *
   * The plugin forces the virtual module to be ignored and you don't need to do any configuration related to it here.
   *
   * If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, so the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.
   *
   * If you enable the `lintOnStart` option or disable the `lintDirtyOnly` option, the option value will not take effect. You need to change `include` value to include this option value.
   *
   * 这个选项指定你不想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。
   *
   * 插件强制忽略虚拟模块，你不需要在这里进行任何相关配置。
   *
   * 如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。
   *
   * 如果你启用了 `lintOnStart` 选项或者禁用了 `lintDirtyOnly` 选项，这个选项值不会生效。你需要调整 `include` 值以包含该选项值。
   */
  exclude: FilterPattern;
  /**
   * The name, the path or the function implementation of a formatter. This is used to [set a formatter](https://stylelint.io/user-guide/usage/options#formatter) in order to convert lint results to a human- or machine-readable string.
   *
   * 格式化器的名称、路径或函数实现。用于 [设置格式化器](https://stylelint.io/user-guide/usage/options#formatter)，以便将校验结果转换为人类或机器可读的字符串。
   *
   * @default "string"
   */
  formatter: StylelintFormatterType | StylelintFormatter;
  /**
   * This option specifies the files you want to lint. You don't need to change it in most cases, unless the `include` and `exclude` ranges overlap.
   *
   * If you're using the plugin defaults, the plugin will only call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `transform` hook. The option value will be used to [create a filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) to determine if the call should be made and the parameter of the call, so the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.
   *
   * If you enable the `lintOnStart` option, the plugin will also call [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `buildStart` hook. There the value is passed straight through as `files`, so it must also be a glob Stylelint understands; v18 globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).
   *
   * If you disable the `lintDirtyOnly` option, the plugin passes the value to [stylelint.lint](https://stylelint.io/user-guide/node-api/) every time, so it must also be a glob Stylelint understands; v18 globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).
   *
   * 这个选项指定你想要校验的文件模式。在绝大部分情况下，你并不需要调整它，除非 `include` 和 `exclude` 范围有重合。
   *
   * 如果你正在使用插件默认设置，插件只会在 `transform` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这个选项值会被用于 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) 来确定是否该调用以及调用参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。
   *
   * 如果你启用了 `lintOnStart` 选项，插件还会在 `buildStart` 生命周期中调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这时选项值会原样传给 `files`，所以它还得是 Stylelint 认得的 glob；v18 用的是 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby)。
   *
   * 如果你禁用了 `lintDirtyOnly` 选项，插件每次调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/) 都会把这个选项值传过去，所以它同样得是 Stylelint 认得的 glob；v18 用的是 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby)。
   */
  include: FilterPattern;
  /**
   * Whether to lint only the files a request touches, minus the ones matched by `exclude`, when running outside the `buildStart` hook. Enabled by default.
   *
   * When disabled, files are checked against the `include` and `exclude` option values.
   *
   * 在 `buildStart` 之外运行 Stylelint 时，是否只校验本次请求涉及、且没被 `exclude` 匹配到的文件。默认开启。
   *
   * 禁用时，会根据 `include` 和 `exclude` 选项值确定需要校验文件。
   *
   * @default true
   */
  lintDirtyOnly: boolean;
  /**
   * Lint in a [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran).
   *
   * Linting in a worker keeps Vite fast. The trade-off is that the build no longer stops on Stylelint errors, even though the terminal still prints them, and Vite's native overlay is gone. The custom overlay still works with `lintInWorker`.
   *
   * It solves the same problem as [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker); pick whichever fits your setup.
   *
   * 在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 里校验。
   *
   * 放到 worker 里校验，Vite 跑得更快。代价是构建不会因为 Stylelint 报错停下来（终端照样打印），Vite 原生遮罩层也没了。开 `lintInWorker` 时自定义遮罩层依然可用。
   *
   * 它和 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 解决的是同一个问题，挑一个顺手的就行。
   *
   * @default false
   */
  lintInWorker: boolean;
  /**
   * Lint the files matched by `include` once in the `buildStart` hook. Disabled by default.
   *
   * Without a cache, and without `lintInWorker`, this makes Vite's first start noticeably slower.
   *
   * 在 `buildStart` 钩子里把 `include` 匹配到的文件校验一次。默认关闭。
   *
   * 没有缓存、又没开 `lintInWorker` 时，Vite 第一次启动会明显变慢。
   *
   * @default false
   */
  lintOnStart: boolean;
  /**
   * Path to Stylelint that will be used for linting. Use [dynamic import](https://javascript.info/modules-dynamic-imports) under the hood. Read [Vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.
   *
   * Stylelint 路径，用于校验文件。底层用 [dynamic import](https://javascript.info/modules-dynamic-imports)。请先阅读 [Vite server.fs 选项](https://cn.vitejs.dev/config/server-options.html#server-fs-strict)。
   *
   * @default "stylelint"
   */
  stylelintPath: string;

  /**
   * Run Stylelint under `test` mode. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest) for more.
   *
   * 在 `test` 模式下运行 Stylelint。查看 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 和 [配置 Vitest](https://cn.vitest.dev/guide/) 了解更多。
   *
   * @default false
   */
  test: boolean;
}
export type StylelintPluginUserOptions = Partial<StylelintPluginOptions>;

/**
 * Custom overlay styling and behavior options.
 *
 * 自定义遮罩层的样式与行为配置。
 */
export interface CustomOverlayOptions {
  /**
   * Whether the panel starts open.
   * - `true`: always open.
   * - `false`: always collapsed.
   * - `"error"`: open only when there is at least one error.
   *
   * 面板是否默认展开。
   * - `true`：始终展开。
   * - `false`：始终折叠。
   * - `"error"`：仅当存在错误时展开。
   *
   * @default "error"
   */
  initialIsOpen?: boolean | "error";
  /**
   * Position of the overlay badge/panel on the viewport.
   *
   * 遮罩层徽标/面板在视口中的位置。
   *
   * @default "br"
   */
  position?: "tl" | "tr" | "bl" | "br";
  /**
   * Override the overlay's CSS variables. Keys are the predefined variable names; values are CSS values.
   *
   * 覆盖遮罩层的 CSS 变量。键是预定义的变量名；值是 CSS 值。
   */
  theme?: Partial<Record<ThemeKey, string>>;
  /**
   * z-index of the overlay. Exposed because Design Systems may occupy high z-index layers.
   *
   * 遮罩层的 z-index。暴露此选项是因为设计系统可能占用高 z-index 层级。
   *
   * @default 99998
   */
  zIndex?: number;
}

/**
 * Predefined CSS variable keys exposed for `CustomOverlayOptions.theme`.
 *
 * 为 `CustomOverlayOptions.theme` 暴露的预定义 CSS 变量键。
 */
export type ThemeKey =
  | "--vite-plugin-stylelint-bg"
  | "--vite-plugin-stylelint-panel-bg"
  | "--vite-plugin-stylelint-error"
  | "--vite-plugin-stylelint-warning"
  | "--vite-plugin-stylelint-text"
  | "--vite-plugin-stylelint-font-mono"
  | "--vite-plugin-stylelint-radius";

/**
 * Structured payload pushed from server to the custom overlay runtime.
 * Decoupled from Stylelint's `LintResult` to stay stable across Stylelint versions.
 *
 * 从服务端推送到自定义遮罩层运行时的结构化数据。与 Stylelint 的 `LintResult` 解耦，以跨 Stylelint 版本保持稳定。
 */
export interface OverlayPayload {
  results: Array<{
    filePath: string;
    messages: Array<{
      line: number;
      column: number;
      severity: "error" | "warning";
      ruleId: string | null;
      message: string;
    }>;
  }>;
}

export type TextType = "error" | "warning" | "plugin";
