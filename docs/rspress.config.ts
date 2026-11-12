import path from "node:path";
import { defineConfig } from "@rspress/core";

export default defineConfig({
  lang: "en",
  title: "vite-plugin-stylelint",
  description: "Stylelint plugin for Vite.",
  icon: "/vite-plugin-stylelint.svg",
  locales: [
    {
      lang: "en",
      label: "English",
      title: "vite-plugin-stylelint",
      description: "Stylelint plugin for Vite.",
    },
    {
      lang: "zh",
      label: "简体中文",
      title: "vite-plugin-stylelint",
      description: "Vite 的 Stylelint 插件。",
    },
  ],
  globalStyles: path.join(import.meta.dirname, "theme/index.css"),
  head: [
    // Google Analytics
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-1WT0NZVS5X",
      },
    ],
    // Google AdSense
    [
      "script",
      {
        async: "",
        crossorigin: "anonymous",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3102250747488251",
      },
    ],
  ],
  // `head` only accepts tags without children, so the inline gtag bootstrap has
  // to go through Rsbuild's html tag config instead.
  builderConfig: {
    html: {
      tags: [
        {
          tag: "script",
          children: `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1WT0NZVS5X');`,
        },
      ],
    },
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/ModyQyW/vite-plugin-stylelint",
      },
    ],
    editLink: {
      docRepoBaseUrl:
        "https://github.com/ModyQyW/vite-plugin-stylelint/tree/main/docs",
    },
    lastUpdated: true,
    llmsUI: true,
  },
});
