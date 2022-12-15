import { resolve } from 'node:path';
import chokidar from 'chokidar';
import pico from 'picocolors';
import type { Colors } from 'picocolors/types';
import type {
  StylelintPluginOptions,
  StylelintPluginUserOptions,
  LintFiles,
  StylelintLinterOptions,
  StylelintInstance,
  StylelintLinterResult,
  StylelintFormatter,
  TextType,
} from './types';
import type * as Rollup from 'rollup';
import { createFilter } from '@rollup/pluginutils';

export const cwd = process.cwd();

export const pluginName = 'vite:stylelint';

export const colorMap: Record<TextType, keyof Omit<Colors, 'isColorSupported'>> = {
  error: 'red',
  warning: 'yellow',
  plugin: 'magenta',
};

// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importMetaGlob.ts
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
export const isVirtualModule = (id: string) =>
  id.startsWith('virtual:') || id.startsWith('\0') || !id.includes('/');

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
  hasPluginName = false,
  isColorized = false,
) => {
  let t = text;
  if (!hasPluginName) t += `  Plugin: ${colorize(pluginName, 'plugin')}\n`;
  if (!isColorized) t = colorize(t, textType);
  console.log(t);
};

export const print = (
  text: string,
  textType: TextType,
  {
    hasPluginName = false,
    isColorized = false,
    options,
    context,
  }: {
    hasPluginName?: boolean;
    isColorized?: boolean;
    options?: StylelintPluginOptions;
    context?: Rollup.PluginContext;
  } = {},
) => {
  console.log('');
  if (context && options) {
    return contextPrint(text, textType, options, context);
  }
  return customPrint(text, textType, hasPluginName, isColorized);
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
  const module = await import(stylelintPath);
  const stylelint = (module?.default ?? module) as StylelintInstance;
  const loadedFormatter =
    typeof formatter === 'string' ? stylelint.formatters[formatter] : formatter;
  return { stylelint, formatter: loadedFormatter };
};

export const getLintFiles =
  (
    stylelint: StylelintInstance,
    formatter: StylelintFormatter,
    options: StylelintPluginOptions,
  ): LintFiles =>
  async (files, { context, isLintedOnStart = false } = {}) =>
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

        if (!isLintedOnStart && options.chokidar) return print(text, textType);
        return print(text, textType, { options, context });
      });

export const getWatcher = (lintFiles: LintFiles, { include, exclude }: StylelintPluginOptions) => {
  return chokidar.watch(include, { ignored: exclude }).on('change', async (path) => {
    const fullPath = resolve(cwd, path);
    await lintFiles(fullPath);
  });
};
