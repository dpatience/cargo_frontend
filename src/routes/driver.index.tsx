import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { driverJobsQuery } from "@/packages/api/services";
import { Card, EmptyState, ErrorState, LoadingList, StatusPill } from "@/packages/ui";

export const Route = createFileRoute("/driver/")({ component: DriverHome });

const typeTone = { pickup: "info", handoff: "warning", delivery: "success" } as const;

function DriverHome() {
  const q = useQuery(driverJobsQuery());
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Today's jobs</h1>
      {q.isPending ? <LoadingList /> : q.error ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data.length === 0 ? <EmptyState title="No jobs assigned" body="New jobs will appear here when dispatch assigns them." /> : (
        q.data.map((j) => (
          <Link key={j.id} to="/driver/jobs/$id" params={{ id: j.id }} className="block">
            <Card className="flex items-center gap-4 hover:border-accent/50">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2"><StatusPill tone={typeTone[j.type]}>{j.type}</StatusPill><span className="text-xs text-muted-foreground">{j.trackingCode}</span></div>
                <p className="text-lg font-semibold">{j.address}</p>
                {j.cargoSummary && <p className="text-sm text-muted-foreground">{j.cargoSummary}</p>}
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
