import { resolve } from 'node:path';
import chokidar from 'chokidar';
import pico from 'picocolors';
import { createFilter, normalizePath } from '@rollup/pluginutils';
import type { Colors } from 'picocolors/types';
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
import type * as Rollup from 'rollup';

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

export const contextPrint = (
  text: string,
  textType: TextType,
  { emitError, emitErrorAsWarning, emitWarning, emitWarningAsError }: StylelintPluginOptions,
  context: Rollup.PluginContext,
) => {
  if (textType === 'error' && emitError) {
    if (emitErrorAsWarning) context.warn(text);
    else context.error(text);
  }
  if (textType === 'warning' && emitWarning) {
    if (emitWarningAsError) context.error(text);
    else context.warn(text);
  }
};

export const customPrint = (
  text: string,
  textType: TextType,
  { emitError, emitErrorAsWarning, emitWarning, emitWarningAsError }: StylelintPluginOptions,
  hasPluginName = false,
  isColorized = false,
) => {
  let t = text;
  if (!hasPluginName) t += `  Plugin: ${colorize(pluginName, 'plugin')}\r\n`;
  if (textType === 'error' && emitError) {
    if (!isColorized) t = colorize(t, emitErrorAsWarning ? 'warning' : textType);
    console.log(t);
  }
  if (textType === 'warning' && emitWarning) {
    if (!isColorized) t = colorize(t, emitWarningAsError ? 'error' : textType);
    console.log(t);
  }
};

export const print = (
  text: string,
  textType: TextType,
  options: StylelintPluginOptions,
  {
    hasPluginName = false,
    isColorized = false,
    context,
  }: {
    context?: Rollup.PluginContext;
    hasPluginName?: boolean;
    isColorized?: boolean;
  } = {},
) => {
  console.log('');
  if (context && options) {
    return contextPrint(text, textType, options, context);
  }
  return customPrint(text, textType, options, hasPluginName, isColorized);
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
  async (files, context) =>
    await stylelint
      .lint({ ...getStylelintLinterOptions(options), files })
      .then(async (linterResult: StylelintLinterResult | void) => {
        if (!linterResult) return;

        const results = linterResult.results.filter(
          (result) => !result.ignored && result.warnings.length > 0,
        );
        if (results.length === 0) return;
        const text = formatter(results, linterResult);
        const textType = linterResult.errored ? 'error' : 'warning';

        if (context) return print(text, textType, options, { context });
        return print(text, textType, options);
      });

export const getWatcher = (lintFiles: LintFiles, { include, exclude }: StylelintPluginOptions) => {
  return chokidar.watch(include, { ignored: exclude }).on('change', async (path) => {
    const fullPath = resolve(cwd, path);
    await lintFiles(fullPath);
  });
};
