import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import type { AddonFunction, ExternalOption } from 'rollup';
import type { PackageJson } from 'type-fest';

const isDevelopment = process.env.ROLLUP_WATCH;
const isProduction = !isDevelopment;

const packageJson = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
) as PackageJson;
const { dependencies = {}, peerDependencies = {} } = packageJson;

const esBanner: AddonFunction = ({ modules }) => {
  const entries = Object.entries(modules);
  for (const [_, { code }] of entries) {
    if (code?.includes('__filename') && code?.includes('__dirname')) {
      return "import { fileURLToPath } from 'url'; const __filename = fileURLToPath(import.meta.url); const __dirname = fileURLToPath(new URL('.', import.meta.url));";
    }
    if (code?.includes('__dirname')) {
      return "import { fileURLToPath } from 'url'; const __dirname = fileURLToPath(new URL('.', import.meta.url));";
    }
    if (code?.includes('__filename')) {
      return "import { fileURLToPath } from 'url';const __filename = fileURLToPath(import.meta.url);";
    }
  }
  return '';
};
const external: ExternalOption = [...Object.keys(dependencies), ...Object.keys(peerDependencies)];

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      { file: './dist/index.cjs', format: 'cjs' },
      { file: './dist/index.js', format: 'es', banner: esBanner },
    ],
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        minify: false,
        target: 'node14.18',
        loaders: {
          '.json': 'json',
        },
      }),
      isProduction
        ? terser({
            compress: {
              drop_console: true,
            },
            format: {
              ascii_only: true,
            },
          })
        : null,
    ],
    external,
  },
  {
    input: './src/index.ts',
    output: { file: './dist/index.d.ts', format: 'es' },
    plugins: [dts()],
    external,
  },
  {
    input: './src/worker.ts',
    output: [
      { file: './dist/worker.cjs', format: 'cjs' },
      { file: './dist/worker.js', format: 'es', banner: esBanner },
    ],
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        minify: false,
        target: 'node14.18',
        loaders: {
          '.json': 'json',
        },
      }),
      isProduction
        ? terser({
            compress: {
              drop_console: true,
            },
            format: {
              ascii_only: true,
            },
          })
        : null,
    ],
    external,
  },
]);
