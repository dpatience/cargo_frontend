import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cargoLandingCopy, cargoLandingHead } from "@/packages/config/seo";
import {
  cargoSeoPageHead,
  cargoSeoPages,
  cargoSeoSitemapEntries,
  getCargoSeoPage,
} from "@/packages/config/seo-pages";
import { buildCargoSitemap } from "../vite.seo-sitemap";

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
      expect(serialized).toContain(`https://cargo.tembera.app/${locale}`);
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

describe("Cargo content pages and structured data", () => {
  it("provides localized metadata, visible-answer FAQs and breadcrumbs for every content page", () => {
    for (const page of cargoSeoPages) {
      for (const locale of ["en", "rw"] as const) {
        const content = page[locale];
        const head = cargoSeoPageHead(locale, page.slug, content);
        const schemaScript = head.scripts[0];
        if (!schemaScript) throw new Error(`Missing schema on ${locale}/${page.slug}`);
        const schema = JSON.parse(schemaScript.children) as {
          "@graph": Array<{
            "@type": string;
            mainEntity?: Array<{ name: string; acceptedAnswer: { text: string } }>;
            itemListElement?: Array<{ position: number }>;
            step?: Array<{ name: string; text: string }>;
            potentialAction?: { "@type": string; target: { urlTemplate: string } };
            logo?: string;
            image?: string;
          }>;
        };
        const graph = schema["@graph"];
        const faq = graph.find((entity) => entity["@type"] === "FAQPage");
        const breadcrumb = graph.find((entity) => entity["@type"] === "BreadcrumbList");
        const howTo = graph.find((entity) => entity["@type"] === "HowTo");
        const organization = graph.find((entity) => entity["@type"] === "Organization");
        const application = graph.find((entity) => entity["@type"] === "SoftwareApplication");
        const robots = head.meta.find((meta) => "name" in meta && meta.name === "robots");

        expect(organization?.logo).toBeUndefined();
        expect(application?.image).toBe("https://cargo.tembera.app/tembera-logo.jpg");
        expect(content.title.length).toBeLessThanOrEqual(60);
        expect(content.description.length).toBeLessThanOrEqual(155);
        expect(head.links.some((link) => link.rel === "canonical")).toBe(true);
        expect(head.links.filter((link) => link.rel === "alternate")).toHaveLength(3);
        expect(faq?.mainEntity).toEqual(
          content.faqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        );
        expect(breadcrumb?.itemListElement?.map((item) => item.position)).toEqual(
          page.slug === "cargo" ? [1] : [1, 2, 3],
        );
        expect(howTo?.step).toEqual(
          content.steps?.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
          })),
        );
        expect(robots && "content" in robots ? robots.content : "").toBe(
          content.noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
        );
        expect(JSON.stringify(graph)).not.toContain("AggregateRating");
      }
    }
  });

  it("publishes a bilingual sitemap for useful pages and excludes the unapproved privacy draft", () => {
    const entries = cargoSeoSitemapEntries("2026-10-13");
    const sitemap = buildCargoSitemap();
    const help = cargoSeoPages.find((page) => page.slug === "help");
    const facts = cargoSeoPages.find((page) => page.slug === "about-nyxarith");

    expect(entries.length).toBeGreaterThan(40);
    expect(sitemap).toContain("https://cargo.tembera.app/en/cargo/kigali-to-musanze");
    expect(sitemap).toContain("https://cargo.tembera.app/rw/cargo/musanze-to-kigali");
    expect(sitemap).toContain('hreflang="en"');
    expect(sitemap).toContain('hreflang="rw"');
    expect(sitemap).toContain('hreflang="x-default"');
    expect(sitemap).toContain("<lastmod>");
    expect(sitemap).toContain("https://cargo.tembera.app/en/help");
    expect(sitemap).toContain("https://cargo.tembera.app/rw/help");
    const legacySitemap = buildCargoSitemap(
      process.cwd(),
      "https://cargo.tembera.nyxarith.com",
    );
    const rootDomainSitemap = buildCargoSitemap(process.cwd(), "https://cargo.nyxarith.com");
    expect(legacySitemap).toContain("https://cargo.tembera.nyxarith.com/en/help");
    expect(rootDomainSitemap).toContain("https://cargo.nyxarith.com/en/help");
    expect(legacySitemap).not.toContain("https://cargo.tembera.app/");
    expect(sitemap).not.toContain("/privacy");
    expect(help?.en.faqs).toHaveLength(18);
    expect(help?.rw.faqs).toHaveLength(18);
    expect(facts?.en.sections.flatMap((section) => section.paragraphs).join(" ")).toContain(
      "Last updated: 14 October 2026",
    );
  });

  it("connects the website search action to the functional shipment tracker", () => {
    const head = cargoSeoPageHead(
      "en",
      "cargo",
      cargoSeoPages.find((page) => page.slug === "cargo")!.en,
    );
    const schema = JSON.parse(head.scripts[0]!.children) as {
      "@graph": Array<{
        "@type": string;
        potentialAction?: { "@type": string; target: { urlTemplate: string } };
      }>;
    };
    const website = schema["@graph"].find((entity) => entity["@type"] === "WebSite");

    expect(website?.potentialAction?.["@type"]).toBe("SearchAction");
    expect(website?.url).toBe("https://cargo.tembera.app/");
    expect(website?.potentialAction?.target.urlTemplate).toBe(
      "https://cargo.tembera.app/track?code={search_term_string}",
    );
  });

  it("keeps every Search Console reported public page indexable and in the sitemap", () => {
    const slugs = [
      "cargo/huye-to-kigali",
      "cargo/kigali-to-huye",
      "cargo/kigali-to-musanze",
      "cargo/kigali-to-rubavu",
      "cargo/kigali-to-rusizi",
      "for-online-sellers",
      "guides/cargo-vs-courier-vs-bus",
      "safety-and-trust",
    ];
    const sitemap = buildCargoSitemap();

    for (const slug of slugs) {
      for (const locale of ["en", "rw"] as const) {
        const page = getCargoSeoPage(locale, slug);
        if (!page) throw new Error(`Missing public SEO page: ${locale}/${slug}`);
        const head = cargoSeoPageHead(locale, slug, page);
        const robots = head.meta.find((meta) => "name" in meta && meta.name === "robots");

        expect(robots && "content" in robots ? robots.content : "").toBe(
          "index,follow,max-image-preview:large",
        );
        expect(head.links.find((link) => link.rel === "canonical")?.href).toBe(
          `/${locale}/${slug}`,
        );
        expect(sitemap).toContain(`https://cargo.tembera.app/${locale}/${slug}`);
      }
    }
  });
});

describe("public crawl directives", () => {
  const readPublicFile = (name: string) =>
    readFileSync(resolve(process.cwd(), "public", name), "utf8");

  it("allows named AI crawlers while keeping account and transaction paths disallowed", () => {
    const robots = readPublicFile("robots.txt");

    expect(robots).toContain("Sitemap: https://cargo.tembera.app/sitemap.xml");
    expect(robots).toContain("Sitemap: https://cargo.tembera.nyxarith.com/sitemap-nyxarith.xml");
    expect(robots).toContain("Sitemap: https://cargo.nyxarith.com/sitemap-cargo-nyxarith.xml");
    expect(readPublicFile("sitemap-nyxarith.xml")).toContain(
      "https://cargo.tembera.nyxarith.com/en",
    );
    expect(readPublicFile("sitemap-cargo-nyxarith.xml")).toContain(
      "https://cargo.nyxarith.com/en",
    );
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

  it("publishes full machine-readable service facts and links the localized help center", () => {
    const summary = readPublicFile("llms.txt");
    const fullFacts = readPublicFile("llms-full.txt");

    expect(summary).toContain("https://cargo.tembera.app/en/help");
    expect(summary).toContain("https://cargo.tembera.app/rw/help");
    expect(summary).toContain("https://cargo.tembera.nyxarith.com/en");
    expect(summary).toContain("https://cargo.nyxarith.com/en");
    expect(fullFacts).toContain("Nyxarith Private Limited Company");
    expect(fullFacts).toContain("shipment-specific quote");
    expect(fullFacts).toContain("Share it only with the intended recipient");
  });

  it("lists only public localized pages with lastmod and language alternates", () => {
    const sitemap = readPublicFile("sitemap.xml");

    expect(sitemap).toContain("<lastmod>2026-10-13</lastmod>");
    expect(sitemap).toContain('hreflang="en"');
    expect(sitemap).toContain('hreflang="rw"');
    expect(sitemap).toContain('hreflang="x-default"');
    expect(sitemap).toContain("https://cargo.tembera.app/en");
    expect(sitemap).toContain("https://cargo.tembera.app/rw");
    expect(sitemap).not.toContain("/track");
    expect(sitemap).not.toContain("/receive");
  });
});
