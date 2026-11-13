import { readFileSync } from "node:fs";
import type { UserConfig } from "@rspress/core";

/**
 * Canonical origin of the deployed docs site.
 *
 * Rspress builds the sitemap `<loc>`, the llms.txt page links and the hreflang
 * `href` values through `withSiteOrigin(..., siteOrigin)`. Leaving it unset
 * makes all three relative, which the sitemap protocol rejects and which Google
 * documents as an invalid hreflang target.
 */
export const SITE_ORIGIN = "https://vite-plugin-stylelint.modyqyw.top";

const OG_IMAGE = `${SITE_ORIGIN}/og.png`;

const PACKAGE = {
  name: "vite-plugin-stylelint",
  npm: "https://www.npmjs.com/package/vite-plugin-stylelint",
  repo: "https://github.com/ModyQyW/vite-plugin-stylelint",
  author: "https://github.com/ModyQyW",
};

const ZH_PREFIX_RE = /^\/zh(?=\/|$)/u;
const DESCRIPTION_RE = /^description:[ \t]*(?<value>.+)$/mu;
const HEADING_RE = /^#[ \t]+(?<value>.+)$/mu;
const QUOTE_WRAP_RE = /^["']|["']$/gu;

interface SeoRoute {
  absolutePath: string;
  routePath: string;
}

interface PageSummary {
  description: string;
  heading: string;
}

type HeadEntry = NonNullable<UserConfig["head"]>[number];

/** `/zh/guide/why` → `/guide/why`. The English page is the `x-default` target. */
function defaultLocalePath(routePath: string): string {
  const stripped = routePath.replace(ZH_PREFIX_RE, "");
  return stripped === "" ? "/" : stripped;
}

function absoluteUrl(routePath: string): string {
  return `${SITE_ORIGIN}${routePath}`;
}

/**
 * Pull the `description` frontmatter and the leading `# heading` out of a page's
 * Markdown source. Both are already written for humans, so JSON-LD reuses them
 * instead of keeping a second copy of the metadata in this file.
 */
function readSummary(absolutePath: string): PageSummary {
  const source = readFileSync(absolutePath, "utf8");
  const description = DESCRIPTION_RE.exec(source)?.groups?.value.trim() ?? "";
  const heading = HEADING_RE.exec(source)?.groups?.value.trim() ?? "";
  return { description: description.replace(QUOTE_WRAP_RE, ""), heading };
}

function structuredData(route: SeoRoute): object[] {
  const { description, heading } = readSummary(route.absolutePath);
  const url = absoluteUrl(route.routePath);
  const isHome = defaultLocalePath(route.routePath) === "/";
  const isZh = route.routePath.startsWith("/zh");
  const homeUrl = `${SITE_ORIGIN}${isZh ? "/zh/" : "/"}`;

  if (isHome) {
    return [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: PACKAGE.name,
        description,
        url,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Node.js 18 or later",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        sameAs: [PACKAGE.repo, PACKAGE.npm],
      },
    ];
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: heading,
      description,
      url,
      inLanguage: isZh ? "zh" : "en",
      author: { "@type": "Person", name: "ModyQyW", url: PACKAGE.author },
      isPartOf: { "@type": "WebSite", name: PACKAGE.name, url: homeUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isZh ? "首页" : "Home",
          item: homeUrl,
        },
        { "@type": "ListItem", position: 2, name: heading, item: url },
      ],
    },
  ];
}

/** JSON-LD lives inside `<script>`, so a literal `<` would close the tag early. */
function serializeJsonLd(data: object[]): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

/**
 * Head tags Rspress does not emit on its own: a self-referencing canonical, the
 * Open Graph URL and image, an `x-default` hreflang target, and JSON-LD.
 *
 * Rspress only renders `head` entries during SSG, so these land in the static
 * HTML that crawlers read; client-side navigation leaves them untouched.
 */
export const seoHead: HeadEntry[] = [
  (route) => ["link", { rel: "canonical", href: absoluteUrl(route.routePath) }],
  (route) => [
    "meta",
    { property: "og:url", content: absoluteUrl(route.routePath) },
  ],
  ["meta", { property: "og:image", content: OG_IMAGE }],
  ["meta", { property: "og:image:width", content: "1200" }],
  ["meta", { property: "og:image:height", content: "630" }],
  ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ["meta", { name: "twitter:image", content: OG_IMAGE }],
  (route) => [
    "link",
    {
      rel: "alternate",
      hreflang: "x-default",
      href: absoluteUrl(defaultLocalePath(route.routePath)),
    },
  ],
  (route) =>
    `<script type="application/ld+json">${serializeJsonLd(structuredData(route))}</script>`,
];
