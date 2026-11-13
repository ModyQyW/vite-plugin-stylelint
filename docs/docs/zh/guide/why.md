---
description: "什么情况下用 vite-plugin-stylelint，什么情况下编辑器、Stylelint 命令行或 CI 已经够用。"
---

# 为什么用，为什么不用？

## 为什么用

这个插件在 Vite 里运行 Stylelint。项目最初从 [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint) 分叉出来，让 Stylelint 和构建跑在同一个地方。

[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 覆盖的场景差不多，挑一个适合你的就行。

Stylelint 只管样式。想在 Vite 里用同样的方式跑 ESLint，用 [vite-plugin-eslint2](https://github.com/ModyQyW/vite-plugin-eslint2)。

## 为什么不用

大多数项目用不上这个插件。

编辑器已经把同样的问题显示出来了。VS Code 装 [Stylelint 扩展](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)，WebStorm 自带这个功能。

你也可以在命令行或者 CI 里跑 Stylelint。

Webpack 项目用 [stylelint-webpack-plugin](https://github.com/webpack-contrib/stylelint-webpack-plugin) 做同样的事。

想在 Vite 跑的时候看到错误和警告，就打开这个插件。把 `lintInWorker` 打开，校验不占构建线程，结果打到控制台。

## 致谢

最初从 [gxmari007/vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint) 分叉出来。

## 贡献者们

该项目由 [ModyQyW](https://github.com/ModyQyW) 创建。

感谢 [所有贡献者](https://github.com/ModyQyW/vite-plugin-stylelint/graphs/contributors) 的付出！

## 赞助

如果这个包对你有帮助，可以考虑 [赞助](https://github.com/ModyQyW/sponsors)。它让项目能持续开发和维护。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg">
    <img src="https://cdn.jsdelivr.net/gh/ModyQyW/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
