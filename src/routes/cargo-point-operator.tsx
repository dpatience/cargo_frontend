import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AuthGate } from "@/packages/ui/auth";
import { Button, Logo } from "@/packages/ui";

export const Route = createFileRoute("/cargo-point-operator")({
  head: () => ({
    meta: [
      { title: "Cargo point operations — Tembera Cargo" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CargoPointOperatorLayout,
});

function CargoPointOperatorLayout() {
  return (
    <AuthGate area="cargo_point_operator" signIn="otp" label="Cargo-point operator">
      {(signOut) => (
        <div className="mx-auto min-h-screen max-w-2xl px-4 py-5">
          <header className="mb-6 flex items-center justify-between">
            <Logo suffix="Cargo point" />
            <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </header>
          <Outlet />
        </div>
      )}
    </AuthGate>
  );
}
