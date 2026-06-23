import { createFilter, normalizePath } from "@rollup/pluginutils";
import pico from "picocolors";
import type * as Vite from "vite";
import {
  COLOR_MAPPING,
  PLUGIN_NAME,
  PLUGIN_OPTION_KEYS,
  STYLELINT_SEVERITY,
} from "./constants";
import type {
  Filter,
  FilterPattern,
  OverlayPayload,
  StylelintFormatter,
  StylelintInstance,
  StylelintLinterOptions,
  StylelintLinterResult,
  StylelintPluginOptions,
  TextType,
} from "./types";

// `context` is a per-call parameter rather than a captured closure because Vite
// runs transform hooks concurrently: a shared context would be overwritten between
// concurrent lints, misrouting emit to the wrong module's PluginContext. Adapters
// pass `this` at call time; the worker omits it (defaults to stdout-only emit).
// `lint` accepts a single id or a batch (the main-thread adapter batches the
// transform id together with its watch files); the worker always sends one id.
export interface Linter {
  lint(
    ids: string | string[],
    context?: Vite.Rolldown.PluginContext,
  ): Promise<void>;
  lintAll(context?: Vite.Rolldown.PluginContext): Promise<void>;
}

/**
 * Adapter the linter calls to emit a formatted lint message. Kept as a callback
 * (not imported) so the linter stays free of Vite server dependencies and remains
 * unit-testable. When absent, the legacy `log()` path (context.error/warn or
 * console.log) is used.
 */
export type EmitFn = (params: {
  formattedText: string;
  textType: TextType;
  // Present in non-worker serve/build paths; absent in worker (stdout-only).
  context?: Vite.Rolldown.PluginContext;
}) => void;

/**
 * Sink for the structured overlay payload. Called with `undefined` to clear.
 * Only wired when the custom overlay is enabled; otherwise never called.
 */
export type OverlayPayloadSink = (payload: OverlayPayload | undefined) => void;

export interface LinterAdapters {
  emit?: EmitFn;
  onOverlayPayload?: OverlayPayloadSink;
}

const getFilter = (options: StylelintPluginOptions): Filter =>
  createFilter(options.include, options.exclude);

// Any key NOT in PLUGIN_OPTION_KEYS is forwarded to stylelint.lint(). Real
// stylelint options (cache, cacheLocation, fix, ...) stay in the spread.
const getStylelintLinterOptions = (
  options: StylelintPluginOptions,
): StylelintLinterOptions => ({
  ...Object.fromEntries(
    Object.entries(options).filter(
      ([key]) =>
        !PLUGIN_OPTION_KEYS.includes(
          key as (typeof PLUGIN_OPTION_KEYS)[number],
        ),
    ),
  ),
  allowEmptyInput: true,
});

const initializeStylelint = async (options: StylelintPluginOptions) => {
  const { stylelintPath, formatter } = options;
  try {
    const module = await import(stylelintPath);
    const stylelintInstance = (module?.default ?? module) as StylelintInstance;
    const loadedFormatter: StylelintFormatter =
      typeof formatter === "string"
        ? await stylelintInstance.formatters[formatter]
        : formatter;
    // use as here to avoid typescript error
    // src/utils.ts(58,14): error TS2742: The inferred type of 'initializeStylelint' cannot be named without a reference to '.pnpm/postcss@8.4.27/node_modules/postcss'. This is likely not portable. A type annotation is necessary.
    return { stylelintInstance, formatter: loadedFormatter } as {
      stylelintInstance: StylelintInstance;
      formatter: StylelintFormatter;
    };
  } catch (error) {
    throw new Error(
      `Failed to initialize Stylelint. Have you installed and configured correctly? ${error}`,
    );
  }
};

// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importMetaGlob.ts
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const isVirtualModule = (id: string) =>
  id.startsWith("virtual:") || id[0] === "\0" || !id.includes("/");

const getFilePath = (id: string) => normalizePath(id).split("?")[0];

// Unlike ESLint's variant, stylelint wants to lint the `<style>` blocks of
// `.vue`/`.svelte` modules, so those modules are KEPT when they carry a
// `?type=style` query and dropped otherwise.
export const shouldIgnoreModule = (id: string, filter: Filter) => {
  // virtual module
  if (isVirtualModule(id)) {
    return true;
  }
  // not included
  if (!filter(id)) {
    return true;
  }
  // // xxx.vue?type=style or yyy.svelte?type=style style modules
  const filePath = getFilePath(id);
  if ([".vue", ".svelte"].some((extname) => filePath.endsWith(extname))) {
    return !(id.includes("?") && id.includes("type=style"));
  }
  return false;
};

const colorize = (text: string, textType: TextType) =>
  pico[COLOR_MAPPING[textType]](text);

const log = (
  text: string,
  textType: TextType,
  context?: Vite.Rolldown.PluginContext,
) => {
  console.log("");
  if (context) {
    if (textType === "error") {
      context.error(text);
    } else if (textType === "warning") {
      context.warn(text);
    }
  } else {
    console.log(`${text}  Plugin: ${colorize(PLUGIN_NAME, "plugin")}\r\n`);
  }
};

// Pure result-filtering pipeline. Drops ignored results, applies
// emitError/emitWarning filters, and derives the textType (severity channel) for
// emission from the top-level `errored` flag. Exported for testing.
export const filterResults = (
  linterResult: StylelintLinterResult,
  options: StylelintPluginOptions,
): { results: StylelintLinterResult["results"]; textType: TextType } => {
  let results = linterResult.results.filter((item) => !item.ignored);
  if (!options.emitError) {
    results = results.map((item) => ({
      ...item,
      warnings: item.warnings.filter(
        (warning) => warning.severity !== STYLELINT_SEVERITY.ERROR,
      ),
    }));
    linterResult.errored = false;
  }
  if (!options.emitWarning) {
    results = results.map((item) => ({
      ...item,
      warnings: item.warnings.filter(
        (warning) => warning.severity !== STYLELINT_SEVERITY.WARNING,
      ),
    }));
  }
  results = results.filter((item) => item.warnings.length > 0);
  return { results, textType: deriveTextType(linterResult.errored, options) };
};

// Severity channel for emission, derived from the top-level `errored` flag and
// the emit-as-* flip options. Kept as a named helper so the branches stay flat
// (Biome forbids nested ternaries).
const deriveTextType = (
  errored: boolean,
  options: StylelintPluginOptions,
): TextType => {
  if (errored) {
    return options.emitErrorAsWarning ? "warning" : "error";
  }
  return options.emitWarningAsError ? "error" : "warning";
};

// Format filtered results and emit them via the adapter (or the legacy path).
const report = (
  results: StylelintLinterResult["results"],
  linterResult: StylelintLinterResult,
  formatter: StylelintFormatter,
  textType: TextType,
  context: Vite.Rolldown.PluginContext | undefined,
  emit: EmitFn | undefined,
) => {
  linterResult.results = results;
  const formattedText = formatter(results, linterResult);
  if (emit) {
    emit({ formattedText, textType, context });
  } else {
    log(formattedText, textType, context);
  }
};

/**
 * Build a structured overlay payload from filtered results.
 *
 * Severity follows the *post-filter* textType so `emitErrorAsWarning` /
 * `emitWarningAsError` are reflected in the overlay, matching the terminal
 * channel. Each result retains only the fields the runtime needs to render.
 * Field mapping adapts Stylelint's shape to the wire-stable OverlayPayload:
 * `source` → `filePath`, `warning.rule` → `ruleId`, `warning.text` → `message`.
 *
 * Exported for testing.
 */
export const buildOverlayPayload = (
  results: StylelintLinterResult["results"],
  textType: TextType,
): OverlayPayload => ({
  results: results.map((result) => ({
    filePath: result.source ?? "",
    messages: result.warnings.map((warning) => ({
      line: warning.line,
      column: warning.column,
      severity: textType === "error" ? "error" : "warning",
      ruleId: warning.rule,
      message: warning.text,
    })),
  })),
});

/**
 * Accumulates per-file overlay payloads so the panel shows all current problems
 * across the project, not just the last-linted file. Files with no remaining
 * messages are dropped; once empty, `snapshot` returns `undefined` so the caller
 * can clear the overlay.
 */
export class OverlayManager {
  private readonly files = new Map<string, OverlayPayload["results"][number]>();

  upsert(payload: OverlayPayload): OverlayPayload | undefined {
    for (const result of payload.results) {
      if (result.messages.length === 0) {
        this.files.delete(result.filePath);
      } else {
        this.files.set(result.filePath, result);
      }
    }
    return this.snapshot();
  }

  snapshot(): OverlayPayload | undefined {
    if (this.files.size === 0) {
      return;
    }
    return { results: [...this.files.values()] };
  }
}

export function createLinter(
  options: StylelintPluginOptions,
  adapters?: LinterAdapters,
): Linter {
  const filter = getFilter(options);
  let stylelintInstance: StylelintInstance;
  let formatter: StylelintFormatter;

  // Eager initialization: triggered at construction, awaited before each lint.
  const ready = initializeStylelint(options).then((result) => {
    stylelintInstance = result.stylelintInstance;
    formatter = result.formatter;
  });

  // Only allocated when an overlay sink is wired; otherwise overlay bookkeeping
  // is skipped entirely, preserving the non-overlay code path unchanged.
  const overlayManager = adapters?.onOverlayPayload
    ? new OverlayManager()
    : undefined;

  const lintFiles = async (
    files: FilterPattern,
    context?: Vite.Rolldown.PluginContext,
  ) => {
    await ready;
    const linterResult = await stylelintInstance.lint({
      ...getStylelintLinterOptions(options),
      files,
    });
    // do nothing when there are no results
    if (!linterResult || linterResult.results.length === 0) {
      return;
    }
    const { results, textType } = filterResults(linterResult, options);
    if (results.length === 0) {
      // No problems for these files; drop their overlay entries if tracking.
      if (overlayManager && adapters?.onOverlayPayload) {
        overlayManager.upsert({
          results: linterResult.results.map((result) => ({
            filePath: result.source ?? "",
            messages: [],
          })),
        });
        adapters.onOverlayPayload(overlayManager.snapshot());
      }
      return;
    }
    // Push structured payload to the overlay sink (serve+customOverlay / worker).
    if (overlayManager && adapters?.onOverlayPayload) {
      const payload = overlayManager.upsert(
        buildOverlayPayload(results, textType),
      );
      adapters.onOverlayPayload(payload);
    }
    return report(
      results,
      linterResult,
      formatter,
      textType,
      context,
      adapters?.emit,
    );
  };

  return {
    lint: async (ids, context) => {
      await ready;
      const idList = Array.isArray(ids) ? ids : [ids];
      // Preserve the main-thread adapter's batch semantics: collect the
      // non-ignored ids, then issue a single lintFiles pass over them. When
      // lintDirtyOnly is off every pass already lints `include`, so batching
      // avoids re-running the full lint once per watched file.
      if (options.lintDirtyOnly) {
        const filePaths = idList
          .filter((id) => !shouldIgnoreModule(id, filter))
          .map((id) => getFilePath(id));
        if (filePaths.length === 0) {
          return;
        }
        return lintFiles(filePaths, context);
      }
      // lintDirtyOnly off: a single pass over `include` suffices, but only if at
      // least one id survives the filter (matches the old "shouldIgnore" guard).
      if (!idList.some((id) => !shouldIgnoreModule(id, filter))) {
        return;
      }
      return lintFiles(options.include, context);
    },
    lintAll: async (context) => lintFiles(options.include, context),
  };
}
