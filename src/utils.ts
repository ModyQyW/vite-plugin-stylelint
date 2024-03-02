import pico from 'picocolors';
import { createFilter, normalizePath } from '@rollup/pluginutils';
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
import { COLOR_MAPPING, PLUGIN_NAME, STYLELINT_SEVERITY } from './constants';

export const getOptions = ({
  test,
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
  lintDirtyOnly,
  chokidar,
  emitError,
  emitErrorAsWarning,
  emitWarning,
  emitWarningAsError,
  ...stylelintOptions
}: StylelintPluginUserOptions): StylelintPluginOptions => ({
  test: test ?? false,
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
  lintDirtyOnly: lintDirtyOnly ?? true,
  chokidar: chokidar ?? false,
  emitError: emitError ?? true,
  emitErrorAsWarning: emitErrorAsWarning ?? false,
  emitWarning: emitWarning ?? true,
  emitWarningAsError: emitWarningAsError ?? false,
  ...stylelintOptions,
});

export const getFilter = (options: StylelintPluginOptions) =>
  createFilter(options.include, options.exclude);

export const initializeStylelint = async (options: StylelintPluginOptions) => {
  const { stylelintPath, formatter } = options;
  try {
    const module = await import(stylelintPath);
    const stylelintInstance = (module?.default ?? module) as StylelintInstance;
    const loadedFormatter: StylelintFormatter =
      typeof formatter === 'string' ? await stylelintInstance.formatters[formatter] : formatter;
    // use as here to avoid typescript error
    // src/utils.ts(58,14): error TS2742: The inferred type of 'initializeStylelint' cannot be named without a reference to '.pnpm/postcss@8.4.27/node_modules/postcss'. This is likely not portable. A type annotation is necessary.
    return { stylelintInstance, formatter: loadedFormatter } as {
      stylelintInstance: StylelintInstance;
      formatter: StylelintFormatter;
    };
  } catch (error) {
    throw new Error(
      `Failed to initialize Stylelint. Have you installed and configured correctly? ${error}`,
    );
  }
};

export const getStylelintLinterOptions = (
  options: StylelintPluginOptions,
): StylelintLinterOptions => ({
  ...options,
  allowEmptyInput: true,
});

// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importMetaGlob.ts
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
export const isVirtualModule = (id: string) =>
  id.startsWith('virtual:') || id[0] === '\0' || !id.includes('/');

export const getFilePath = (id: string) => normalizePath(id).split('?')[0];

export const shouldIgnoreModule = (id: string, filter: Filter) => {
  // virtual module
  if (isVirtualModule(id)) return true;
  // not included
  if (!filter(id)) return true;
  // not chokidar: should only include xxx.vue?type=style or yyy.svelte?type=style style modules
  // chokidar: should include xxx.vue or yyy.svelte
  const filePath = getFilePath(id);
  if (['.vue', '.svelte'].some((extname) => filePath.endsWith(extname))) {
    return !(id.includes('?') && id.includes('type=style'));
  }
  return false;
};

export const colorize = (text: string, textType: TextType) => pico[COLOR_MAPPING[textType]](text);

export const log = (text: string, textType: TextType, context?: Rollup.PluginContext) => {
  if (context) {
    if (textType === 'error') {
      context.error(text);
    } else if (textType === 'warning') context.warn(text);
  } else {
    const t = colorize(`${text}  Plugin: ${colorize(PLUGIN_NAME, 'plugin')}\r\n`, textType);
    console.log(t);
  }
};

export const lintFiles: LintFiles = async (
  { files, stylelintInstance, formatter, options },
  context,
) =>
  await stylelintInstance
    .lint({ ...getStylelintLinterOptions(options), files })
    .then(async (linterResult: StylelintLinterResult | void) => {
      // do nothing when there are no results
      if (!linterResult || linterResult.results.length === 0) return;
      let results = linterResult.results.filter((item) => !item.ignored);
      if (!options.emitError) {
        results = results.map((item) => ({
          ...item,
          warnings: item.warnings.filter(
            (warning) => warning.severity !== STYLELINT_SEVERITY.ERROR,
          ),
        }));
        linterResult.errored = false;
      }
      if (!options.emitWarning) {
        results = results.map((item) => ({
          ...item,
          warnings: item.warnings.filter(
            (warning) => warning.severity !== STYLELINT_SEVERITY.WARNING,
          ),
        }));
      }
      results = results.filter((item) => item.warnings.length > 0);
      if (results.length === 0) return;

      linterResult.results = results;
      const formattedText = formatter(results, linterResult);
      const formattedTextType: TextType = linterResult.errored
        ? options.emitErrorAsWarning
          ? 'warning'
          : 'error'
        : options.emitWarningAsError
          ? 'error'
          : 'warning';
      // log out errors or warnings info in the terminal.
      log(formattedText, formattedTextType, context);
      // trigger we.send error in hotmodule update without context
      if (linterResult.errored && !context) throw new Error(linterResult.report);
    });
