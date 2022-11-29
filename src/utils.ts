import { resolve } from 'node:path';
import chokidar from 'chokidar';
import pico from 'picocolors';
import type {
  StylelintPluginOptions,
  StylelintPluginUserOptions,
  LintFiles,
  StylelintLinterOptions,
  StylelintInstance,
  StylelintLinterResult,
  StylelintFormatter,
} from './types';
import type * as Vite from 'vite';
import type * as Rollup from 'rollup';
import { createFilter } from '@rollup/pluginutils';

export const cwd = process.cwd();

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
    chokidar,
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
  chokidar: chokidar ?? false,
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
      typeof opts.formatter === 'string' ? stylelint.formatters[opts.formatter] : opts.formatter;
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
            if (opts.chokidar) {
              const levelColor = severity === 'error' ? 'red' : 'yellow';
              console.log(`${pico[levelColor](text)}  Plugin: ${pico.magenta('vite:stylelint')}`);
              return;
            }
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

export const getWatcher = (
  lintFiles: LintFiles,
  opts: StylelintPluginOptions,
  ctx: Rollup.PluginContext,
) => {
  return chokidar.watch(opts.include, { ignored: opts.exclude }).on('change', async (path) => {
    const fullPath = resolve(cwd, path);
    console.log('==== chokidar ====');
    console.log('fullPath', fullPath);
    await lintFiles(ctx, fullPath);
  });
};
