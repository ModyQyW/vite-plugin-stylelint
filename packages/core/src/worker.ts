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

// this file needs to be compiled into cjs, which doesn't support top-level await
// so we use iife here
(async () => {
  debug("==== worker start ====");
  debug("Initialize Stylelint");
  const result = await initializeStylelint(options);
  stylelintInstance = result.stylelintInstance;
  formatter = result.formatter;
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
