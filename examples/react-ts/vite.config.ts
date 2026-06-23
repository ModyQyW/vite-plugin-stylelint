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


    // Only for tests
    // stylelint({
    //   customOverlay: true,
    //   // customOverlay: {
    //   //   position: "tl",
    //   //   initialIsOpen: true,
    //   //   zIndex: 99999,
    //   //   theme: {
    //   //     "--vite-plugin-stylelint-bg": "#1a1a2e",
    //   //     "--vite-plugin-stylelint-panel-bg": "#16213e",
    //   //     "--vite-plugin-stylelint-error": "#ff6b6b",
    //   //   },
    //   // },
    // }),

    // Recommended
    // stylelint({
    //   fix: true,
    //   lintInWorker: true,
    //   lintOnStart: true,
    //   customOverlay: true,
    // }),
  ],
});
