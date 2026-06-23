import type { Colors } from "picocolors/types";
import type { TextType } from "./types";

export const STYLELINT_SEVERITY = {
  ERROR: "error",
  WARNING: "warning",
} as const;

export const PLUGIN_NAME = "vite:stylelint";

// WebSocket event names for the custom overlay handshake and payload push.
// Client → server: runtime-loaded ping (sent once on runtime load).
// Server → client: overlay payload push (after each lint).
export const WS_RUNTIME_LOADED_EVENT = "vite:stylelint:runtime-loaded";
export const WS_OVERLAY_EVENT = "vite:stylelint:overlay";

// Virtual module IDs for the custom overlay runtime.
export const RUNTIME_CLIENT_RUNTIME_PATH = "/@vite-plugin-stylelint-runtime";
export const RUNTIME_CLIENT_ENTRY_PATH =
  "/@vite-plugin-stylelint-runtime-entry";

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
  "customOverlay",
] as const;

export const COLOR_MAPPING: Record<
  TextType,
  keyof Omit<Colors, "isColorSupported">
> = {
  error: "red",
  warning: "yellow",
  plugin: "magenta",
};
