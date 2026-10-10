import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AlertTriangle, LayoutDashboard, LogOut, MapPin, Package, Tags, Truck } from "lucide-react";
import { AuthGate } from "@/packages/ui/auth";
import { Button, Logo, OfflineBanner } from "@/packages/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Tembera Cargo Administration" },
      {
        name: "description",
        content:
          "Operations console for Tembera Cargo: shipments, pricing and cargo vision review.",
      },
      { property: "og:title", content: "Tembera Cargo Administration" },
      { property: "og:description", content: "Operations console for Tembera Cargo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/shipments", label: "Shipments", icon: Package },
  { to: "/admin/pricing", label: "Pricing", icon: Tags },
  { to: "/admin/exceptions", label: "Exceptions", icon: AlertTriangle },
  { to: "/admin/cargo-points", label: "Cargo points", icon: MapPin },
  { to: "/admin/dispatch", label: "Dispatch", icon: Truck },
] as const;

function AdminLayout() {
  return (
    <AuthGate area="admin" signIn="password" label="Admin">
      {(signOut) => (
        <div className="flex min-h-screen flex-col md:flex-row">
          <aside className="border-b border-sidebar-border bg-sidebar md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
            <div className="flex h-16 items-center px-4">
              <Logo suffix="Admin" />
            </div>
            <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: "exact" in n }}
                  className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
                  activeProps={{
                    className: "bg-sidebar-accent text-sidebar-foreground font-semibold",
                  }}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              ))}
              <Button variant="ghost" size="sm" className="justify-start md:mt-4" onClick={signOut}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </nav>
          </aside>
          <div className="flex-1">
            <OfflineBanner />
            <main className="mx-auto max-w-6xl p-4 md:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </AuthGate>
  );
}
