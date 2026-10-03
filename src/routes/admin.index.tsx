import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardQuery } from "@/packages/api/services";
import { Card, EmptyState, ErrorState, Skeleton, StatusPill } from "@/packages/ui";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const q = useQuery(adminDashboardQuery());
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {q.isPending ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        : q.error ? <ErrorState error={q.error} onRetry={() => q.refetch()} />
        : (
          <>
            {q.data.metrics.length === 0 ? <EmptyState title="No metrics yet" /> : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {q.data.metrics.map((m) => (
                  <Card key={m.key}>
                    <p className="text-sm text-muted-foreground">{m.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold">{m.value}{m.unit && <span className="ml-1 text-base text-muted-foreground">{m.unit}</span>}</p>
                    {m.trend != null && <p className={m.trend >= 0 ? "text-sm text-success" : "text-sm text-destructive"}>{m.trend >= 0 ? "▲" : "▼"} {Math.abs(m.trend)}%</p>}
                  </Card>
                ))}
              </div>
            )}
            {q.data.alerts.length > 0 && (
              <Card className="space-y-2"><h2 className="font-semibold">Alerts</h2>
                {q.data.alerts.map((a) => <div key={a.id} className="flex items-center gap-3"><StatusPill tone={a.severity === "critical" ? "danger" : a.severity === "warning" ? "warning" : "info"}>{a.severity}</StatusPill><span className="text-sm">{a.message}</span></div>)}
              </Card>
            )}
          </>
        )}
    </div>
  );
}
