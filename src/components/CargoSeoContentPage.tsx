import { Link } from "@tanstack/react-router";
import { ClientShell } from "@/apps/client/ClientShell";
import type { CargoLocale } from "@/packages/config/seo";
import type { CargoSeoPageContent } from "@/packages/config/seo-pages";

export function CargoSeoContentPage({
  locale,
  slug,
  page,
}: {
  locale: CargoLocale;
  slug: string;
  page: CargoSeoPageContent;
}) {
  const root = `/${locale}`;
  const base = `${root}/cargo`;
  const label = locale === "en" ? "Tembera Cargo" : "Tembera Cargo";
  const homeLabel = locale === "en" ? "Home" : "Ahabanza";
  const sendLabel = locale === "en" ? "Start a cargo shipment" : "Tangira kohereza imizigo";
  const trackingLabel = locale === "en" ? "Track a shipment" : "Kurikirana imizigo";
  const questionHeading =
    locale === "en" ? "Frequently asked questions" : "Ibibazo bikunze kubazwa";

  return (
    <ClientShell>
      <article className="mx-auto max-w-3xl space-y-8">
        <nav aria-label={locale === "en" ? "Breadcrumb" : "Aho uri"} className="text-sm">
          <Link to={root} className="underline underline-offset-4">
            {homeLabel}
          </Link>
          {slug !== "cargo" && (
            <>
              <span aria-hidden="true"> / </span>
              <Link to={base} className="underline underline-offset-4">
                {label}
              </Link>
              <span aria-hidden="true"> / </span>
            </>
          )}
          <span aria-current="page">{page.heading}</span>
        </nav>

        <header className="space-y-4">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {page.heading}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">{page.summary}</p>
        </header>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/send"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            {sendLabel}
          </Link>
          <Link
            to="/track"
            className="inline-flex min-h-11 items-center rounded-lg border border-input px-4 py-2 font-semibold"
          >
            {trackingLabel}
          </Link>
        </div>

        {page.steps && (
          <section aria-labelledby="howto-steps">
            <h2 id="howto-steps" className="mb-4 font-display text-2xl font-semibold">
              {page.heading}
            </h2>
            <ol className="list-decimal space-y-3 pl-6">
              {page.steps.map((step) => (
                <li key={step.name}>
                  <strong>{step.name}.</strong> {step.text}
                </li>
              ))}
            </ol>
          </section>
        )}

        {page.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section aria-labelledby="cargo-faqs" className="space-y-5">
          <h2 id="cargo-faqs" className="font-display text-2xl font-semibold">
            {questionHeading}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="space-y-2 rounded-xl border border-border p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {slug.startsWith("cargo/") && (
          <nav
            aria-label={locale === "en" ? "Other cargo routes" : "Izindi nzira z'imizigo"}
            className="space-y-3"
          >
            <h2 className="font-display text-xl font-semibold">
              {locale === "en" ? "Other Kigali cargo routes" : "Izindi nzira za Kigali z'imizigo"}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {["musanze", "huye", "rubavu", "rusizi"].flatMap((city) => [
                <a
                  key={`kigali-${city}`}
                  href={`${root}/cargo/kigali-to-${city}`}
                  className="underline underline-offset-4"
                >
                  {locale === "en"
                    ? `Kigali to ${city[0]!.toUpperCase() + city.slice(1)}`
                    : `Kigali ujya ${city[0]!.toUpperCase() + city.slice(1)}`}
                </a>,
                <a
                  key={`${city}-kigali`}
                  href={`${root}/cargo/${city}-to-kigali`}
                  className="underline underline-offset-4"
                >
                  {locale === "en"
                    ? `${city[0]!.toUpperCase() + city.slice(1)} to Kigali`
                    : `${city[0]!.toUpperCase() + city.slice(1)} ujya Kigali`}
                </a>,
              ])}
            </div>
          </nav>
        )}

        <nav
          aria-label={locale === "en" ? "More Tembera services" : "Izindi serivisi za Tembera"}
          className="flex flex-wrap gap-4 border-t border-border pt-5 text-sm"
        >
          <a
            href={`https://tembera.nyxarith.com/${locale}/`}
            className="underline underline-offset-4"
          >
            {locale === "en" ? "Tembera intercity bus tickets" : "Amatike ya bisi za Tembera"}
          </a>
          <a
            href={`https://kigali.tembera.nyxarith.com/${locale}/`}
            className="underline underline-offset-4"
          >
            {locale === "en"
              ? "Tembera Kigali bus tracking"
              : "Gukurikirana bisi za Tembera Kigali"}
          </a>
          <a href="https://nyxarith.com/" className="underline underline-offset-4">
            {locale === "en" ? "About Nyxarith" : "Ibyerekeye Nyxarith"}
          </a>
          <a href={`${root}/about-nyxarith`} className="underline underline-offset-4">
            {locale === "en" ? "About Tembera Cargo" : "Ibyerekeye Tembera Cargo"}
          </a>
          <a href={`${root}/contact`} className="underline underline-offset-4">
            {locale === "en" ? "Contact" : "Vugana natwe"}
          </a>
        </nav>
      </article>
    </ClientShell>
  );
}
