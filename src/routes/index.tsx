import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ExternalLink,
  MapPin,
  Package,
  PackageOpen,
  Search,
  Users,
} from "lucide-react";
import { ClientShell } from "@/apps/client/ClientShell";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
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
    {
      to: "/track",
      icon: Search,
      label: t("home.track"),
      description:
        lang === "rw" ? "Reba amakuru aheruka ku rugendo" : "See the latest shipment updates",
    },
    {
      to: "/receive",
      icon: PackageOpen,
      label: t("home.receive"),
      description: lang === "rw" ? "Reba aho imizigo yawe igeze" : "Check a delivery sent to you",
    },
    {
      to: "/shipments",
      icon: Package,
      label: t("home.mine"),
      description: lang === "rw" ? "Reba imizigo wohereje" : "View the cargo you have sent",
    },
  ] as const;
  const guideGroups = [
    {
      title: lang === "rw" ? "Menya uko serivisi ikora" : "Learn about cargo delivery",
      icon: BookOpen,
      links: [
        {
          href: `/${lang}/cargo`,
          label: lang === "rw" ? "Gutwara imizigo mu Rwanda" : "Cargo delivery across Rwanda",
        },
        { href: `/${lang}/how-it-works`, label: lang === "rw" ? "Uko ikora" : "How it works" },
        { href: `/${lang}/pricing`, label: lang === "rw" ? "Ibiciro" : "Pricing and quotes" },
        {
          href: `/${lang}/safety-and-trust`,
          label: lang === "rw" ? "Umutekano n'icyizere" : "Safety and trust",
        },
        { href: `/${lang}/coverage`, label: lang === "rw" ? "Aho dukorera" : "Coverage" },
        {
          href: `/${lang}/how-to-send-a-package`,
          label: lang === "rw" ? "Uko wohereza imizigo" : "How to send a package",
        },
        {
          href: `/${lang}/track-a-package`,
          label: lang === "rw" ? "Uko ukurikirana imizigo" : "How to track a package",
        },
        {
          href: `/${lang}/guides/cargo-vs-courier-vs-bus`,
          label: lang === "rw" ? "Gereranya uburyo bwo kohereza" : "Compare delivery options",
        },
      ],
    },
    {
      title: lang === "rw" ? "Ku bohereza imizigo bose" : "Guides for every sender",
      icon: Users,
      links: [
        {
          href: `/${lang}/for-small-businesses`,
          label: lang === "rw" ? "Ku bucuruzi buto" : "For small businesses",
        },
        {
          href: `/${lang}/for-online-sellers`,
          label: lang === "rw" ? "Ku bacuruza kuri interineti" : "For online sellers",
        },
        {
          href: `/${lang}/for-farmers-and-cooperatives`,
          label: lang === "rw" ? "Ku bahinzi na koperative" : "For farmers and cooperatives",
        },
        { href: `/${lang}/for-students`, label: lang === "rw" ? "Ku banyeshuri" : "For students" },
        {
          href: `/${lang}/shipping-fragile-items`,
          label: lang === "rw" ? "Kohereza ibicuruzwa bimeneka" : "Shipping fragile items",
        },
      ],
    },
    {
      title: lang === "rw" ? "Inzira zikunze gukoreshwa" : "Popular cargo routes",
      icon: MapPin,
      links: [
        { href: `/${lang}/cargo/kigali-to-musanze`, label: "Kigali to Musanze" },
        { href: `/${lang}/cargo/kigali-to-huye`, label: "Kigali to Huye" },
        { href: `/${lang}/cargo/kigali-to-rubavu`, label: "Kigali to Rubavu" },
        { href: `/${lang}/cargo/kigali-to-rusizi`, label: "Kigali to Rusizi" },
      ],
    },
  ] as const;
  const serviceLinks = [
    {
      href: `https://tembera.nyxarith.com/${lang}/`,
      label: lang === "rw" ? "Amatike ya bisi za Tembera" : "Tembera intercity bus tickets",
    },
    {
      href: `https://kigali.tembera.nyxarith.com/${lang}/`,
      label: lang === "rw" ? "Gukurikirana bisi za Tembera Kigali" : "Tembera Kigali bus tracking",
    },
    {
      href: "https://nyxarith.com/",
      label:
        lang === "rw" ? "Nyxarith, ikigo gikora Tembera" : "Nyxarith, the company behind Tembera",
    },
  ] as const;

  return (
    <ClientShell>
      <CloudflareWebAnalytics />
      <div className="space-y-8 md:space-y-10">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface shadow-card">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-glow opacity-90" />
          <div className="grid min-h-[28rem] items-center lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-6 pb-8 pt-9 sm:px-10 sm:pb-10 sm:pt-12 lg:px-12 lg:py-14">
              <Link
                to="/send"
                className={cn(
                  buttonVariants({ variant: "hero", size: "xl" }),
                  "group mb-8 w-full justify-between gap-6 rounded-2xl px-5 shadow-cta sm:w-auto sm:min-w-72",
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
            </div>

            <div
              className="relative mx-4 mb-5 flex min-h-64 items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/80 bg-background/40 sm:mx-8 sm:mb-8 lg:mx-7 lg:my-7 lg:min-h-[24rem]"
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
              <div className="absolute bottom-4 left-4 rounded-xl border border-border bg-card/90 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-card backdrop-blur sm:bottom-5 sm:left-5">
                {t("home.send")}
                <span className="ml-2 text-accent">↗</span>
              </div>
              <div className="absolute right-4 top-4 size-3 rotate-45 rounded-sm border border-accent/70 bg-accent/10 sm:right-5 sm:top-5" />
            </div>
          </div>
        </section>

        <section aria-label="Cargo shortcuts">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-2xl font-semibold">{t("home.shortcuts")}</h2>
            <span className="text-sm text-muted-foreground">{t("home.shortcutsHint")}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {secondary.map(({ to, icon: Icon, label, description }) => (
              <Link
                key={to}
                to={to}
                className="group flex min-h-32 items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{label}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {description}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="cargo-faq-title" className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">
              {lang === "rw" ? "Ubufasha" : "Good to know"}
            </p>
            <h2 id="cargo-faq-title" className="mt-1 font-display text-2xl font-semibold">
              {copy.faqTitle}
            </h2>
          </div>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card px-5">
            {copy.faqs.map(({ question, answer }) => (
              <details key={question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold leading-6 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <h3>{question}</h3>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-3xl pt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="cargo-guides-title" className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">
              {lang === "rw" ? "Ubufasha n'amakuru" : "Explore"}
            </p>
            <h2 id="cargo-guides-title" className="mt-1 font-display text-2xl font-semibold">
              {lang === "rw"
                ? "Inama n'amakuru kuri Tembera Cargo"
                : "Tembera Cargo guides and information"}
            </h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {guideGroups.map(({ title, icon: Icon, links }) => (
              <details
                key={title}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display font-semibold marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="size-4" />
                    </span>
                    <h3>{title}</h3>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  />
                </summary>
                <nav aria-label={title} className="mt-3 flex flex-col divide-y divide-border">
                  {links.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="group flex items-center justify-between gap-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span>{label}</span>
                      <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </nav>
              </details>
            ))}
          </div>
        </section>

        <footer className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold">
              {lang === "rw" ? "Serivisi za Tembera" : "More from Tembera"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "rw"
                ? "Reba izindi serivisi n'ubufasha."
                : "Explore our other services or get in touch."}
            </p>
          </div>
          <nav aria-label="Tembera services" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {serviceLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{label}</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            ))}
            {[
              {
                href: `/${lang}/about-nyxarith`,
                label: lang === "rw" ? "Ibyerekeye Nyxarith" : "About Nyxarith",
              },
              {
                href: `/${lang}/help`,
                label: lang === "rw" ? "Ubufasha n'ibibazo" : "Help and FAQs",
              },
              {
                href: `/${lang}/contact`,
                label: lang === "rw" ? "Uko wavugana natwe" : "Contact",
              },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{label}</span>
                <ArrowRight className="size-3.5 shrink-0" />
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </ClientShell>
  );
}
