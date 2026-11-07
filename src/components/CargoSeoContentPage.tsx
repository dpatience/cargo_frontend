import { Link } from "@tanstack/react-router";
import { ClientShell } from "@/apps/client/ClientShell";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
import type { CargoLocale } from "@/packages/config/seo";
import type { CargoSeoPageContent } from "@/packages/config/seo-pages";

function CargoPageVisual({
  type,
  locale,
}: {
  type: NonNullable<CargoSeoPageContent["visual"]>;
  locale: "en" | "rw";
}) {
  const isEnglish = locale === "en";
  const copy = {
    safety: isEnglish
      ? ["Create shipment", "Confirm handover", "Track by code", "Deliver with code"]
      : [
          "Kora imizigo",
          "Emeza iyishyikirizwa",
          "Kurikirana ukoresheje kode",
          "Yishyikirize ukoresheje kode",
        ],
    business: isEnglish
      ? ["Customer order", "Cargo quote", "Shipment tracking", "Customer receives"]
      : [
          "Icyo umukiriya yatumije",
          "Igiciro cy'imizigo",
          "Gukurikirana imizigo",
          "Umukiriya arakira",
        ],
    farmer: isEnglish
      ? ["Farm pickup", "Describe produce", "Buyer in Rwanda", "Delivery status"]
      : ["Gufatira ku murima", "Sobanura umusaruro", "Umuguzi mu Rwanda", "Amakuru yo kugeza"],
    student: isEnglish
      ? ["Family sends", "Student gets code", "Track shipment", "Receive package"]
      : ["Umuryango wohereza", "Umunyeshuri abona kode", "Kurikirana imizigo", "Akira imizigo"],
    faq: isEnglish
      ? ["Before sending", "Get a quote", "Track by code", "Solve a problem"]
      : ["Mbere yo kohereza", "Bona igiciro", "Kurikirana ukoresheje kode", "Kemura ikibazo"],
  }[type];
  const title = isEnglish
    ? "How Tembera Cargo connects the shipment"
    : "Uko Tembera Cargo ikurikiranya imizigo";

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
      <figcaption className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-accent">
        {title}
      </figcaption>
      <svg
        viewBox="0 0 760 170"
        role="img"
        aria-label={title}
        className="h-auto w-full"
        fill="none"
      >
        <path d="M92 78H668" stroke="var(--color-border)" strokeDasharray="8 10" strokeWidth="4" />
        {copy.map((label, index) => {
          const x = 20 + index * 190;
          return (
            <g key={label}>
              <rect
                x={x}
                y="38"
                width="144"
                height="80"
                rx="18"
                fill="var(--color-card)"
                stroke={index === 0 || index === 3 ? "var(--color-accent)" : "var(--color-border)"}
                strokeWidth="2"
              />
              <circle cx={x + 28} cy="67" r="13" fill="var(--color-accent)" opacity="0.18" />
              <text
                x={x + 28}
                y="72"
                textAnchor="middle"
                fill="var(--color-accent)"
                fontSize="13"
                fontWeight="700"
              >
                {index + 1}
              </text>
              <text
                x={x + 72}
                y="68"
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontWeight="600"
              >
                {label.split(" ").slice(0, 2).join(" ")}
              </text>
              <text
                x={x + 72}
                y="86"
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontWeight="600"
              >
                {label.split(" ").slice(2).join(" ")}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

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
      <CloudflareWebAnalytics enabled={!page.noIndex} />
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

        {page.visual && <CargoPageVisual type={page.visual} locale={locale} />}

        {page.contactMethods && (
          <section aria-labelledby="contact-options" className="space-y-4">
            <h2 id="contact-options" className="font-display text-2xl font-semibold">
              {locale === "en" ? "Contact options" : "Uburyo bwo kutuvugisha"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.contactMethods.map((method) => (
                <a
                  key={method.href}
                  href={method.href}
                  className="rounded-xl border border-border p-5 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <h3 className="font-semibold">{method.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {method.description}
                  </p>
                  <p className="mt-3 break-all font-medium text-primary">{method.value}</p>
                </a>
              ))}
            </div>
          </section>
        )}

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
              {["musanze", "huye", "rubavu", "rusizi", "kamembe"].flatMap((city) => [
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
          <a href={`https://tembera.app/${locale}/`} className="underline underline-offset-4">
            {locale === "en" ? "Tembera intercity bus tickets" : "Amatike ya bisi za Tembera"}
          </a>
          <a
            href={`https://kigali.tembera.app/${locale}/`}
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
