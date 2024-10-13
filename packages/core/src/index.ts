import { Worker } from 'node:worker_threads';
import { extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type * as Vite from 'vite';
import type { FSWatcher } from 'chokidar';
import chokidar from 'chokidar';
import debugWrap from 'debug';
import {
  getFilter,
  getOptions,
  shouldIgnoreModule,
  initializeStylelint,
  lintFiles,
  getFilePath,
} from './utils';
import type { StylelintInstance, StylelintFormatter, StylelintPluginUserOptions } from './types';
import { PLUGIN_NAME, CWD } from './constants';

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
      // lint on start if needed
      if (options.lintOnStart) {
        debug(`Lint on start`);
        await lintFiles(
          {
            files: options.include,
            stylelintInstance,
            formatter,
            options,
          },
          this, // use buildStart hook context
        );
      }
    },
    async transform(_, id) {
      debug('==== transform hook ====');
      // initialize watcher
      if (options.chokidar) {
        if (watcher) return;
        debug(`Initialize watcher`);
        watcher = chokidar
          .watch(options.include, { ignored: options.exclude })
          .on('change', async (path) => {
            debug(`==== change event ====`);
            const fullPath = resolve(CWD, path);
            // worker + watcher
            if (worker) return worker.postMessage(fullPath);
            // watcher only
            const shouldIgnore = await shouldIgnoreModule(fullPath, filter, true);
            debug(`should ignore: ${shouldIgnore}`);
            if (shouldIgnore) return;
            return await lintFiles(
              {
                files: options.lintDirtyOnly ? fullPath : options.include,
                stylelintInstance,
                formatter,
                options,
              },
              // this, // TODO: use transform hook context will breaks build
            );
          });
        return;
      }
      // no watcher
      debug('id: ', id);
      const filePath = getFilePath(id);
      debug(`filePath`, filePath);
      // worker
      if (worker) return worker.postMessage(filePath);
      // no worker
      const shouldIgnore = await shouldIgnoreModule(id, filter);
      debug(`should ignore: ${shouldIgnore}`);
      if (shouldIgnore) return;
      return await lintFiles(
        {
          files: options.lintDirtyOnly ? filePath : options.include,
          stylelintInstance,
          formatter,
          options,
        },
        this, // use transform hook context
      );
    },
    async buildEnd() {
      debug('==== buildEnd ====');
      if (watcher?.close) await watcher.close();
    },
  };
}

export { type StylelintPluginOptions, type StylelintPluginUserOptions } from './types';
