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
   * Run Stylelint under `build`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface).
   *
   * 在 `build` 下运行 Stylelint。见 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface)。
   *
   * @default false
   */
  build: boolean;
  /**
   * Whether to enable the cache. Stylelint disables it by default. The plugin enables it for speed.
   *
   * 是否启用缓存。Stylelint 默认关掉。插件默认打开，为了快一点。
   *
   * @default true
   */
  cache: boolean;
  /**
   * Use the plugin's custom overlay instead of Vite's native error overlay.
   *
   * The native overlay renders Stylelint's ANSI-colored `string` output verbatim. Color is lost in the browser, or the escape codes show through. The custom overlay renders structured results natively. It also works when `lintInWorker` is on, which the native overlay does not.
   *
   * In an environment without a DOM entry (mini-programs, SSR, headless tests), the plugin does not inject the runtime. It warns once, then prints to the terminal only.
   *
   * - `false`: keep Vite's native overlay. With `lintInWorker` there is no overlay at all.
   * - `true`: use the custom overlay with default styling.
   * - `{...}`: use the custom overlay with the given styling.
   *
   * This option applies under `serve` only. In `build` mode the native `context.error` blocking behavior is always preserved.
   *
   * 用插件的自定义遮罩层，替代 Vite 原生错误遮罩层。
   *
   * 原生遮罩层把 Stylelint 带 ANSI 颜色的 `string` 输出原样渲染。浏览器里颜色丢失，或者直接显示转义字符。自定义遮罩层原生渲染结构化结果。它还能配合 `lintInWorker` 使用，原生遮罩层做不到。
   *
   * 环境里没有 DOM 入口时（小程序、SSR、无头测试），插件不注入运行时。它警告一次，之后只打到终端。
   *
   * - `false`：保留 Vite 原生遮罩层。配合 `lintInWorker` 时完全没有遮罩层。
   * - `true`：使用自定义遮罩层，默认样式。
   * - `{...}`：使用自定义遮罩层，按给定配置定制样式。
   *
   * 这个选项只在 `serve` 下生效。`build` 模式下始终保留原生 `context.error` 的阻塞行为。
   *
   * @default false
   */
  customOverlay: false | true | CustomOverlayOptions;
  /**
   * Run Stylelint under `serve`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface).
   *
   * 在 `serve` 下运行 Stylelint。见 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface)。
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
   * Emit found errors as warnings. Useful while prototyping.
   *
   * 把发现的错误当警告输出。做原型时可以打开。
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
   * The files not to lint. Most projects never change it. Change it only when the `include` and `exclude` ranges overlap.
   *
   * The plugin always ignores the virtual module. You do not configure that here.
   *
   * With the default settings, the plugin calls [stylelint.lint](https://stylelint.io/user-guide/node-api/) only in the `transform` hook. It builds a [filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) from this value. The filter decides whether to call Stylelint, and what to pass. So the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.
   *
   * When `lintOnStart` is on, or `lintDirtyOnly` is off, this value has no effect. To leave those files out, adjust the `include` value.
   *
   * 不要校验的文件。大多数项目不用改它。只有 `include` 和 `exclude` 范围重合时才需要调整。
   *
   * 插件总是忽略虚拟模块。这里不用配置。
   *
   * 用默认设置时，插件只在 `transform` 钩子里调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。它用这个选项值 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter)。过滤器决定是否调用 Stylelint，以及传什么参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。
   *
   * 开了 `lintOnStart`，或者关了 `lintDirtyOnly` 时，这个选项值不生效。要排除这些文件，得改 `include` 值。
   */
  exclude: FilterPattern;
  /**
   * The formatter name, path or function. The plugin passes it to [Stylelint's formatter option](https://stylelint.io/user-guide/usage/options#formatter) to turn lint results into a human-readable or machine-readable string.
   *
   * 格式化器的名称、路径或函数。插件把它传给 [Stylelint 的格式化器选项](https://stylelint.io/user-guide/usage/options#formatter)，把校验结果转成人类或机器可读的字符串。
   *
   * @default "string"
   */
  formatter: StylelintFormatterType | StylelintFormatter;
  /**
   * The files to lint. Most projects never change it. Change it only when the `include` and `exclude` ranges overlap.
   *
   * With the default settings, the plugin calls [stylelint.lint](https://stylelint.io/user-guide/node-api/) only in the `transform` hook. It builds a [filter](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter) from this value. The filter decides whether to call Stylelint, and what to pass. So the value must be a valid [picomatch](https://github.com/micromatch/picomatch) pattern.
   *
   * When `lintOnStart` is on, the plugin also calls [stylelint.lint](https://stylelint.io/user-guide/node-api/) in the `buildStart` hook. There it passes the value straight through as `files`. So the value must also be a glob that Stylelint understands. Stylelint 18 resolves globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).
   *
   * When `lintDirtyOnly` is off, the plugin passes the value to [stylelint.lint](https://stylelint.io/user-guide/node-api/) on every call. So the value must also be a glob that Stylelint understands. Stylelint 18 resolves globs with [tinyglobby](https://github.com/SuperchupuDev/tinyglobby).
   *
   * 要校验的文件。大多数项目不用改它。只有 `include` 和 `exclude` 范围重合时才需要调整。
   *
   * 用默认设置时，插件只在 `transform` 钩子里调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。它用这个选项值 [创建一个过滤器](https://github.com/rollup/plugins/blob/master/packages/pluginutils/README.md#createfilter)。过滤器决定是否调用 Stylelint，以及传什么参数。所以选项值要符合 [picomatch](https://github.com/micromatch/picomatch) 的写法。
   *
   * 开了 `lintOnStart` 时，插件还会在 `buildStart` 钩子里调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/)。这时选项值原样传给 `files`。所以它还得是 Stylelint 认得的 glob。Stylelint 18 用 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) 解析 glob。
   *
   * 关了 `lintDirtyOnly` 时，插件每次调用 [stylelint.lint](https://stylelint.io/user-guide/node-api/) 都会传这个选项值。所以它同样得是 Stylelint 认得的 glob。Stylelint 18 用 [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) 解析 glob。
   */
  include: FilterPattern;
  /**
   * Outside the `buildStart` hook, lint only the files a request touches. The files matched by `exclude` are skipped.
   *
   * When this option is off, the plugin checks files against the `include` and `exclude` values instead.
   *
   * 在 `buildStart` 之外，只校验本次请求涉及的文件。被 `exclude` 匹配到的文件跳过。
   *
   * 关掉这个选项时，插件改为按 `include` 和 `exclude` 的值判断要校验哪些文件。
   *
   * @default true
   */
  lintDirtyOnly: boolean;
  /**
   * Lint in a [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran).
   *
   * A worker keeps Vite fast. The trade-off: the build no longer stops on Stylelint errors, and Vite's native overlay is gone. The terminal still prints the errors. The custom overlay still works with `lintInWorker`.
   *
   * [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) solves the same problem. Pick whichever fits your setup.
   *
   * 在 [worker](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-tran) 里校验。
   *
   * 放到 worker 里校验，Vite 跑得更快。代价是构建不会因为 Stylelint 报错停下来，Vite 原生遮罩层也没了。终端照样打印错误。开 `lintInWorker` 时自定义遮罩层依然可用。
   *
   * [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 解决的是同一个问题。挑一个顺手的就行。
   *
   * @default false
   */
  lintInWorker: boolean;
  /**
   * Lint the files matched by `include` once, in the `buildStart` hook.
   *
   * Without a cache, and without `lintInWorker`, this makes Vite's first start noticeably slower.
   *
   * 在 `buildStart` 钩子里，把 `include` 匹配到的文件校验一次。
   *
   * 没有缓存、又没开 `lintInWorker` 时，Vite 第一次启动会明显变慢。
   *
   * @default false
   */
  lintOnStart: boolean;
  /**
   * The path to the Stylelint used for linting. The plugin loads it with a [dynamic import](https://javascript.info/modules-dynamic-imports). Read [Vite server.fs options](https://vitejs.dev/config/server-options.html#server-fs-strict) first.
   *
   * 用于校验的 Stylelint 路径。底层用 [dynamic import](https://javascript.info/modules-dynamic-imports) 加载。请先读 [Vite server.fs 选项](https://cn.vitejs.dev/config/server-options.html#server-fs-strict)。
   *
   * @default "stylelint"
   */
  stylelintPath: string;

  /**
   * Run Stylelint under `test`. See [Command Line Interface](https://vitejs.dev/guide/#command-line-interface) and [Configuring Vitest](https://vitest.dev/guide/#configuring-vitest).
   *
   * 在 `test` 下运行 Stylelint。见 [命令行界面](https://cn.vitejs.dev/guide/#command-line-interface) 和 [配置 Vitest](https://cn.vitest.dev/guide/)。
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
