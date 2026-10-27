import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { cargoSeoSitemapEntries } from "./src/packages/config/seo-pages";

const SITE_ORIGIN = "https://cargo.tembera.app";

export function buildCargoSitemap(
  appRoot = process.cwd(),
  siteOrigin = SITE_ORIGIN,
): string {
  const sourceLastmod = (file: string) =>
    statSync(path.join(appRoot, file)).mtime.toISOString().slice(0, 10);
  const rootLastmod = sourceLastmod("src/packages/config/seo.ts");
  const pageLastmod = sourceLastmod("src/packages/config/seo-pages.ts");
  const pages = [
    { url: `${siteOrigin}/en`, lastmod: rootLastmod, slug: "" },
    { url: `${siteOrigin}/rw`, lastmod: rootLastmod, slug: "" },
    ...cargoSeoSitemapEntries(pageLastmod).map((page) => ({
      ...page,
      url: page.url.replace(SITE_ORIGIN, siteOrigin),
    })),
  ];

  const urls = pages.map((page) => {
    const alternateSlug = page.slug ? `/${page.slug}` : "";
    const alternates = [
      ["en", `${siteOrigin}/en${alternateSlug}`],
      ["rw", `${siteOrigin}/rw${alternateSlug}`],
      ["x-default", `${siteOrigin}/en${alternateSlug}`],
    ]
      .map(
        ([locale, href]) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`,
      )
      .join("\n");
    return [
      "  <url>",
      `    <loc>${page.url}</loc>`,
      `    <lastmod>${page.lastmod}</lastmod>`,
      alternates,
      "  </url>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls.join("\n"),
    "</urlset>",
    "",
  ].join("\n");
}

export function cargoSeoSitemapPlugin(): Plugin {
  let appRoot = process.cwd();

  return {
    name: "tembera-cargo-seo-sitemap",
    apply: "build",
    configResolved(config) {
      appRoot = config.root;
    },
    closeBundle() {
      const outDir = path.resolve(appRoot, ".output/public");
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, "sitemap.xml"), buildCargoSitemap(appRoot), "utf8");
      writeFileSync(
        path.join(outDir, "sitemap-nyxarith.xml"),
        buildCargoSitemap(appRoot, "https://cargo.tembera.nyxarith.com"),
        "utf8",
      );
      writeFileSync(
        path.join(outDir, "sitemap-cargo-nyxarith.xml"),
        buildCargoSitemap(appRoot, "https://cargo.tembera.app"),
        "utf8",
      );
    },
  };
}
