import { Worker } from 'node:worker_threads';
import { extname, resolve, dirname } from 'node:path';

import { fileURLToPath } from 'node:url';
import type * as Vite from 'vite';
import type { FSWatcher } from 'chokidar';
import debugWrap from 'debug';
import { getFilter, getOptions, shouldIgnoreModule, initializeStylelint, lintFiles } from './utils';
import type { StylelintInstance, StylelintFormatter, StylelintPluginUserOptions } from './types';
import { PLUGIN_NAME } from './constants';

const debug = debugWrap(PLUGIN_NAME);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ext = extname(__filename);

export default function StylelintPlugin(userOptions: StylelintPluginUserOptions = {}): Vite.Plugin {
  const options = getOptions(userOptions);

  let worker: Worker;
  let watcher: FSWatcher;

  const filter = getFilter(options);
  let stylelintInstance: StylelintInstance;
  let formatter: StylelintFormatter;

  return {
    name: PLUGIN_NAME,
    apply(config, { command }) {
      debug(`==== apply hook ====`);
      if (config.mode === 'test' || process.env.VITEST) return options.test;
      const shouldApply =
        (command === 'serve' && options.dev) || (command === 'build' && options.build);
      debug(`should apply this plugin: ${shouldApply}`);
      return shouldApply;
    },
    async buildStart() {
      debug(`==== buildStart hook ====`);
      // initialize worker
      if (options.lintInWorker) {
        if (worker) return;
        debug(`Initialize worker`);
        worker = new Worker(resolve(__dirname, `worker${ext}`), { workerData: { options } });
        return;
      }
      // initialize Stylelint
      debug(`Initial Stylelint`);
      const result = await initializeStylelint(options);
      stylelintInstance = result.stylelintInstance;
      formatter = result.formatter;

      if (options.lintOnStart) {
        debug(`Lint on start`);
        await lintFiles(
          {
            files: options.include,
            stylelintInstance,
            formatter,
            options,
          },
          this,
        );
      }
    },
    async buildEnd() {
      debug('==== buildEnd ====');
      if (watcher?.close) await watcher.close();
    },
    // this hook will be called before built-in transform, such as scss => css transformation, so we can lint scss code in  this hook.
    async handleHotUpdate(ctx) {
      const fileName = ctx.file;
      console.log(ctx);
      const shouldIgnore = shouldIgnoreModule(fileName, filter);
      if (shouldIgnore) return;
      if (worker) {
        return worker.postMessage(fileName);
      }
      await lintFiles({
        files: options.lintDirtyOnly ? fileName : options.include,
        stylelintInstance,
        formatter,
        options,
      });
      // must return the changed modules
      return ctx.modules;
    },
  };
}

export { type StylelintPluginOptions, type StylelintPluginUserOptions } from './types';
