import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Feather, Home, Package, PackagePlus, Search, User } from "lucide-react";
import { useI18n } from "@/packages/i18n";
import { LanguageSwitcher, Logo, OfflineBanner } from "@/packages/ui";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

function useLowData() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(localStorage.getItem("tembera-cargo:lowdata") === "1");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("lowdata", on);
  }, [on]);
  return [
    on,
    (v: boolean) => {
      setOn(v);
      localStorage.setItem("tembera-cargo:lowdata", v ? "1" : "0");
    },
  ] as const;
}

export function ClientShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [low, setLow] = useLowData();
  const nav = [
    { to: "/app", icon: Home, label: t("nav.home") },
    { to: "/send", icon: PackagePlus, label: t("nav.send") },
    { to: "/track", icon: Search, label: t("nav.track") },
    { to: "/shipments", icon: Package, label: t("nav.shipments") },
    { to: "/account", icon: User, label: t("nav.account") },
  ] as const;
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/app" aria-label={t("brand.name")} className="shrink-0">
            <Logo compact />
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {nav.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/app" }}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <button
              onClick={() => setLow(!low)}
              aria-label={low ? t("lowdata.on") : t("lowdata.off")}
              aria-pressed={low}
              title={low ? t("lowdata.on") : t("lowdata.off")}
              className={cn(
                "flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold",
                low ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground",
              )}
            >
              <Feather className="size-3.5" />
              <span className="hidden sm:inline">{low ? t("lowdata.on") : t("lowdata.off")}</span>
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:pb-12">{children}</main>
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/app" }}
            className="flex min-w-0 flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold leading-none text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            activeProps={{ className: "text-accent" }}
          >
            <n.icon className="size-5" />
            <span className="max-w-full truncate">{n.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
