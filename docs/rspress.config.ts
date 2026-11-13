import { defineConfig } from "@rspress/core";
import { SITE_ORIGIN, seoHead } from "./seo";

export default defineConfig({
  lang: "en",
  title: "vite-plugin-stylelint",
  description: "Stylelint plugin for Vite.",
  // Without this the sitemap, llms.txt and hreflang links all come out relative.
  siteOrigin: SITE_ORIGIN,
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
  head: seoHead,
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
