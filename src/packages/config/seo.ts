const publicSiteOrigin = "https://cargo.tembera.app";

export function absoluteSiteUrl(path: string): string {
  return new URL(path, publicSiteOrigin).toString();
}

export type CargoLocale = "en" | "rw";

export const cargoLandingCopy = {
  en: {
    title: "Tembera Cargo Rwanda | Door-to-Door Delivery",
    description:
      "Door-to-door goods delivery across Rwanda. Arrange pickup or drop-off, see fair pricing and track shipments with Tembera Cargo by Nyxarith.",
    summary:
      "Tembera Cargo is a door-to-door goods delivery service across Rwanda, provided by Nyxarith. Senders can arrange pickup or drop-off, view fair pricing and track a shipment. It uses existing infrastructure to move packages between destinations, helping people avoid handing goods to an unknown motorcyclist or courier.",
    faqTitle: "Tembera Cargo questions, answered",
    faqs: [
      {
        question: "What is Tembera Cargo?",
        answer:
          "Tembera Cargo is a door-to-door goods delivery service across Rwanda, with shipment tracking.",
      },
      {
        question: "How do I send a package in Rwanda with Tembera Cargo?",
        answer:
          "Enter the pickup and delivery details, review the displayed delivery price, then follow the steps to confirm the shipment.",
      },
      {
        question: "How can I track my Tembera Cargo shipment?",
        answer:
          "Enter the tracking code shared for your shipment on Tembera Cargo to check its latest status.",
      },
      {
        question: "Does Tembera Cargo provide door-to-door delivery?",
        answer: "Yes. Tembera Cargo provides door-to-door goods delivery across Rwanda.",
      },
    ],
  },
  rw: {
    title: "Tembera Cargo | Kohereza Imizigo mu Rwanda",
    description:
      "Ohereza ibicuruzwa mu Rwanda ukoresheje Tembera Cargo. Teganya gufatirwa cyangwa gushyikirizwa, reba igiciro kandi ukurikirane imizigo yawe.",
    summary:
      "Tembera Cargo ni serivisi ya Nyxarith yo gutwara ibicuruzwa ibikuye ku rugi bikagezwa ku rundi mu Rwanda. Wohereza imizigo, ugahitamo aho ifatirwa n'aho ijyanwa, ukareba igiciro mbere yo kwemeza no gukurikirana urugendo rwayo. Iyi serivisi yubakiye ku bikorwa remezo bisanzwe, ikagufasha kutishingikiriza ku guha ibicuruzwa umumotari cyangwa umukozi utazi.",
    faqTitle: "Ibibazo bikunze kubazwa kuri Tembera Cargo",
    faqs: [
      {
        question: "Tembera Cargo ni iki?",
        answer:
          "Tembera Cargo ni serivisi ya Nyxarith yo gutwara no kugeza ibicuruzwa ku nzu mu Rwanda, ikanafasha kubikurikirana.",
      },
      {
        question: "Nakohereza nte ibicuruzwa mu Rwanda nkoresheje Tembera Cargo?",
        answer:
          "Andika aho imizigo ifatirwa n'aho ijyanwa, urebe igiciro cyatanzwe, hanyuma ukurikize amabwiriza yo kwemeza kohereza.",
      },
      {
        question: "Nakurikirana nte imizigo yanjye?",
        answer:
          "Andika kode yo gukurikirana wahawe muri Tembera Cargo kugira ngo urebe amakuru aheruka ku rugendo rw'imizigo yawe.",
      },
      {
        question: "Tembera Cargo itanga serivisi yo kugeza ibicuruzwa ku rugi?",
        answer: "Yego. Tembera Cargo itwara ibicuruzwa ikabigeza ku rugi mu Rwanda.",
      },
    ],
  },
} as const;

export function cargoLandingHead(locale: CargoLocale) {
  const copy = cargoLandingCopy[locale];
  const canonical = `/${locale}`;
  const canonicalUrl = absoluteSiteUrl(canonical);
  const organizationId = "https://nyxarith.com/#organization";
  const image = absoluteSiteUrl("/og-image.jpg");
  const language = locale === "rw" ? "rw-RW" : "en-RW";

  return {
    meta: [
      { title: copy.title },
      { name: "description", content: copy.description },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:site_name", content: "Tembera Cargo" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: copy.title },
      { property: "og:description", content: copy.description },
      { property: "og:url", content: canonicalUrl },
      { property: "og:locale", content: language },
      { property: "og:image", content: image },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Tembera Cargo door-to-door delivery across Rwanda" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: copy.title },
      { name: "twitter:description", content: copy.description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: "Tembera Cargo door-to-door delivery across Rwanda" },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", href: absoluteSiteUrl("/en"), hrefLang: "en" },
      { rel: "alternate", href: absoluteSiteUrl("/rw"), hrefLang: "rw" },
      { rel: "alternate", href: absoluteSiteUrl("/en"), hrefLang: "x-default" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": organizationId,
              name: "Nyxarith Private Limited Company",
              url: "https://nyxarith.com/",
              areaServed: { "@type": "Country", name: "Rwanda" },
            },
            {
              "@type": "WebSite",
              "@id": `${absoluteSiteUrl("/")}#website`,
              name: "Tembera Cargo",
              url: canonicalUrl,
              description: copy.description,
              publisher: { "@id": organizationId },
              inLanguage: language,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${absoluteSiteUrl("/track")}?code={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "SoftwareApplication",
              "@id": `${canonicalUrl}#application`,
              name: "Tembera Cargo",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              image: absoluteSiteUrl("/tembera-logo.jpg"),
              url: canonicalUrl,
              inLanguage: language,
              publisher: { "@id": organizationId },
            },
            {
              "@type": "Service",
              "@id": `${canonicalUrl}#service`,
              name: "Tembera Cargo",
              serviceType: "Cargo and parcel delivery",
              description: copy.summary,
              areaServed: { "@type": "Country", name: "Rwanda" },
              provider: { "@id": organizationId },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name:
                  locale === "en" ? "Shipment fulfillment options" : "Uburyo bwo gutanga imizigo",
                itemListElement: [
                  { "@type": "Offer", name: locale === "en" ? "Home pickup" : "Gufatira mu rugo" },
                  {
                    "@type": "Offer",
                    name: locale === "en" ? "Station drop-off" : "Gushyira kuri sitasiyo",
                  },
                  {
                    "@type": "Offer",
                    name: locale === "en" ? "Address delivery" : "Kugeza ku aderesi",
                  },
                  {
                    "@type": "Offer",
                    name: locale === "en" ? "Station collection" : "Gufatira kuri sitasiyo",
                  },
                ],
              },
            },
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              inLanguage: language,
              mainEntity: copy.faqs.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
          ],
        }),
      },
    ],
  };
}
