# 常见问题

## 我应该用这个插件吗？

大多数情况下不用。

Webpack 里常配 [stylelint-webpack-plugin](https://github.com/webpack-contrib/stylelint-webpack-plugin)，这个插件在 Vite 里做着差不多的事。

编辑器其实已经把该看的都显示出来了。VS Code 装上 [Stylelint 扩展](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) 就行，WebStorm 自带这个功能。你也可以在命令行或者 CI 里跑 Stylelint。

路子里有这么多，专门在 Vite 里再跑一遍 Stylelint 就没多大必要了。真想边开发边看错误和警告，打开 `lintInWorker`，它不占构建线程，结果打到控制台。也可以试试 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)。

## 缓存好像坏了？

删掉缓存文件，手动修好问题，然后重启 Vite。

## 插件跑得很慢？

默认情况下插件在主线程校验，可能拖住构建。打开 `lintInWorker`，Vite 不会被卡住，结果打到控制台。[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 是另一个办法，或者在 Vite 外面单独跑 Stylelint。

## 推荐配置？

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

`customOverlay` 只在 `serve` 下生效，`fix` 会在开发过程中直接改文件。哪一项不合适就去掉。

## 为什么错误信息一片红？

Vite 原生错误遮罩层不显示 `PluginContext.warn` 的内容，还把 Stylelint 带 ANSI 颜色的字符串原样渲染出来，浏览器里颜色区分就没了。这些限制在 [#2076](https://github.com/vitejs/vite/issues/2076)、[#6274](https://github.com/vitejs/vite/pull/6274) 和 [#8327](https://github.com/vitejs/vite/discussions/8327) 里有讨论。

设置 `customOverlay: true` 改成原生渲染，错误和警告会分开着色。
