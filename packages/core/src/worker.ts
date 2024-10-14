import { parentPort, workerData } from "node:worker_threads";
import debugWrap from "debug";
import { PLUGIN_NAME } from "./constants";
import type {
  StylelintFormatter,
  StylelintInstance,
  StylelintPluginOptions,
} from "./types";
import {
  getFilter,
  initializeStylelint,
  lintFiles,
  shouldIgnoreModule,
} from "./utils";

const debug = debugWrap(`${PLUGIN_NAME}:worker`);

const options = workerData.options as StylelintPluginOptions;
const filter = getFilter(options);
let stylelintInstance: StylelintInstance;
let formatter: StylelintFormatter;

const initPromise = initializeStylelint(options).then((result) => {
  stylelintInstance = result.stylelintInstance;
  formatter = result.formatter;
  return result;
});

// this file needs to be compiled into cjs, which doesn't support top-level await
// so we use iife here
(async () => {
  debug("==== worker start ====");
  debug("Initialize Stylelint");
  // remove this line will cause ts2454
  const { stylelintInstance, formatter } = await initPromise;
  if (options.lintOnStart) {
    debug("Lint on start");
    lintFiles({
      files: options.include,
      stylelintInstance,
      formatter,
      options,
    }); // don't use context
  }
})();

parentPort?.on("message", async (files) => {
  // make sure stylelintInstance is initialized
  if (!stylelintInstance) await initPromise;
  debug("==== message event ====");
  debug(`message: ${files}`);
  const shouldIgnore = await shouldIgnoreModule(
    files,
    filter,
    options.chokidar,
  );
  debug(`should ignore: ${shouldIgnore}`);
  if (shouldIgnore) return;
  lintFiles({
    files: options.lintDirtyOnly ? files : options.include,
    stylelintInstance,
    formatter,
    options,
  }); // don't use context
});
