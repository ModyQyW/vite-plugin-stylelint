import { normalizePath } from 'vite';
import type * as Vite from 'vite';
import type { FSWatcher } from 'chokidar';
import {
  getFilter,
  getOptions,
  getLintFiles,
  getWatcher,
  initialStylelint,
  isVirtualModule,
  pluginName,
} from './utils';
import type {
  LintFiles,
  StylelintInstance,
  StylelintFormatter,
  StylelintPluginUserOptions,
} from './types';

export default function StylelintPlugin(userOptions: StylelintPluginUserOptions = {}): Vite.Plugin {
  const options = getOptions(userOptions);
  const filter = getFilter(options);
  let stylelint: StylelintInstance;
  let formatter: StylelintFormatter;
  let lintFiles: LintFiles;
  let watcher: FSWatcher;

  return {
    name: pluginName,
    apply(_, { command }) {
      if (command === 'serve' && options.dev) return true;
      if (command === 'build' && options.build) return true;
      return false;
    },
    async buildStart() {
      // initial
      if (!stylelint) {
        const result = await initialStylelint(options, this);
        stylelint = result.stylelint;
        formatter = result.formatter;
        lintFiles = getLintFiles(stylelint, formatter, options);
      }
      // lint on start
      if (options.lintOnStart) {
        console.log('');
        this.warn(
          `Stylelint is linting all files in the project because \`lintOnStart\` is true. This will significantly slow down Vite.`,
        );
        await lintFiles(this, options.include, true);
      }
      // chokidar
      if (options.chokidar) {
        watcher = getWatcher(lintFiles, options, this);
      }
    },
    async transform(_, id) {
      // chokidar
      if (options.chokidar) return null;
      const file = normalizePath(id).split('?')[0];
      // using filter(file) here may cause double lint, PR welcome
      if (!filter(file) || isVirtualModule(id)) return null;
      await lintFiles(this, file);
      return null;
    },
    async buildEnd() {
      if (watcher?.close) await watcher.close();
    },
    async closeBundle() {
      if (watcher?.close) await watcher.close();
    },
  };
}
