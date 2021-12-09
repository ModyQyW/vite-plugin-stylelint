import * as path from 'path';
import type { Plugin } from 'vite';
import * as stylelint from 'stylelint';
import type { LinterOptions } from 'stylelint';
import { createFilter } from '@rollup/pluginutils';

// import { checkVueFile, normalizePath, Options } from './utils';
import { checkVueFile, Options } from './utils';

export default function StylelintPlugin(options: Options = {}): Plugin {
  const defaultOptions: Options = {
    cache: true,
    fix: false,
    include: [
      'src/**/*.css',
      'src/**/*.less',
      'src/**/*.scss',
      'src/**/*.sass',
      'src/**/*.styl',
      'src/**/*.vue',
    ],
    throwOnWarning: true,
    throwOnError: true,
  };
  const linterOptions: Partial<LinterOptions> &
    Partial<{ throwOnWarning: boolean; throwOnError: boolean }> = {
    allowEmptyInput: true,
    cache: options.cache ?? defaultOptions.cache,
    cacheLocation: path.resolve(
      process.cwd(),
      // maybe vite config cacheDir is better ?
      './node_modules/.vite/vite-plugin-stylelint',
    ),
    config:
      options.exclude ?? defaultOptions.exclude
        ? {
            ignoreFiles: options.exclude ?? defaultOptions.exclude,
          }
        : undefined,
    files: options.include ?? defaultOptions.include,
    fix: options.fix ?? defaultOptions.fix,
    throwOnError: options.throwOnError ?? defaultOptions.throwOnError,
    throwOnWarning: options.throwOnWarning ?? defaultOptions.throwOnWarning,
  };
  const filter = createFilter(
    linterOptions.files,
    linterOptions.config?.ignoreFiles || /node_modules/,
  );

  return {
    name: 'vite:stylelint',
    async transform(_, id) {
      // const file = normalizePath(id);

      if (
        !filter(id) ||
        // (await eslint.isPathIgnored(file)) ||
        checkVueFile(id)
      ) {
        return null;
      }

      await stylelint
        .lint(linterOptions)
        .then(({ results }) => {
          results.forEach((result) => {
            const { source, ignored } = result;
            if (!ignored) {
              result.warnings.forEach((warning) => {
                const { severity } = warning;
                if (severity === 'error' && linterOptions.throwOnError) {
                  this.error(
                    `${warning.text}\r\n    at ${source}:${warning.line}:${warning.column}`,
                    {
                      column: warning.column,
                      line: warning.line,
                    },
                  );
                } else if (
                  severity === 'warning' &&
                  linterOptions.throwOnWarning
                ) {
                  this.warn(
                    `${warning.text}\r\n    at ${source}:${warning.line}:${warning.column}`,
                    {
                      column: warning.column,
                      line: warning.line,
                    },
                  );
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error(error.stack);
        });

      return null;
    },
  };
}
