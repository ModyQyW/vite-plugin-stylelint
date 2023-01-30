import { workerData, parentPort } from 'node:worker_threads';
import type { FSWatcher } from 'chokidar';
import { initialStylelint, getLintFiles, getWatcher } from './utils';
import type { StylelintInstance, StylelintFormatter, LintFiles } from './types';

const { options } = workerData;

let stylelint: StylelintInstance;
let formatter: StylelintFormatter;
let lintFiles: LintFiles;
let watcher: FSWatcher;

parentPort?.on('message', async (files) => {
  if (!stylelint) {
    const result = await initialStylelint(options);
    stylelint = result.stylelint;
    formatter = result.formatter;
    lintFiles = getLintFiles(stylelint, formatter, options);
  }
  if (!watcher && options.chokidar) {
    watcher = getWatcher(lintFiles, options);
  }
  lintFiles(files);
});
