---
description: "什么情况下用这个插件、缓存坏了怎么恢复、为什么跑得慢、推荐的配置，以及为什么输出一片红。"
---

# 常见问题

## 我应该用这个插件吗？

大多数情况下不用。什么时候用、什么时候不用，见 [为什么用，为什么不用](/zh/guide/why)。

想在 Vite 跑的时候看到错误和警告，就打开这个插件。把 `lintInWorker` 打开，校验不占构建线程。

## 缓存好像坏了？

1. 删掉缓存文件。
2. 手动修好问题。
3. 重启 Vite。

## 插件跑得很慢？

默认情况下插件在主线程校验，可能拖住构建。

打开 `lintInWorker`，Vite 不会被卡住，结果打到控制台。

也可以在 Vite 外面单独跑 Stylelint。[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) 是另一个办法。

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

`customOverlay` 只在 `serve` 下生效。`fix` 会在开发过程中直接改文件。哪一项不合适就去掉。

## 为什么错误信息一片红？

Vite 原生错误遮罩层不显示 `PluginContext.warn` 的内容。它把 Stylelint 带 ANSI 颜色的字符串原样渲染出来，浏览器里就看不出颜色区分了。

这些限制在上游 [#2076](https://github.com/vitejs/vite/issues/2076)、[#6274](https://github.com/vitejs/vite/pull/6274) 和 [#8327](https://github.com/vitejs/vite/discussions/8327) 里有讨论。

设置 `customOverlay: true` 改成原生渲染。错误和警告会分开着色。
