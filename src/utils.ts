import { resolve } from 'node:path';
import type {
  StylelintPluginOptions,
  StylelintPluginUserOptions,
  LintFiles,
  StylelintLinterOptions,
  StylelintInstance,
  StylelintLinterResult,
  StylelintFormatter,
} from './types';
import { formatters } from 'stylelint';
import type * as Vite from 'vite';
import type * as Rollup from 'rollup';
import { createFilter } from '@rollup/pluginutils';

// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importMetaGlob.ts
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
export const isVirtualModule = (id: string) =>
  id.startsWith('virtual:') || id.startsWith('\0') || !id.includes('/');

export const getFinalOptions = (
  {
    cache,
    cacheLocation,
    include,
    exclude,
    stylelintPath,
    formatter,
    lintOnStart,
    emitError,
    emitErrorAsWarning,
    emitWarning,
    emitWarningAsError,
  }: StylelintPluginUserOptions,
  { cacheDir }: Vite.ResolvedConfig,
): StylelintPluginOptions => ({
  cache: cache ?? true,
  cacheLocation: cacheLocation ?? resolve(cacheDir, 'vite-plugin-stylelint'),
  include: include ?? ['src/**/*.{css,scss,sass,less,styl,vue,svelte}'],
  exclude: exclude ?? ['node_modules', 'virtual:'],
  stylelintPath: stylelintPath ?? 'stylelint',
  formatter: formatter ?? 'string',
  lintOnStart: lintOnStart ?? false,
  emitError: emitError ?? true,
  emitErrorAsWarning: emitErrorAsWarning ?? false,
  emitWarning: emitWarning ?? true,
  emitWarningAsError: emitWarningAsError ?? false,
});

export const getFilter = (opts: StylelintPluginOptions) => createFilter(opts.include, opts.exclude);

export const getStylelintLinterOptions = (
  opts: StylelintPluginOptions,
): StylelintLinterOptions => ({
  ...opts,
  allowEmptyInput: true,
  cache: opts.cache,
  cacheLocation: opts.cacheLocation,
  files: opts.files,
});

export const initialStylelint = async (opts: StylelintPluginOptions, ctx: Rollup.PluginContext) => {
  try {
    const module = await import(opts.stylelintPath);
    const stylelint = module.default as StylelintInstance;
    const formatter =
      typeof opts.formatter === 'string' ? formatters[opts.formatter] : opts.formatter;
    return { stylelint, formatter };
  } catch (error) {
    console.log('');
    ctx.error(
      `${
        (error as Error)?.message ??
        'Failed to import Stylelint. Have you installed and configured correctly?'
      }`,
    );
  }
};

export const getLintFiles = (
  stylelint: StylelintInstance,
  formatter: StylelintFormatter,
  opts: StylelintPluginOptions,
): LintFiles => {
  const { emitError, emitErrorAsWarning, emitWarning, emitWarningAsError } = opts;
  return async (ctx, files) =>
    await stylelint
      .lint({ ...getStylelintLinterOptions(opts), files })
      .then(async (linterResult: StylelintLinterResult | void) => {
        if (!linterResult) return;

        const results = linterResult.results.filter((result) => !result.ignored);

        results.forEach((result) => {
          result.warnings.forEach(({ severity }) => {
            const text = formatter([result], linterResult);
            if (severity === 'error' && emitError) {
              if (emitErrorAsWarning) ctx.warn(text);
              else ctx.error(text);
            }
            if (severity === 'warning' && emitWarning) {
              if (emitWarningAsError) ctx.error(text);
              else ctx.warn(text);
            }
          });
        });
      })
      .catch((error) => {
        console.log('');
        ctx.error(`${error?.message ?? error}`);
      });
};
