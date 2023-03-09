import { workerData, parentPort } from 'node:worker_threads';
import type { FSWatcher } from 'chokidar';
import { initialStylelint, getLintFiles, getWatcher } from './utils';
import type { StylelintInstance, StylelintFormatter, LintFiles } from './types';

const { options } = workerData;

let stylelint: StylelintInstance;
let formatter: StylelintFormatter;
let lintFiles: LintFiles;
let watcher: FSWatcher;

// this file needs to be compiled into cjs, which doesn't support top-level await

(async () => {
  const result = await initialStylelint(options);
  stylelint = result.stylelint;
  formatter = result.formatter;
  lintFiles = getLintFiles(stylelint, formatter, options);
  if (options.chokidar) {
    watcher = getWatcher(lintFiles, options);
  }
})();

parentPort?.on('message', async (files) => {
  lintFiles(files);
});

parentPort?.on('close', async () => {
  if (watcher?.close) {
    await watcher.close();
  }
});
