# FAQ

## Should I use this plugin?

Most of the time, you don't need this plugin.

It is common to use [stylelint-webpack-plugin](https://github.com/webpack-contrib/stylelint-webpack-plugin) in Webpack. And this plugin does almost the same in Vite.

However, our IDE is already probably giving all the info we need. We only need to add [Stylelint plugin](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) in VSCode. WebStorm already includes the functionality. We can also run Stylelint in CI or CLI.

Since we have these ways to run Stylelint, it is unnecessary to run Stylelint in Vite, which means we don't need this plugin in most cases.

If you really want to check errors and warnings, try enable `lintInWorker` option, which keeps Vite speed and prints in console. Or [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker).

## Cache is broken?

Delete the cache file, fix the error manually and restart Vite.

## Plugin is running very slow?

By default, the plugin is synchronous, which may cause blocking. Please try to enable `lintInWorker` option, which keeps Vite speed and prints in console. You can also try [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker), or run Stylelint directly besides Vite.

## Recommended configuration?

```ts
import { defineConfig } from "vite";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
  plugins: [stylelint({
    lintInWorker: true,
    lintOnStart: true,
  })],
});

```

## Error messages in full red?

Vite's error mask layer does not support displaying `PluginContext.warn` information and full-color messages, and there are some limitations (see [#2076](https://github.com/vitejs/vite/issues/2076), [#6274](https://github.com/vitejs/vite/pull/6274) and [#8327](https://github.com/vitejs/vite/discussions/8327).
