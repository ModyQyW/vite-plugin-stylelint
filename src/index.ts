import { createFilter, normalizePath } from '@rollup/pluginutils';
import fs from 'node:fs';
import path from 'node:path';
import type * as Vite from 'vite';
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

export default function StylelintPlugin(options: StylelintPluginOptions = {}): Vite.Plugin {
  const cache = options?.cache ?? true;
  const cacheLocation =
    options?.cacheLocation ?? path.join('node_modules', '.vite', 'vite-plugin-stylelint');
  const include = options?.include ?? [
    'src/**/*.css',
    'src/**/*.scss',
    'src/**/*.sass',
    'src/**/*.less',
    'src/**/*.styl',
    'src/**/*.vue',
    'src/**/*.svelte',
  ];
  const exclude = options?.exclude ?? ['node_modules', 'virtual:'];
  const stylelintPath = options?.stylelintPath ?? 'stylelint';
  const lintOnStart = options?.lintOnStart ?? false;
  const emitError = options?.emitError ?? true;
  const emitErrorAsWarning = options?.emitErrorAsWarning ?? false;
  const emitWarning = options?.emitWarning ?? true;
  const emitWarningAsError = options?.emitWarningAsError ?? false;

  const filter = createFilter(include, exclude);
  const isVirtualModule = (file: fs.PathLike) => !fs.existsSync(file);

  let stylelint: Stylelint.PublicApi;
  let lintFiles: (files: FilterPattern) => Promise<void>;

  return {
    name: 'vite:stylelint',
    async buildStart() {
      // initial
      if (!stylelint) {
        try {
          const module = await import(stylelintPath);
          stylelint = module.default;
          lintFiles = async (files) =>
            await stylelint
              .lint({
                ...options,
                allowEmptyInput: true,
                cache,
                cacheLocation,
                files,
              })
              .then((lintResults: Stylelint.LinterResult | void) => {
                if (!lintResults) return;

                const { results } = lintResults;
                results.forEach((result) => {
                  const { warnings, ignored } = result;
                  if (!ignored) {
                    warnings.forEach((warning) => {
                      console.log('');
                      const { severity, text, line, column } = warning;
                      if (severity === 'error' && emitError) {
                        if (emitErrorAsWarning) {
                          this.warn(text, { line, column });
                        } else {
                          this.error(text, { line, column });
                        }
                      } else if (severity === 'warning' && emitWarning) {
                        if (emitWarningAsError) {
                          this.error(text, { line, column });
                        } else {
                          this.warn(text, { line, column });
                        }
                      }
                    });
                  }
                });
              })
              .catch((error) => {
                console.log('');
                this.error(`${error?.message ?? error}`);
              });
        } catch (error) {
          console.log('');
          this.error(
            `${
              (error as Error)?.message ??
              'Failed to import Stylelint. Have you installed and configured correctly?'
            }`,
          );
        }
      }

      // lint on start
      if (lintOnStart) {
        await lintFiles(include);
      }
    },
    async transform(_, id) {
      // id should be ignored: vite-plugin-eslint/examples/vue/index.html
      // file should be ignored: vite-plugin-eslint/examples/vue/index.html

      // id should be ignored: vite-plugin-eslint/examples/vue/index.html?html-proxy&index=0.css
      // file should be ignored: vite-plugin-eslint/examples/vue/index.html

      // id should NOT be ignored: vite-plugin-eslint/examples/vue/src/app.vue
      // file should NOT be ignored: vite-plugin-eslint/examples/vue/src/app.vue

      // id should be ignored in first time but should not be ignored in HMR: vite-plugin-eslint/examples/vue/src/app.vue?vue&type=style&index=0&lang.css
      // file should NOT be ignored: vite-plugin-eslint/examples/vue/src/app.vue

      const file = normalizePath(id).split('?')[0];

      // using filter(file) here may cause double lint
      // PR is welcome
      if (!filter(file) || isVirtualModule(file)) {
        return null;
      }

      await lintFiles(file);

      return null;
    },
  };
}
