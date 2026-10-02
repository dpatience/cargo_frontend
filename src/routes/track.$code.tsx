import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClientShell } from "@/apps/client/ClientShell";
import { ShipmentView } from "@/apps/client/ShipmentTimeline";
import { trackingQuery } from "@/packages/api/services";
import { ApiError } from "@/packages/api/client";
import { useI18n } from "@/packages/i18n";
import { EmptyState, ErrorState, LoadingList } from "@/packages/ui";
import { TrackCodeForm } from "./track.index";

export const Route = createFileRoute("/track/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Shipment ${params.code} — Tembera Cargo` },
      { name: "description", content: `Live status for Tembera Cargo shipment ${params.code}.` },
      { property: "og:title", content: `Shipment ${params.code} — Tembera Cargo` },
      { property: "og:description", content: "Follow this shipment across Rwanda." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { code } = Route.useParams();
  const { t } = useI18n();
  const q = useQuery(trackingQuery(code));
  return (
    <ClientShell>
      <div className="mx-auto max-w-2xl space-y-6">
        {q.isPending ? <LoadingList /> :
          q.error ? (q.error instanceof ApiError && q.error.kind === "not_found"
            ? <><EmptyState title={t("track.notFound")} /><TrackCodeForm /></>
            : <ErrorState error={q.error} onRetry={() => q.refetch()} />)
          : <ShipmentView s={q.data} />}
      </div>
    </ClientShell>
  );
}
