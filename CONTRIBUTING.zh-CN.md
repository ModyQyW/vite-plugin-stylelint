# 贡献 vite-plugin-stylelint

感谢你有兴趣贡献！本指南介绍项目架构和本地开发环境搭建。

## 前置条件

- Node.js `>=20.11.0`（或 `>=21.2.0`）
- pnpm `>=10`（通过 `only-allow` 强制）
- 如需运行示例，安装 Stylelint v13 ~ v17

## 本地开发

```sh
# 1. 克隆并安装
git clone https://github.com/ModyQyW/vite-plugin-stylelint.git
cd vite-plugin-stylelint
pnpm install

# 2. 以 watch 模式启动核心包（每次改动重新构建 dist/）
pnpm dev

# 3. 在另一个终端，用本地构建产物跑示例
pnpm -C examples/react-ts dev
# 或：pnpm -C examples/react-ts build
```

示例通过 `workspace:*` 链接到核心包，消费的是 `packages/core/dist/` 里的当前产物。迭代时请保持 `pnpm dev` 持续运行。

### 常用脚本

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | watch 构建所有包 |
| `pnpm build` | 一次性构建（tsdown → `dist/`） |
| `pnpm type-check` | 全仓库 `tsc --noEmit` |
| `pnpm test` | 跑一次 vitest |
| `pnpm fix` | 自动修格式（Biome，经 ultracite） |
| `pnpm check` | 仅检查不修复 |
| `pnpm docs:dev` | 本地运行 VitePress 文档站点 |

### 验证改动

提交 PR 前在本地跑完整检查——与 CI / git hooks 跑的是同一套：

```sh
pnpm fix && pnpm type-check && pnpm test && pnpm build
```

再针对示例跑一次，确认运行时行为：

```sh
pnpm -C examples/react-ts build
```

## 架构

插件对 Vite 处理的模块运行 Stylelint。调度逻辑集中在一个深模块（`Linter`）里，由两个轻量 adapter 按 `lintInWorker` 选项分别驱动。

```mermaid
flowchart TD
  subgraph Adapters["Adapter（懂 Vite，驱动生命周期）"]
    Index["index.ts<br/>主线程 adapter"]
    Worker["worker.ts<br/>worker adapter"]
  end

  subgraph Linter["Linter 深模块（linter.ts）"]
    CreateLinter["createLinter(options)<br/>lint(ids, context) / lintAll(context)"]
    LintFiles["lintFilesInternal<br/>调度：<br/>lint → 过滤 → 检查 → report"]
    FilterResults["filterResults<br/>纯函数：(linterResult, options) → { results, textType }"]
    Report["report<br/>format + emit（context.error / console.log）"]
    ShouldIgnore["shouldIgnoreModule<br/>虚拟模块 / filter / vue-svelte style 语义"]
  end

  Stylelint[("stylelint 实例<br/>+ formatter")]

  Index -- "lint(ids) / lintAll()" --> CreateLinter
  Worker -- "lint(id) / lintAll()" --> CreateLinter
  CreateLinter --> LintFiles
  LintFiles --> ShouldIgnore
  LintFiles --> FilterResults
  LintFiles --> Report
  LintFiles --> Stylelint
```

### 模块职责

| 模块 | 角色 | 知晓的概念 |
| --- | --- | --- |
| `index.ts` | 主线程 adapter。持有 `worker` / `linter`，接 Vite 钩子（`buildStart`、`transform`、`buildEnd`）。把 transform 的 id 和它的 watch files 合并成一批。 | Vite 插件生命周期、worker 生命周期 |
| `worker.ts` | worker adapter。把 `parentPort` 消息转发给 `linter.lint(id)`。约 25 行。 | 仅 Node `worker_threads` |
| `linter.ts` | 深模块。包含 `createLinter`、`filterResults`（纯函数，导出供测试）、`report`、`shouldIgnoreModule`（导出供测试）及全部私有协作函数。 | 仅 Stylelint——不感知 Vite/worker |
| `utils.ts` | `getOptions`——把用户选项归一化为默认值。 | 仅选项形状 |

### 关键设计规则

- **`Linter` 是唯一知道"如何调度一次 lint"的地方。** Adapter 把外部世界（Vite 钩子、worker 消息）翻译成 `lint(ids)` / `lintAll()` 调用——它们绝不自己拼装 `stylelint.lint(...)` + formatter。
- **`context` 是 per-call 参数，不是闭包变量。** Vite 的 transform 钩子是并发执行的：共享的 context 会在并发 lint 之间被覆盖，导致 emit 路由到错误模块的 `PluginContext`。主线程 adapter 在调用时传 `this`；worker 不传（默认只输出到 stdout）。
- **`filterResults` 是纯函数。** `(linterResult, options) → { results, textType }`，无 I/O、无 stylelint 实例。它是 emit 过滤 / textType 逻辑的测试面。`report`（format + emit）保持私有——其正确性通过 `createLinter` 和示例验证。
- **worker 的颜色与主线程一致。** worker 的 stdout 是管道（非 TTY），picocolors/chalk 在模块加载时就会禁用颜色。`index.ts` 通过 `getWorkerEnv` 把主线程的颜色支持传过去，尊重用户的显式覆盖（`NO_COLOR` / `FORCE_COLOR`），且仅在父进程是 TTY 时才强制开启颜色。
- **`.vue` / `.svelte` 的 style 语义与 ESLint 插件相反。** Stylelint 校验的是 `<style>` 块，所以 `xxx.vue?type=style` / `yyy.svelte?type=style` 模块**保留**，而普通的 `.vue` / `.svelte` 模块（不带 `?type=style` 查询）**忽略**。见 `shouldIgnoreModule`。
- **plugin 选项与 Stylelint 选项共享同一命名空间。** `StylelintPluginOptions extends StylelintLinterOptions`。`PLUGIN_OPTION_KEYS`（`constants.ts`）列表在 `getStylelintLinterOptions` 里用排除法分离两者。**新增 plugin 选项时，必须把字段名追加进 `PLUGIN_OPTION_KEYS`**——否则它会被静默透传给 `stylelint.lint()`。`cache`、`cacheLocation`、`fix` 等故意不在列表里，因为它们是真实的 Stylelint 选项，插件按设计需要透传。

### 新增一个 plugin 选项

1. 在 `types.ts` 的 `StylelintPluginOptions` / `StylelintPluginUserOptions` 里加字段，配双语 JSDoc 注释（与现有风格一致）。
2. 在 `getOptions`（`utils.ts`）里设默认值。
3. **把字段名追加进 `PLUGIN_OPTION_KEYS`（`constants.ts`）。** 这一步最容易漏，且失败是静默的——不加的话该选项会被透传给 `stylelint.lint()`。
4. 若选项影响过滤或 textType 决策，扩展 `filterResults` 并在 `linter.test.ts` 加测试。

## 提交

- pre-commit（`lefthook`）会自动跑 `ultracite fix`。pre-version 还会跑 `fix`、`type-check`、`test`。
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)（`feat:`、`fix:`、`refactor:`、`docs:`、`chore:`）。
