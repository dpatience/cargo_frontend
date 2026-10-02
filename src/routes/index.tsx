import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Package, PackageOpen, Search } from "lucide-react";
import { ClientShell } from "@/apps/client/ClientShell";
import { useI18n } from "@/packages/i18n";
import { buttonVariants } from "@/packages/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tembera Cargo — Send anything across Rwanda" },
      { name: "description", content: "Send, track and receive cargo anywhere in Rwanda. Snap a photo, get a clear price in RWF, and follow your delivery." },
      { property: "og:title", content: "Tembera Cargo — Send anything across Rwanda" },
      { property: "og:description", content: "From your door to their door, Tembera Cargo finds the way." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const secondary = [
    { to: "/track", icon: Search, label: t("home.track") },
    { to: "/receive", icon: PackageOpen, label: t("home.receive") },
    { to: "/shipments", icon: Package, label: t("home.mine") },
  ] as const;
  return (
    <ClientShell>
      <section className="relative -mx-4 -mt-6 overflow-hidden bg-glow px-4 pb-10 pt-12 md:rounded-b-3xl md:pt-20">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-accent"><MapPin className="size-3.5" />Rwanda</p>
          <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">{t("home.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("home.subtitle")}</p>
        </div>
        <Link to="/send" className={cn(buttonVariants({ variant: "hero", size: "xl", block: true }), "mt-8 justify-between md:max-w-md")}>
          <span className="text-left">
            <span className="block">{t("home.send")}</span>
            <span className="block text-sm font-medium opacity-80">{t("home.sendHint")}</span>
          </span>
          <ArrowRight className="size-6" />
        </Link>
      </section>
      <section className="mt-6 grid grid-cols-3 gap-3">
        {secondary.map((s) => (
          <Link key={s.to} to={s.to} className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent/50">
            <s.icon className="size-6 text-accent" />
            <span className="text-sm font-semibold leading-tight">{s.label}</span>
          </Link>
        ))}
      </section>
    </ClientShell>
  );
}
