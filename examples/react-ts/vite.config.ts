import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // Only for tests
    stylelint(),

    // Only for tests
    // stylelint({
    //   fix: true,
    // }),

    // Only for tests
    // stylelint({
    //   lintInWorker: true,
    //   lintOnStart: true,
    // }),

    // Recommended
    // stylelint({
    //   fix: true,
    //   lintInWorker: true,
    //   lintOnStart: true,
    // }),
  ],
});
