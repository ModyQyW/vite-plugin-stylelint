import { resolve } from 'node:path';
import chokidar from 'chokidar';
import pico from 'picocolors';
import { createFilter, normalizePath } from '@rollup/pluginutils';
import type { Colors } from 'picocolors/types';
import type * as Rollup from 'rollup';
import type {
  Filter,
  LintFiles,
  StylelintFormatter,
  StylelintInstance,
  StylelintLinterOptions,
  StylelintLinterResult,
  StylelintPluginOptions,
  StylelintPluginUserOptions,
  TextType,
} from './types';

export const cwd = process.cwd();

export const pluginName = 'vite:stylelint';

export const extnamesWithStyleBlock = ['.vue', '.svelte'];

export const colorMap: Record<TextType, keyof Omit<Colors, 'isColorSupported'>> = {
  error: 'red',
  warning: 'yellow',
  plugin: 'magenta',
};

// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importMetaGlob.ts
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
export const isVirtualModule = (id: string) =>
  id.startsWith('virtual:') || id.startsWith('\0') || !id.includes('/');

export const getFileFromId = (id: string) => normalizePath(id).split('?')[0];

export const shouldIgnore = (id: string, filter: Filter) => {
  if (isVirtualModule(id)) return true;
  if (!filter(id)) return true;
  const file = getFileFromId(id);
  if (extnamesWithStyleBlock.some((extname) => file.endsWith(extname))) {
    return !(id.includes('?') && id.includes('type=style'));
  }
  return false;
};

export const colorize = (text: string, textType: TextType) => pico[colorMap[textType]](text);

export const print = (text: string, textType: TextType, context?: Rollup.PluginContext) => {
  console.log('');
  if (context) {
    if (textType === 'error') context.error(text);
    else if (textType === 'warning') context.warn(text);
  } else {
    const t = colorize(`${text}  Plugin: ${colorize(pluginName, 'plugin')}\r\n`, textType);
    console.log(t);
  }
};

export const getOptions = ({
  dev,
  build,
  cache,
  cacheLocation,
  include,
  exclude,
  stylelintPath,
  formatter,
  lintInWorker,
  lintOnStart,
  chokidar,
  emitError,
  emitErrorAsWarning,
  emitWarning,
  emitWarningAsError,
  ...stylelintOptions
}: StylelintPluginUserOptions): StylelintPluginOptions => ({
  dev: dev ?? true,
  build: build ?? false,
  cache: cache ?? true,
  cacheLocation: cacheLocation ?? '.stylelintcache',
  include: include ?? ['src/**/*.{css,scss,sass,less,styl,vue,svelte}'],
  exclude: exclude ?? ['node_modules', 'virtual:'],
  stylelintPath: stylelintPath ?? 'stylelint',
  formatter: formatter ?? 'string',
  lintInWorker: lintInWorker ?? false,
  lintOnStart: lintOnStart ?? false,
  chokidar: chokidar ?? false,
  emitError: emitError ?? true,
  emitErrorAsWarning: emitErrorAsWarning ?? false,
  emitWarning: emitWarning ?? true,
  emitWarningAsError: emitWarningAsError ?? false,
  ...stylelintOptions,
});

export const getFilter = (options: StylelintPluginOptions) =>
  createFilter(options.include, options.exclude);

export const getStylelintLinterOptions = (
  options: StylelintPluginOptions,
): StylelintLinterOptions => ({
  ...options,
  allowEmptyInput: true,
});

export const initialStylelint = async (options: StylelintPluginOptions) => {
  const { stylelintPath, formatter } = options;
  try {
    const module = await import(stylelintPath);
    const stylelint = (module?.default ?? module) as StylelintInstance;
    const loadedFormatter =
      typeof formatter === 'string' ? stylelint.formatters[formatter] : formatter;
    return { stylelint, formatter: loadedFormatter };
  } catch (error) {
    throw new Error(
      `Failed to import Stylelint. Have you installed and configured correctly? ${error}`,
    );
  }
};

export const getLintFiles =
  (
    stylelint: StylelintInstance,
    formatter: StylelintFormatter,
    options: StylelintPluginOptions,
  ): LintFiles =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async (files, context) =>
    await stylelint
      .lint({ ...getStylelintLinterOptions(options), files })
      .then(async (linterResult: StylelintLinterResult | void) => {
        // do nothing when there are no results
        if (!linterResult || linterResult.results.length === 0) return;

        const { emitError, emitErrorAsWarning, emitWarning, emitWarningAsError } = options;

        const result = { ...linterResult };
        let results = linterResult.results.filter((result) => !result.ignored);
        // remove errors if emitError is false
        if (!emitError) {
          results = results.map((result) => ({
            ...result,
            warnings: result.warnings.filter((warning) => warning.severity !== 'error'),
          }));
          result.errored = false;
        }
        // remove warnings if emitWarning is false
        if (!emitWarning) {
          results = results.map((result) => ({
            ...result,
            warnings: result.warnings.filter((warning) => warning.severity !== 'warning'),
          }));
        }
        // remove results without errors and warnings
        results = results.filter((result) => result.warnings.length > 0);
        result.results = results;

        // do nothing when there are no results after processed
        if (results.length === 0) return;

        const text = formatter(results, result);
        let textType: TextType;
        if (result.errored) {
          textType = emitErrorAsWarning ? 'warning' : 'error';
        } else {
          textType = emitWarningAsError ? 'error' : 'warning';
        }

        return print(text, textType, context);
      });

export const getWatcher = (lintFiles: LintFiles, { include, exclude }: StylelintPluginOptions) => {
  return chokidar.watch(include, { ignored: exclude }).on('change', async (path) => {
    const fullPath = resolve(cwd, path);
    await lintFiles(fullPath);
  });
};
