import { createFilter, normalizePath } from '@rollup/pluginutils';
import type * as Vite from 'vite';
import type * as Stylelint from 'stylelint';
import type { FilterPattern } from '@rollup/pluginutils';
import * as path from 'path';

export interface Options extends Stylelint.LinterOptions {
  cache?: boolean;
  cacheLocation?: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  stylelintPath?: string;
  /** @deprecated Recommend to use `emitError` */
  throwOnError?: boolean;
  /** @deprecated Recommend to use `emitWarning` */
  throwOnWarning?: boolean;
  emitError?: boolean;
  emitErrorAsWarning?: boolean;
  emitWarning?: boolean;
  emitWarningAsError?: boolean;
}

export default function StylelintPlugin(options: Options = {}): Vite.Plugin {
  const cache = options?.cache ?? true;
  const cacheLocation =
    options?.cacheLocation ?? path.join('node_modules', '.vite', 'vite-plugin-stylelint');
  const include = options?.include ?? [/.*\.(vue|css|scss|sass|less|styl|svelte)$/];
  let exclude = options?.exclude ?? [/node_modules/];
  const stylelintPath = options?.stylelintPath ?? 'stylelint';
  const emitError = options?.emitError ?? options?.throwOnError ?? true;
  const emitErrorAsWarning = options?.emitErrorAsWarning ?? false;
  const emitWarning = options?.emitWarning ?? options?.throwOnWarning ?? true;
  const emitWarningAsError = options?.emitWarningAsError ?? false;

  let filter: (id: string | unknown) => boolean;
  let stylelint: Stylelint.PublicApi;

  return {
    name: 'vite:stylelint',
    configResolved(config) {
      // convert exclude to array
      // push config.build.outDir into exclude
      if (Array.isArray(exclude)) {
        exclude.push(config.build.outDir);
      } else {
        exclude = [exclude as string | RegExp, config.build.outDir].filter((item) => !!item);
      }
      // create filter
      filter = createFilter(include, exclude);
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
      if (!filter(file)) {
        return null;
      }

      // initial stylelint
      if (!stylelint) {
        await import(stylelintPath)
          .then((module) => {
            stylelint = module.default;
          })
          .catch(() => {
            console.log('');
            this.error(`Failed to import Stylelint. Have you installed and configured correctly?`);
          });
      }

      // actual lint
      await stylelint
        .lint({
          ...options,
          cache,
          cacheLocation,
          files: file,
        })
        // catch config error
        .catch((error) => {
          console.log('');
          this.error(`${error?.message ?? error}`);
        })
        // lint results
        .then(({ results }: Stylelint.LinterResult) => {
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
        });

      return null;
    },
  };
}
