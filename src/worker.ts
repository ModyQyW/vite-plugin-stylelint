import { workerData, parentPort } from 'node:worker_threads';
import { initialStylelint, getLintFiles, getWatcher } from './utils';
import type { FSWatcher } from 'chokidar';
import type { StylelintInstance, StylelintFormatter, LintFiles } from './types';

const { options } = workerData;

console.log('options', options);

let stylelint: StylelintInstance;
let formatter: StylelintFormatter;
let lintFiles: LintFiles;
let watcher: FSWatcher;

parentPort?.on('message', async (value) => {
  if (!stylelint) {
    const result = await initialStylelint(options);
    stylelint = result.stylelint;
    formatter = result.formatter;
    lintFiles = getLintFiles(stylelint, formatter, options);
  }
  if (!watcher && options.chokidar) {
    watcher = getWatcher(lintFiles, options);
  }
  lintFiles(value.files);
});
