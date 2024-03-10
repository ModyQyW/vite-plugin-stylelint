import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import stylelint from 'vite-plugin-stylelint';
import inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [vue(), stylelint({ lintOnStart: true, cache: false }), inspect()],
});