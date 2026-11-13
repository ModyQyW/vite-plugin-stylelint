---
description: "When the plugin helps, how to recover from a broken cache, what makes linting slow, a recommended config, and why the output is all red."
---

# FAQ

## Should I use this plugin?

Usually not. Read [Why & Why not?](/guide/why) for the cases where the plugin helps, and for the cases where your editor, the CLI or CI already cover it.

Turn the plugin on when you want errors and warnings while Vite runs. Set `lintInWorker` so the checks stay off the build thread.

## Cache looks broken?

1. Delete the cache file.
2. Fix the problem by hand.
3. Restart Vite.

## The plugin is slow?

The plugin lints on the main thread by default. That can block the build.

Set `lintInWorker` to keep Vite responsive. Results print to the console.

You can also run Stylelint next to Vite instead of inside it. [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) is another choice.

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

`customOverlay` only applies under `serve`. `fix` rewrites files while you work. Drop either one if it does not suit your setup.

## Why is the error output all red?

Vite's native error overlay does not render `PluginContext.warn` output. It shows Stylelint's ANSI-colored string verbatim, so the color distinctions disappear in the browser.

These limits are tracked upstream in [#2076](https://github.com/vitejs/vite/issues/2076), [#6274](https://github.com/vitejs/vite/pull/6274) and [#8327](https://github.com/vitejs/vite/discussions/8327).

Set `customOverlay: true` to render the results natively. Errors and warnings get separate styling.
