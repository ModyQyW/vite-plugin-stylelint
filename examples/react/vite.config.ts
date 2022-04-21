import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@modyqyw/vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), stylelint()],
});
