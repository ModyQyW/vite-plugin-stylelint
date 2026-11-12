# FAQ

## Should I use this plugin?

Most of the time you don't need it.

[stylelint-webpack-plugin](https://github.com/webpack-contrib/stylelint-webpack-plugin) is common in Webpack, and this plugin does roughly the same job for Vite.

Your editor already shows the same information. In VS Code you add the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint); WebStorm ships the feature. You can also run Stylelint from the CLI or in CI.

With all of those options, running Stylelint inside Vite is rarely necessary. If you do want errors and warnings while Vite runs, turn on `lintInWorker` so the checks stay off the build thread and print to the console. [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) is another choice.

## Cache looks broken?

Delete the cache file, fix the problem by hand, then restart Vite.

## The plugin is slow?

By default the plugin lints on the main thread, which can block. Turn on `lintInWorker` to keep Vite responsive and print results to the console. [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) is an alternative, as is running Stylelint next to Vite instead of inside it.

## Recommended configuration?

```ts
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
  plugins: [stylelint({
    fix: true,
    customOverlay: true,
    lintInWorker: true,
    lintOnStart: true,
  })],
});
```

`customOverlay` only applies under `serve`, and `fix` rewrites files while you work — drop either one if it doesn't suit your setup.

## Why is the error output all red?

Vite's native error overlay does not render `PluginContext.warn` output and shows Stylelint's ANSI-colored string verbatim, which loses the color distinctions in the browser. These limitations are tracked upstream in [#2076](https://github.com/vitejs/vite/issues/2076), [#6274](https://github.com/vitejs/vite/pull/6274) and [#8327](https://github.com/vitejs/vite/discussions/8327).

Set `customOverlay: true` to render the results natively instead, with errors and warnings styled separately.
