import type { Colors } from "picocolors/types";
import type { TextType } from "./types";

export const STYLELINT_SEVERITY = {
  ERROR: "error",
  WARNING: "warning",
} as const;

export const PLUGIN_NAME = "vite:stylelint";

// Plugin-specific option keys. `StylelintPluginOptions extends StylelintLinterOptions`,
// so plugin and stylelint options share one namespace. getOptions destructures these
// to apply defaults; getStylelintLinterOptions excludes them so they aren't forwarded
// to stylelint.lint(). `cache`, `cacheLocation`, `fix`, etc. are intentionally absent —
// they are real stylelint options the plugin forwards by design.
export const PLUGIN_OPTION_KEYS = [
  "test",
  "dev",
  "build",
  "include",
  "exclude",
  "stylelintPath",
  "formatter",
  "lintInWorker",
  "lintOnStart",
  "lintDirtyOnly",
  "emitError",
  "emitErrorAsWarning",
  "emitWarning",
  "emitWarningAsError",
] as const;

export const COLOR_MAPPING: Record<
  TextType,
  keyof Omit<Colors, "isColorSupported">
> = {
  error: "red",
  warning: "yellow",
  plugin: "magenta",
};
