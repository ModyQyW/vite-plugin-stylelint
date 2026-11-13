/**
 * Canonical origin of the deployed docs site.
 *
 * Rspress builds the sitemap `<loc>`, the llms.txt page links and the hreflang
 * `href` values through `withSiteOrigin(..., siteOrigin)`. Leaving it unset
 * makes all three relative, which the sitemap protocol rejects and which Google
 * documents as an invalid hreflang target.
 */
export const SITE_ORIGIN = "https://vite-plugin-stylelint.modyqyw.top";
