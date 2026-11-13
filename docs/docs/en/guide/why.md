---
description: "When vite-plugin-stylelint helps, and when your editor, the Stylelint CLI or CI already does the job."
---

# Why & Why not?

## Why

This plugin runs Stylelint inside Vite. The project started as a fork of [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint), so Stylelint could run in the same place as the build.

[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) covers similar ground. Pick the one that fits your setup.

Stylelint only checks styles. To run ESLint in Vite with the same setup, use [vite-plugin-eslint2](https://github.com/ModyQyW/vite-plugin-eslint2).

## Why not

Most projects do not need this plugin.

Your editor already shows the same problems. VS Code needs the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint). WebStorm ships the feature.

You can also run Stylelint from the CLI or in CI.

Webpack projects use [stylelint-webpack-plugin](https://github.com/webpack-contrib/stylelint-webpack-plugin) for the same job.

Turn the plugin on when you want errors and warnings while Vite runs. Set `lintInWorker` so the checks stay off the build thread. Results print to the console.

## Acknowledge

Initially forked from [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint).

## Contributors

This project was created by [ModyQyW](https://github.com/ModyQyW).

Thanks to [all contributors](https://github.com/ModyQyW/vite-plugin-stylelint/graphs/contributors) for their contributions!

## Sponsors

If this package is helpful to you, please consider [sponsoring](https://github.com/ModyQyW/sponsors). It keeps the project developed and maintained.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
