import type * as Stylelint from 'stylelint';
import type * as Rollup from 'rollup';

export type FilterPattern = string | string[];

export interface StylelintPluginOptions extends Stylelint.LinterOptions {
  dev: boolean;
  build: boolean;
  cache: boolean;
  cacheLocation: string;
  include: FilterPattern;
  exclude: FilterPattern;
  stylelintPath: string;
  formatter: Stylelint.FormatterType | Stylelint.Formatter;
  lintOnStart: boolean;
  chokidar: boolean;
  emitError: boolean;
  emitErrorAsWarning: boolean;
  emitWarning: boolean;
  emitWarningAsError: boolean;
}
export type StylelintPluginUserOptions = Partial<StylelintPluginOptions>;

export type StylelintLinterOptions = Stylelint.LinterOptions;
export type StylelintInstance = Stylelint.PublicApi;
export type StylelintFormatter = Stylelint.Formatter;
export type StylelintLinterResult = Stylelint.LinterResult;

export type LintFiles = (
  files: FilterPattern,
  options?: {
    context?: Rollup.PluginContext;
    isLintedOnStart?: boolean;
  },
) => Promise<void>;

export type TextType = 'error' | 'warning' | 'plugin';
