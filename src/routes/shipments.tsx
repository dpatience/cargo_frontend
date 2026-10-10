import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClientShell } from "@/apps/client/ClientShell";
import { myShipmentsQuery } from "@/packages/api/services";
import { formatDate, useI18n } from "@/packages/i18n";
import { OtpSignIn, useToken } from "@/packages/ui/auth";
import {
  buttonVariants,
  Card,
  EmptyState,
  ErrorState,
  LoadingList,
  StatusPill,
} from "@/packages/ui";

export const Route = createFileRoute("/shipments")({
  head: () => ({
    meta: [
      { title: "My shipments — Tembera Cargo" },
      {
        name: "description",
        content: "All the cargo you've sent with Tembera Cargo, with live status.",
      },
      { property: "og:title", content: "My shipments — Tembera Cargo" },
      { property: "og:description", content: "All your Tembera Cargo shipments in one place." },
    ],
  }),
  component: Shipments,
});

function List() {
  const { t } = useI18n();
  const q = useQuery(myShipmentsQuery());
  if (q.isPending) return <LoadingList />;
  if (q.error) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  if (q.data.items.length === 0)
    return (
      <EmptyState
        title={t("state.empty.shipments")}
        action={
          <Link to="/send" className={buttonVariants({ variant: "hero" })}>
            {t("home.send")}
          </Link>
        }
      />
    );
  return (
    <div className="space-y-3">
      {q.data.items.map((s) => (
        <Link key={s.id} to="/track/$code" params={{ code: s.trackingCode }} className="block">
          <Card className="flex items-center justify-between gap-3 hover:border-accent/50">
            <div>
              <p className="font-semibold">
                {s.origin} → {s.destination}
              </p>
              {(s.originSource === "google" || s.destinationSource === "google") && (
                <p className="text-xs text-muted-foreground">Google Maps</p>
              )}
              <p className="text-sm text-muted-foreground">
                {s.trackingCode} · {formatDate(s.createdAt)}
              </p>
            </div>
            <StatusPill tone={s.status === "delivered" ? "success" : "info"}>
              {s.statusLabel ?? s.status}
            </StatusPill>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function Shipments() {
  const { t } = useI18n();
  const { token, ready, save } = useToken("client");
  return (
    <ClientShell>
      <h1 className="mb-6 text-2xl font-bold">{t("nav.shipments")}</h1>
      {!ready ? null : token ? (
        <List />
      ) : (
        <>
          <p className="mb-4 text-muted-foreground">{t("state.signInNeeded")}</p>
          <OtpSignIn area="client" onDone={save} />
        </>
      )}
    </ClientShell>
  );
}
