import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Feather, Home, Package, Search, User } from "lucide-react";
import { useI18n } from "@/packages/i18n";
import { LanguageSwitcher, Logo, OfflineBanner } from "@/packages/ui";
import { cn } from "@/lib/utils";

function useLowData() {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(localStorage.getItem("tembera-cargo:lowdata") === "1"); }, []);
  useEffect(() => { document.documentElement.classList.toggle("lowdata", on); }, [on]);
  return [on, (v: boolean) => { setOn(v); localStorage.setItem("tembera-cargo:lowdata", v ? "1" : "0"); }] as const;
}

export function ClientShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [low, setLow] = useLowData();
  const nav = [
    { to: "/app", icon: Home, label: t("brand.name").split(" ")[0] },
    { to: "/track", icon: Search, label: t("nav.track") },
    { to: "/shipments", icon: Package, label: t("nav.shipments") },
    { to: "/account", icon: User, label: t("nav.account") },
  ] as const;
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link to="/app" aria-label={t("brand.name")}><Logo /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.slice(1).map((n) => (
              <Link key={n.to} to={n.to} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground bg-secondary" }}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLow(!low)} aria-pressed={low} className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold", low ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground")}>
              <Feather className="size-3.5" />{low ? t("lowdata.on") : t("lowdata.off")}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 md:pb-12">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur md:hidden">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/app" }} className="flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground" activeProps={{ className: "text-accent" }}>
            <n.icon className="size-5" />{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
