import { normalizePath } from '@rollup/pluginutils';
import type * as Vite from 'vite';
import {
  getFilter,
  getFinalOptions,
  getLintFiles,
  initialStylelint,
  isVirtualModule,
} from './utils';
import type {
  Filter,
  LintFiles,
  StylelintInstance,
  StylelintFormatter,
  StylelintPluginOptions,
  StylelintPluginUserOptions,
} from './types';

export default function StylelintPlugin(options: StylelintPluginUserOptions = {}): Vite.Plugin {
  let opts: StylelintPluginOptions;
  let filter: Filter;
  let stylelint: StylelintInstance;
  let formatter: StylelintFormatter;
  let lintFiles: LintFiles;

  return {
    name: 'vite:stylelint',
    configResolved(config) {
      opts = getFinalOptions(options, config);
      filter = getFilter(opts);
    },
    async buildStart() {
      // initial
      if (!stylelint) {
        const result = await initialStylelint(opts, this);
        stylelint = result.stylelint;
        formatter = result.formatter;
        lintFiles = getLintFiles(stylelint, formatter, opts);
      }

      // lint on start
      if (opts.lintOnStart) {
        console.log('');
        this.warn(
          `Stylelint is linting all files in the project because \`lintOnStart\` is true. This will significantly slow down Vite.`,
        );
        await lintFiles(this, opts.include);
      }
    },
    async transform(_, id) {
      // id should be ignored: vite-plugin-stylelint/examples/vue/index.html
      // file should be ignored: vite-plugin-stylelint/examples/vue/index.html

      // id should be ignored: vite-plugin-stylelint/examples/vue/index.html?html-proxy&index=0.css
      // file should be ignored: vite-plugin-stylelint/examples/vue/index.html

      // id should NOT be ignored: vite-plugin-stylelint/examples/vue/src/app.vue
      // file should NOT be ignored: vite-plugin-stylelint/examples/vue/src/app.vue

      // id should be ignored in first time but should not be ignored in HMR: vite-plugin-stylelint/examples/vue/src/app.vue?vue&type=style&index=0&lang.css
      // file should NOT be ignored: vite-plugin-stylelint/examples/vue/src/app.vue

      const file = normalizePath(id).split('?')[0];

      // using filter(file) here may cause double lint
      // PR is welcome
      if (!filter(file) || isVirtualModule(id)) return null;

      await lintFiles(this, file);

      return null;
    },
  };
}
