import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, adminVisionQuery } from "@/packages/api/services";
import { formatDate } from "@/packages/i18n";
import { Button, Card, EmptyState, ErrorState, LoadingList, StatusPill } from "@/packages/ui";

export const Route = createFileRoute("/admin/vision")({ component: Vision });

function Vision() {
  const qc = useQueryClient();
  const q = useQuery(adminVisionQuery());
  const m = useMutation({ mutationFn: (id: string) => adminApi.resolveVision(id, { decision: "approve" }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "vision"] }) });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cargo vision review</h1>
      {q.isPending ? <LoadingList /> : q.error ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data.length === 0 ? <EmptyState title="Nothing to review" body="Low-confidence cargo analyses will appear here." /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {q.data.map((r) => (
            <Card key={r.id} className="space-y-3">
              <div className="flex gap-2 overflow-x-auto">{r.imageUrls.map((u) => <img key={u} src={u} alt="Cargo" loading="lazy" className="size-24 rounded-lg object-cover" />)}</div>
              <div className="flex items-center justify-between"><p className="font-semibold">{r.analysis.category}</p><StatusPill tone={r.analysis.confidence < 0.5 ? "danger" : "warning"}>{Math.round(r.analysis.confidence * 100)}%</StatusPill></div>
              <p className="text-sm text-muted-foreground">{r.analysis.estimatedWeightKg != null && `~${r.analysis.estimatedWeightKg} kg · `}{formatDate(r.createdAt)}</p>
              <Button size="sm" variant="success" loading={m.isPending && m.variables === r.id} onClick={() => m.mutate(r.id)}>Approve</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
