import { dirname, extname, resolve } from 'node:path';
import { Worker } from 'node:worker_threads';

import { fileURLToPath } from 'node:url';
import debugWrap from 'debug';
import type * as Vite from 'vite';
import { PLUGIN_NAME } from './constants';
import type { StylelintFormatter, StylelintInstance, StylelintPluginUserOptions } from './types';
import { getFilter, getOptions, initializeStylelint, lintFiles, shouldIgnoreModule } from './utils';

const debug = debugWrap(PLUGIN_NAME);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ext = extname(__filename);
const isTesting = process.env['PLAYWRIGHT_TEST'] === 'true';

export default function StylelintPlugin(userOptions: StylelintPluginUserOptions = {}): Vite.Plugin {
  const options = getOptions(userOptions);

  let worker: Worker;

  const filter = getFilter(options);
  let stylelintInstance: StylelintInstance;
  let formatter: StylelintFormatter;
  let testLogger: Vite.Logger | undefined;
  return {
    name: PLUGIN_NAME,
    apply(config, { command }) {
      if (isTesting) testLogger = config.customLogger;
      debug(`==== apply hook ====`);
      if (config.mode === 'test' || process.env.VITEST) {
        debug(`should apply this plugin: ${options.test}`);

        // for playwright test .
        testLogger?.info(`should apply this plugin: ${options.test}`);
        return options.test;
      }
      const shouldApply =
        (command === 'serve' && options.dev) || (command === 'build' && options.build);
      debug(`should apply this plugin: ${shouldApply}`);

      // for playwright test.
      testLogger?.info(`should apply this plugin: ${shouldApply}`);
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
        debug(`Lint on start: begin`);
        testLogger?.info(`lint.cache: ${options.cache}`);
        await lintFiles(
          {
            files: options.include,
            stylelintInstance,
            formatter,
            options,
          },
          this,
        );
        debug(`Lint on start: end`);
      }
    },
    // this hook will be called before built-in transform, such as scss => css transformation, so we can lint scss code in  this hook.
    async handleHotUpdate(ctx) {
      const fileName = ctx.file;
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
