import { createFilter } from '@rollup/pluginutils';
import type * as Stylelint from 'stylelint';
import type * as Rollup from 'rollup';

export type FilterPattern = string | string[];
export type Filter = ReturnType<typeof createFilter>;

export interface StylelintPluginOptions extends Stylelint.LinterOptions {
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
export interface StylelintPluginUserOptions extends Partial<StylelintPluginOptions> {
  dev?: boolean;
  build?: boolean;
}

export type StylelintLinterOptions = Stylelint.LinterOptions;
export type StylelintInstance = Stylelint.PublicApi;
export type StylelintFormatter = Stylelint.Formatter;
export type StylelintLinterResult = Stylelint.LinterResult;

export type LintFiles = (
  context: Rollup.PluginContext,
  files: FilterPattern,
  isLintedOnStart?: boolean,
) => Promise<void>;

export type TextType = 'error' | 'warning' | 'plugin';
