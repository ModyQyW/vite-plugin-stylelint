import * as path from 'path';
import type { Plugin } from 'vite';
import * as stylelint from 'stylelint';
import { createFilter } from '@rollup/pluginutils';

import { normalizePath, Options } from './utils';

export default function StylelintPlugin(options: Options = {}): Plugin {
  const cache = options?.cache ?? true;
  const cacheLocation = path.resolve(
    process.cwd(),
    'node_modules',
    '.vite',
    'vite-plugin-stylelint',
  );
  const fix = options?.fix ?? false;
  const include = options?.include ?? /.*\.(vue|css|scss|sass|less|styl)/;
  const exclude = options?.exclude ?? /node_modules/;
  const formatter = options?.formatter ?? 'string';
  const throwOnError = options?.throwOnError ?? true;
  const throwOnWarning = options?.throwOnWarning ?? true;

  const filter = createFilter(include, exclude);

  return {
    name: 'vite:stylelint',
    async transform(_, id) {
      const file = normalizePath(id);

      if (!filter(id)) {
        return null;
      }

      await stylelint
        .lint({
          files: file,
          allowEmptyInput: true,
          cache,
          cacheLocation,
          fix,
          formatter,
        })
        .then(({ results }) => {
          results.forEach((result) => {
            const { source, ignored } = result;
            if (!ignored) {
              result.warnings.forEach((warning) => {
                const { severity } = warning;
                if (severity === 'error' && throwOnError) {
                  this.error(
                    `${warning.text}\r\n    at ${source}:${warning.line}:${warning.column}`,
                    {
                      column: warning.column,
                      line: warning.line,
                    },
                  );
                } else if (severity === 'warning' && throwOnWarning) {
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
