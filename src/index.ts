import { createFilter, normalizePath } from '@rollup/pluginutils';
import type Vite from 'vite';
import type Stylelint from 'stylelint';
import type { FilterPattern } from '@rollup/pluginutils';
import path from 'path';

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
  emitWarning?: boolean;
}

export default function StylelintPlugin(options: Options = {}): Vite.Plugin {
  const cache = options?.cache ?? true;
  const cacheLocation =
    options?.cacheLocation ?? path.join('node_modules', '.vite', 'vite-plugin-stylelint');
  const include = options?.include ?? [/.*\.(vue|css|scss|sass|less|styl)$/];
  let exclude = options?.exclude ?? [/node_modules/];
  const stylelintPath = options?.stylelintPath ?? 'stylelint';
  const emitError = options?.emitError ?? options?.throwOnError ?? true;
  const emitWarning = options?.emitWarning ?? options?.throwOnWarning ?? true;

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
      filter = createFilter(include, exclude);
    },
    async transform(_, id) {
      const file = normalizePath(id).split('?')[0];

      // avoid /fake/vite/project/path/index.html?html-proxy&index=0.css
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
        .then(({ results }) => {
          results.forEach((result) => {
            const { warnings, ignored } = result;
            if (!ignored) {
              warnings.forEach((warning) => {
                console.log('');
                const { severity, text } = warning;
                if (severity === 'error' && emitError) {
                  this.error(text);
                } else if (severity === 'warning' && emitWarning) {
                  this.warn(text);
                }
              });
            }
          });
        });

      return null;
    },
  };
}
