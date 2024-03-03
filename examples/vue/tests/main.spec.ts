import { test, expect } from '@playwright/test';
import { RollupError } from 'rollup';
import { writeFile, parseModule } from 'magicast';

import {
  ViteDevServer,
  Logger,
  loadConfigFromFile,
  UserConfig,
  InlineConfig,
  mergeConfig,
  createServer,
  ConfigEnv,
  build,
} from 'vite';

export let viteServer: ViteDevServer;

// save log action into config, then we can get the log action in plugin hooks
const serverLogs: string[] = [];
// test.beforeEach('clear all server logs', () => serverLogs.length = 0);
let devServer: ViteDevServer | undefined;
const rootPath = process.cwd();
/**
 * TEST BLOCK 1:
 * DON'T apply this plugin based on some options.
 */
test.beforeEach('clear all server logs', () => {
  serverLogs.length = 0;
  process.env['PLAYWRIGHT_TEST'] = 'true';
});
test.afterEach('close the current server', () => {
  devServer?.close();
});
test('mode: test, test: false', async ({ page }) => {
  const configModule = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';

  export default defineConfig({
    plugins: [vue(), stylelint({test: false}), inspect()],
    mode: 'test',
  });`);

  await writeFile(configModule, './vite.config.ts');
  devServer = devServer = await startDefaultServe('serve');
  expect(serverLogs[0]).toEqual('should apply this plugin: false');
});

test('mode: test, test: true', async ({ page }) => {
  const configModule = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';

  export default defineConfig({
    plugins: [vue(), stylelint({test: true}), inspect()],
    mode: 'test',
  });`);

  await writeFile(configModule, './vite.config.ts');
  devServer = await startDefaultServe('serve');
  expect(serverLogs[0]).toEqual('should apply this plugin: true');
});

// For serve cli, dev option:
test('command: serve, dev: true', async ({ page }) => {
  const configModule = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';
  export default defineConfig({
    plugins: [vue(), stylelint({ dev: true }), inspect()],
  });`);
  await writeFile(configModule, './vite.config.ts');
  devServer = await startDefaultServe('serve');
  expect(serverLogs[0]).toEqual('should apply this plugin: true');
});
test('command: serve, dev: false', async ({ page }) => {
  const configModule = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';
  export default defineConfig({
    plugins: [vue(), stylelint({ dev: false }), inspect()],
  });`);
  await writeFile(configModule, './vite.config.ts');
  devServer = await startDefaultServe('serve');
  expect(serverLogs[0]).toEqual('should apply this plugin: false');
});

// // For build cli, build option:
test('command: build, build: true', async ({ page }) => {
  const moduleWithTestMode = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';

  export default defineConfig({
    plugins: [vue(), stylelint({build: true}), inspect()],
  });`);
  await writeFile(moduleWithTestMode, './vite.config.ts');
  devServer = await startDefaultServe('build');
  expect(serverLogs[0]).toEqual('should apply this plugin: true');
});

test('command: build, build: false', async ({ page }) => {
  const moduleWithTestMode = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';

  export default defineConfig({
    plugins: [vue(), stylelint({build: false}), inspect()],
  });`);
  await writeFile(moduleWithTestMode, './vite.config.ts');
  devServer = await startDefaultServe('build');
  expect(serverLogs).toContainEqual('should apply this plugin: false');
});

test('with cache', async ({ page }) => {
  process.env['DEBUG'] = 'vite:stylelint';

  const moduleWithTestMode = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';

  export default defineConfig({
    plugins: [vue(), stylelint({ lintOnStart: true, cache: true }), inspect()],
  });`);
  await writeFile(moduleWithTestMode, './vite.config.ts');
  devServer = await startDefaultServe('serve');
  expect(serverLogs).toContainEqual('lint.cache: true');
});
test('without cache', async ({ page }) => {
  process.env['DEBUG'] = 'vite:stylelint';

  const moduleWithTestMode = parseModule(`
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import stylelint from 'vite-plugin-stylelint';
  import inspect from 'vite-plugin-inspect';

  export default defineConfig({
    plugins: [vue(), stylelint({ lintOnStart: true, cache: false }), inspect()],
  });`);
  await writeFile(moduleWithTestMode, './vite.config.ts');
  devServer = await startDefaultServe('serve');
  expect(serverLogs[1]).toEqual('lint.cache: false');
});
// Function blocks, from vite-plugin-vue test setup
export async function startDefaultServe(
  command: 'build' | 'serve',
): Promise<ViteDevServer | undefined> {
  let config: UserConfig | null = null;
  const res = await loadConfigFromDir(rootPath, { command });
  if (res) {
    config = res.config;
  }

  const options: InlineConfig = {
    root: rootPath,
    logLevel: 'silent',
    configFile: false,
    server: {
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
      host: true,
    },
    build: {
      // esbuild do not minify ES lib output since that would remove pure annotations and break tree-shaking
      // skip transpilation during tests to make it faster
      target: 'esnext',
      // tests are flaky when `emptyOutDir` is `true`
      emptyOutDir: false,
    },
    customLogger: createInMemoryLogger(serverLogs),
  };
  const testConfig = mergeConfig(options, config || {});
  if (command === 'build') {
    // node.process.stdout.clearLine can't be accessed in playwright test, vite build use this api, so we assign a blank function to it and cursorTo.
    process.stdout.clearLine = () => true;
    process.stdout.cursorTo = () => true;
    await build(testConfig);
  } else if (command === 'serve') {
    viteServer = await createServer(testConfig);
    await viteServer.listen();
    return viteServer;
  }
}
function loadConfigFromDir(dir: string, configEnv: ConfigEnv) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return loadConfigFromFile(configEnv, undefined, dir);
}

export function createInMemoryLogger(logs: string[]): Logger {
  const loggedErrors = new WeakSet<Error | RollupError>();
  const warnedMessages = new Set<string>();

  const logger = {
    hasWarned: false,
    hasErrorLogged: (err) => loggedErrors.has(err),
    clearScreen: () => {},
    info(msg) {
      logs.push(msg);
    },
    warn(msg) {
      logs.push(msg);
      logger.hasWarned = true;
    },
    warnOnce(msg) {
      if (warnedMessages.has(msg)) return;
      logs.push(msg);
      logger.hasWarned = true;
      warnedMessages.add(msg);
    },
    error(msg, opts) {
      logs.push(msg);
      if (opts?.error) {
        loggedErrors.add(opts.error);
      }
    },
  };

  return logger;
}
