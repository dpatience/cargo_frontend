import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cargoLandingCopy, cargoLandingHead } from "@/packages/config/seo";

describe("localized cargo landing SEO", () => {
  it.each(["en", "rw"] as const)(
    "provides complete metadata and reciprocal hreflang for %s",
    (locale) => {
      const head = cargoLandingHead(locale);
      const title = head.meta.find((meta) => "title" in meta)?.title;
      const description = head.meta.find((meta) => "name" in meta && meta.name === "description");
      const descriptionContent =
        description && "content" in description ? description.content : undefined;
      const serialized = JSON.stringify(head);

      if (!title || !descriptionContent) {
        throw new Error(`Missing required ${locale} title or description metadata`);
      }

      expect(title).toBe(cargoLandingCopy[locale].title);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(descriptionContent).toBeDefined();
      expect(descriptionContent).toBeTypeOf("string");
      expect(descriptionContent?.length).toBeLessThanOrEqual(155);
      expect(serialized).toContain(`https://cargo.tembera.nyxarith.com/${locale}`);
      expect(serialized).toContain('hrefLang":"en"');
      expect(serialized).toContain('hrefLang":"rw"');
      expect(serialized).toContain('hrefLang":"x-default"');
      expect(serialized).toContain("og:image:width");
      expect(serialized).toContain('"1200"');
      expect(serialized).toContain("og:image:height");
      expect(serialized).toContain('"630"');
    },
  );

  it.each(["en", "rw"] as const)(
    "keeps the FAQ schema aligned with visible %s answers",
    (locale) => {
      const head = cargoLandingHead(locale);
      const script = head.scripts[0];
      if (!script) throw new Error("Missing JSON-LD script");
      const schema = JSON.parse(script.children) as {
        "@graph": Array<{
          "@type": string;
          mainEntity?: Array<{
            "@type": string;
            name: string;
            acceptedAnswer: { "@type": string; text: string };
          }>;
        }>;
      };
      const faq = schema["@graph"].find((entity) => entity["@type"] === "FAQPage");

      expect(faq?.mainEntity).toHaveLength(cargoLandingCopy[locale].faqs.length);
      expect(faq?.mainEntity).toEqual(
        cargoLandingCopy[locale].faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      );
    },
  );
});

describe("public crawl directives", () => {
  const readPublicFile = (name: string) =>
    readFileSync(resolve(process.cwd(), "public", name), "utf8");

  it("allows named AI crawlers while keeping account and transaction paths disallowed", () => {
    const robots = readPublicFile("robots.txt");

    for (const crawler of [
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "ClaudeBot",
      "Claude-SearchBot",
      "PerplexityBot",
      "Google-Extended",
      "Applebot-Extended",
      "CCBot",
    ]) {
      expect(robots).toContain(`User-agent: ${crawler}`);
    }
    for (const path of [
      "/account",
      "/admin",
      "/app",
      "/receive",
      "/send",
      "/shipments",
      "/track",
    ]) {
      expect(robots).toContain(`Disallow: ${path}`);
    }
  });

  it("lists only public localized pages with lastmod and language alternates", () => {
    const sitemap = readPublicFile("sitemap.xml");

    expect(sitemap).toContain("<lastmod>2026-10-13</lastmod>");
    expect(sitemap).toContain('hreflang="en"');
    expect(sitemap).toContain('hreflang="rw"');
    expect(sitemap).toContain('hreflang="x-default"');
    expect(sitemap).toContain("https://cargo.tembera.nyxarith.com/en");
    expect(sitemap).toContain("https://cargo.tembera.nyxarith.com/rw");
    expect(sitemap).not.toContain("/track");
    expect(sitemap).not.toContain("/receive");
  });
});
