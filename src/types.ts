import type * as Stylelint from 'stylelint';

export type FilterPattern = string | string[];

export interface StylelintPluginOptions extends Stylelint.LinterOptions {
  cache?: boolean;
  cacheLocation?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  stylelintPath?: string;
  lintOnStart?: boolean;
  emitError?: boolean;
  emitErrorAsWarning?: boolean;
  emitWarning?: boolean;
  emitWarningAsError?: boolean;
}
