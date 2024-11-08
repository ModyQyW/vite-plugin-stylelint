import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import debugWrap from "debug";
import type * as Vite from "vite";
import { PLUGIN_NAME } from "./constants";
import type {
  StylelintFormatter,
  StylelintInstance,
  StylelintPluginUserOptions,
} from "./types";
import {
  getFilePath,
  getFilter,
  getOptions,
  initializeStylelint,
  lintFiles,
  shouldIgnoreModule,
} from "./utils";

const debug = debugWrap(PLUGIN_NAME);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ext = extname(__filename);

export default function StylelintPlugin(
  userOptions: StylelintPluginUserOptions = {},
): Vite.Plugin {
  const options = getOptions(userOptions);

  let worker: Worker;

  const filter = getFilter(options);
  let stylelintInstance: StylelintInstance;
  let formatter: StylelintFormatter;

  return {
    name: PLUGIN_NAME,
    apply(config, { command }) {
      debug("==== apply hook ====");
      if (config.mode === "test" || process.env.VITEST) return options.test;
      const shouldApply =
        (command === "serve" && options.dev) ||
        (command === "build" && options.build);
      debug(`should apply this plugin: ${shouldApply}`);
      return shouldApply;
    },
    async buildStart() {
      debug("==== buildStart hook ====");
      // initialize worker
      if (options.lintInWorker) {
        if (worker) return;
        debug("Initialize worker");
        worker = new Worker(resolve(__dirname, `worker${ext}`), {
          workerData: { options },
        });
        return;
      }
      // initialize Stylelint
      debug("Initial Stylelint");
      const result = await initializeStylelint(options);
      stylelintInstance = result.stylelintInstance;
      formatter = result.formatter;
      // lint on start if needed
      if (options.lintOnStart) {
        debug("Lint on start");
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
      debug("==== transform hook ====");
      debug(`id: ${id}`);
      const watchIds = this.getWatchFiles();
      debug(`watchIds: ${watchIds}`);
      const ids = [id, ...watchIds];
      debug(`ids: ${ids}`);
      // worker
      if (worker) {
        for (const id of ids) {
          worker.postMessage(id);
        }
        return;
      }
      // no worker
      // filtered
      const filteredIds = ids.filter((id) => !shouldIgnoreModule(id, filter));
      debug(`filteredIds: ${filteredIds}`);
      const shouldIgnore = filteredIds.length === 0;
      debug(`should ignore: ${shouldIgnore}`);
      if (shouldIgnore) return;
      const filePaths = filteredIds.map((id) => getFilePath(id));
      return await lintFiles(
        {
          files: options.lintDirtyOnly ? filePaths : options.include,
          stylelintInstance,
          formatter,
          options,
        },
        this, // use transform hook context
      );
    },
    async buildEnd() {
      debug("==== buildEnd hook ====");
      if (worker) await worker.terminate();
    },
  };
}

export type {
  StylelintPluginOptions,
  StylelintPluginUserOptions,
} from "./types";
