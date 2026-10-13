import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, MapPin, Package, PackageOpen, Search } from "lucide-react";
import { ClientShell } from "@/apps/client/ClientShell";
import { useI18n } from "@/packages/i18n";
import { cargoLandingCopy } from "@/packages/config/seo";
import { buttonVariants } from "@/packages/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/en", statusCode: 301 });
  },
  component: () => null,
});

export function Home() {
  const { lang, t } = useI18n();
  const copy = cargoLandingCopy[lang];
  const secondary = [
    { to: "/track", icon: Search, label: t("home.track") },
    { to: "/receive", icon: PackageOpen, label: t("home.receive") },
    { to: "/shipments", icon: Package, label: t("home.mine") },
  ] as const;

  return (
    <ClientShell>
      <div className="space-y-8 md:space-y-10">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-surface shadow-card">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-glow opacity-90" />
          <div className="grid min-h-[28rem] items-center lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-6 pb-8 pt-9 sm:px-10 sm:pb-10 sm:pt-12 lg:px-12 lg:py-14">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                <MapPin className="size-3.5" />
                Rwanda
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
                {t("home.title")}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
                {t("home.subtitle")}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                {copy.summary}
              </p>
              <Link
                to="/send"
                className={cn(
                  buttonVariants({ variant: "hero", size: "xl" }),
                  "group mt-8 w-full justify-between gap-6 rounded-2xl px-5 shadow-cta sm:w-auto sm:min-w-72",
                )}
              >
                <span className="text-left">
                  <span className="block">{t("home.send")}</span>
                  <span className="mt-0.5 block text-sm font-medium opacity-80">
                    {t("home.sendHint")}
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="size-5" />
                </span>
              </Link>
            </div>

            <div
              className="relative mx-4 mb-5 flex min-h-64 items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-background/40 sm:mx-8 sm:mb-8 lg:mx-7 lg:my-7 lg:min-h-[24rem]"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,oklch(0.62_0.19_258_/_18%),transparent_58%)]" />
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:34px_34px]" />
              <svg
                viewBox="0 0 520 390"
                className="relative w-full max-w-[34rem] px-3 drop-shadow-[0_20px_35px_oklch(0.08_0.03_265_/_55%)]"
                fill="none"
              >
                <path
                  d="M72 234C132 234 120 120 205 120s76 158 153 158 44-89 100-89"
                  stroke="url(#route-gradient)"
                  strokeDasharray="7 11"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <circle
                  cx="72"
                  cy="234"
                  r="12"
                  fill="var(--color-background)"
                  stroke="#8BE9F5"
                  strokeWidth="4"
                />
                <circle cx="72" cy="234" r="4" fill="#8BE9F5" />
                <circle
                  cx="458"
                  cy="189"
                  r="12"
                  fill="var(--color-background)"
                  stroke="#A9A0FF"
                  strokeWidth="4"
                />
                <circle cx="458" cy="189" r="4" fill="#A9A0FF" />
                <g transform="translate(190 147)">
                  <path
                    d="m70 14 67 34v76l-67 36-67-36V48l67-34Z"
                    fill="#172B49"
                    stroke="#7B8FB6"
                    strokeWidth="2"
                  />
                  <path d="m3 48 67 36 67-36M70 84v76" stroke="#7B8FB6" strokeWidth="2" />
                  <path
                    d="m70 14 67 34-67 36L3 48l67-34Z"
                    fill="#243C60"
                    stroke="#8BE9F5"
                    strokeWidth="2"
                  />
                  <path
                    d="m49 25 67 34M70 84l67-36"
                    stroke="#8BE9F5"
                    strokeOpacity=".45"
                    strokeWidth="2"
                  />
                  <path d="M30 72v42l26 14V86L30 72Z" fill="#7D83FF" fillOpacity=".85" />
                  <path d="M40 79v22" stroke="white" strokeOpacity=".8" strokeWidth="2" />
                </g>
                <circle cx="152" cy="105" r="3" fill="#8BE9F5" />
                <circle cx="384" cy="108" r="4" fill="#A9A0FF" />
                <circle cx="396" cy="302" r="3" fill="#8BE9F5" />
                <path
                  d="m386 70 4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Z"
                  fill="#8BE9F5"
                  fillOpacity=".8"
                />
                <path
                  d="m115 304 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"
                  fill="#A9A0FF"
                  fillOpacity=".9"
                />
                <defs>
                  <linearGradient
                    id="route-gradient"
                    x1="72"
                    y1="120"
                    x2="458"
                    y2="278"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#8BE9F5" />
                    <stop offset="1" stopColor="#A9A0FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-background/75 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-card backdrop-blur sm:bottom-5 sm:left-5">
                {t("home.send")}
                <span className="ml-2 text-accent">↗</span>
              </div>
              <div className="absolute right-4 top-4 size-3 rotate-45 rounded-sm border border-accent/70 bg-accent/10 sm:right-5 sm:top-5" />
            </div>
          </div>
        </section>

        <section aria-labelledby="cargo-faq-title" className="space-y-5">
          <h2 id="cargo-faq-title" className="font-display text-2xl font-semibold">
            {copy.faqTitle}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {copy.faqs.map(({ question, answer }) => (
              <article key={question} className="space-y-2">
                <h3 className="font-semibold">{question}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <nav aria-label="Tembera services" className="flex flex-wrap gap-4 text-sm">
          <a
            href={`https://tembera.nyxarith.com/${lang}/`}
            className="underline underline-offset-4"
          >
            {lang === "rw" ? "Amatike ya bisi za Tembera" : "Tembera intercity bus tickets"}
          </a>
          <a
            href={`https://kigali.tembera.nyxarith.com/${lang}/`}
            className="underline underline-offset-4"
          >
            {lang === "rw" ? "Gukurikirana bisi za Tembera Kigali" : "Tembera Kigali bus tracking"}
          </a>
          <a href="https://nyxarith.com/" className="underline underline-offset-4">
            {lang === "rw"
              ? "Nyxarith, ikigo gikora Tembera"
              : "Nyxarith, the company behind Tembera"}
          </a>
        </nav>

        <section aria-labelledby="cargo-guides-title" className="space-y-4">
          <h2 id="cargo-guides-title" className="font-display text-2xl font-semibold">
            {lang === "rw"
              ? "Inama n'amakuru kuri Tembera Cargo"
              : "Tembera Cargo guides and information"}
          </h2>
          <nav
            aria-label={lang === "rw" ? "Inama za Cargo" : "Cargo guides"}
            className="flex flex-wrap gap-4 text-sm"
          >
            <a href={`/${lang}/cargo`} className="underline underline-offset-4">
              {lang === "rw" ? "Gutwara imizigo mu Rwanda" : "Cargo delivery across Rwanda"}
            </a>
            <a href={`/${lang}/how-it-works`} className="underline underline-offset-4">
              {lang === "rw" ? "Uko ikora" : "How it works"}
            </a>
            <a href={`/${lang}/pricing`} className="underline underline-offset-4">
              {lang === "rw" ? "Ibiciro n'igiciro cy'imizigo" : "Pricing and shipment quotes"}
            </a>
            <a href={`/${lang}/safety-and-trust`} className="underline underline-offset-4">
              {lang === "rw" ? "Uko imizigo yizewe" : "Safety and trust"}
            </a>
            <a href={`/${lang}/coverage`} className="underline underline-offset-4">
              {lang === "rw" ? "Aho dukorera" : "Coverage"}
            </a>
            <a href={`/${lang}/how-to-send-a-package`} className="underline underline-offset-4">
              {lang === "rw" ? "Uko wohereza imizigo" : "How to send a package"}
            </a>
            <a href={`/${lang}/track-a-package`} className="underline underline-offset-4">
              {lang === "rw" ? "Uko ukurikirana imizigo" : "How to track a package"}
            </a>
            <a
              href={`/${lang}/guides/cargo-vs-courier-vs-bus`}
              className="underline underline-offset-4"
            >
              {lang === "rw"
                ? "Gereranya uburyo bwo kohereza"
                : "Compare cargo, courier and bus parcels"}
            </a>
            <a href={`/${lang}/for-small-businesses`} className="underline underline-offset-4">
              {lang === "rw" ? "Ku bucuruzi buto" : "For small businesses"}
            </a>
            <a href={`/${lang}/for-online-sellers`} className="underline underline-offset-4">
              {lang === "rw" ? "Ku bacuruza kuri interineti" : "For online sellers"}
            </a>
            <a
              href={`/${lang}/for-farmers-and-cooperatives`}
              className="underline underline-offset-4"
            >
              {lang === "rw" ? "Ku bahinzi na koperative" : "For farmers and cooperatives"}
            </a>
            <a href={`/${lang}/for-students`} className="underline underline-offset-4">
              {lang === "rw" ? "Ku banyeshuri" : "For students"}
            </a>
            <a href={`/${lang}/shipping-fragile-items`} className="underline underline-offset-4">
              {lang === "rw" ? "Kohereza ibicuruzwa bimeneka" : "Shipping fragile items"}
            </a>
            <a href={`/${lang}/about-nyxarith`} className="underline underline-offset-4">
              {lang === "rw" ? "Ibyerekeye Nyxarith" : "About Nyxarith"}
            </a>
            <a href={`/${lang}/contact`} className="underline underline-offset-4">
              {lang === "rw" ? "Uko wavugana natwe" : "Contact"}
            </a>
            <a href={`/${lang}/cargo/kigali-to-musanze`} className="underline underline-offset-4">
              Kigali to Musanze
            </a>
            <a href={`/${lang}/cargo/kigali-to-huye`} className="underline underline-offset-4">
              Kigali to Huye
            </a>
            <a href={`/${lang}/cargo/kigali-to-rubavu`} className="underline underline-offset-4">
              Kigali to Rubavu
            </a>
            <a href={`/${lang}/cargo/kigali-to-rusizi`} className="underline underline-offset-4">
              Kigali to Rusizi
            </a>
          </nav>
        </section>

        <section aria-label="Cargo shortcuts">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{t("home.shortcuts")}</h2>
            <span className="text-xs font-medium text-muted-foreground">
              {t("home.shortcutsHint")}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {secondary.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="group flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1 font-semibold">{label}</span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </ClientShell>
  );
}
