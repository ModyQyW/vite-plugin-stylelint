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
      // current file
      const filePath = getFilePath(id);
      debug(`id: ${id}`);
      debug(`filePath: ${filePath}`);
      // related files
      const watchFiles = this.getWatchFiles();
      const watchFilePaths = watchFiles.map((f) => getFilePath(f));
      debug(`watchFilePaths: ${watchFilePaths}`);
      // all files
      const paths = [filePath, ...watchFilePaths];
      // worker
      if (worker) {
        for (const p of paths) {
          worker.postMessage(p);
        }
        return;
      }
      // no worker
      // filtered
      const filtered = paths.filter((p) => !shouldIgnoreModule(p, filter));
      debug(`filtered: ${filtered}`);
      const shouldIgnore = filtered.length === 0;
      debug(`should ignore: ${shouldIgnore}`);
      if (shouldIgnore) return;
      return await lintFiles(
        {
          files: options.lintDirtyOnly ? filtered : options.include,
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

export {
  type StylelintPluginOptions,
  type StylelintPluginUserOptions,
} from "./types";
