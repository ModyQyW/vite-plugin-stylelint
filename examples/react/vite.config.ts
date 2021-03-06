import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@modyqyw/vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';
import inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), stylelint(), inspect()],
});
