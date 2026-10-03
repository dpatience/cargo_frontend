import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Navigation } from "lucide-react";
import { driverApi } from "@/packages/api/services";
import { AuthGate } from "@/packages/ui/auth";
import { Button, LanguageSwitcher, Logo, OfflineBanner } from "@/packages/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/driver")({
  head: () => ({
    meta: [
      { title: "Tembera Cargo Driver" },
      { name: "description", content: "Driver app for Tembera Cargo: jobs, handoffs and proof of delivery." },
      { property: "og:title", content: "Tembera Cargo Driver" },
      { property: "og:description", content: "Pickups, handoffs and deliveries for Tembera Cargo drivers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DriverLayout,
});

function LocationToggle() {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (!on || !navigator.geolocation) return;
    let last = 0;
    const id = navigator.geolocation.watchPosition(
      (p) => { if (Date.now() - last < 20_000) return; last = Date.now(); driverApi.sendLocation(p.coords.latitude, p.coords.longitude, p.coords.accuracy).catch(() => setErr(true)); },
      () => setErr(true), { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [on]);
  return (
    <button onClick={() => { setErr(false); setOn(!on); }} aria-pressed={on} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold", on ? (err ? "bg-warning/15 text-warning" : "bg-success/15 text-success") : "bg-secondary text-muted-foreground")}>
      <Navigation className="size-3.5" />{on ? (err ? "Location issue" : "Sharing location") : "Location off"}
    </button>
  );
}

function DriverLayout() {
  return (
    <AuthGate area="driver" signIn="otp" label="Driver">
      {(signOut) => (
        <div className="min-h-screen">
          <OfflineBanner />
          <header className="sticky top-0 z-20 border-b border-border bg-sidebar">
            <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-2 px-4">
              <Link to="/driver"><Logo suffix="Driver" /></Link>
              <div className="flex items-center gap-2">
                <LocationToggle />
                <LanguageSwitcher />
                <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out"><LogOut className="size-4" /></Button>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-3xl px-4 py-6"><Outlet /></main>
        </div>
      )}
    </AuthGate>
  );
}
