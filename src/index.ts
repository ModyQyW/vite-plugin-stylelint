import { Worker } from 'node:worker_threads';
import { extname, resolve } from 'node:path';
import { normalizePath } from '@rollup/pluginutils';
import {
  getFilter,
  getOptions,
  getLintFiles,
  getWatcher,
  initialStylelint,
  isVirtualModule,
  pluginName,
} from './utils';
import type * as Vite from 'vite';
import type { FSWatcher } from 'chokidar';
import type {
  LintFiles,
  StylelintInstance,
  StylelintFormatter,
  StylelintPluginUserOptions,
} from './types';

const ext = extname(__filename);

export default function StylelintPlugin(userOptions: StylelintPluginUserOptions = {}): Vite.Plugin {
  const options = getOptions(userOptions);
  const filter = getFilter(options);
  let stylelint: StylelintInstance;
  let formatter: StylelintFormatter;
  let lintFiles: LintFiles;
  let watcher: FSWatcher;
  let worker: Worker;

  return {
    name: pluginName,
    apply(_, { command }) {
      if (command === 'serve' && options.dev) return true;
      if (command === 'build' && options.build) return true;
      return false;
    },
    async buildStart() {
      // initial worker
      if (!worker && options.lintInWorker) {
        worker = new Worker(resolve(__dirname, `worker${ext}`), {
          workerData: { options },
        });
        // lint on start in worker
        if (options.lintOnStart) {
          worker.postMessage(options.include);
        }
        return;
      }
      // initial stylelint
      if (!stylelint) {
        const result = await initialStylelint(options);
        stylelint = result.stylelint;
        formatter = result.formatter;
        lintFiles = getLintFiles(stylelint, formatter, options);
      }
      // initial chokidar
      if (!watcher && options.chokidar) {
        watcher = getWatcher(lintFiles, options);
      }
      // lint on start
      if (options.lintOnStart) {
        this.warn(
          `\nStylelint is linting all files in the project because \`lintOnStart\` is true. This will significantly slow down Vite.`,
        );
        await lintFiles(options.include, this);
      }
    },
    async transform(_, id) {
      // chokidar
      if (options.chokidar) return null;
      const file = normalizePath(id).split('?')[0];
      // using filter(file) here may cause double lint, PR welcome
      if (!filter(file) || isVirtualModule(id)) return null;
      if (worker) worker.postMessage(file);
      else await lintFiles(file, this);
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
