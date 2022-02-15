import path from 'path';
import type { Plugin } from 'vite';
import stylelint from 'stylelint';
import { createFilter } from '@rollup/pluginutils';
import { normalizePath, type Options } from './utils';

export default function StylelintPlugin(options: Options = {}): Plugin {
  const cache = options?.cache ?? true;
  const cacheLocation =
    options?.cacheLocation ??
    path.resolve(
      process.cwd(),
      'node_modules',
      '.vite',
      'vite-plugin-stylelint',
    );
  const fix = options?.fix ?? false;
  const include = options?.include ?? /.*\.(vue|css|scss|sass|less|styl)$/;
  const exclude = options?.exclude ?? /node_modules/;
  const formatter = options?.formatter ?? 'string';
  const throwOnError = options?.throwOnError ?? true;
  const throwOnWarning = options?.throwOnWarning ?? true;

  const filter = createFilter(include, exclude);

  return {
    name: 'vite:stylelint',
    async transform(_, id) {
      const file = normalizePath(id);

      // if index.html has a style tag
      // id will be similar to index.html?html-proxy&index=0.css
      // file will be similar to index.html
      // we don't need to lint it by default
      // so use file rather than id here
      // if (!filter(id)) {

      if (!filter(file)) {
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
                  console.log('');
                  this.error(
                    `${warning.text}\r\n    at ${source}:${warning.line}:${warning.column}`,
                    {
                      column: warning.column,
                      line: warning.line,
                    },
                  );
                } else if (severity === 'warning' && throwOnWarning) {
                  console.log('');
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
