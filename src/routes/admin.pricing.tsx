import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminApi, adminPricingQuery } from "@/packages/api/services";
import type { PricingRule } from "@/packages/types";
import { Button, Card, EmptyState, ErrorState, Input, LoadingList } from "@/packages/ui";

export const Route = createFileRoute("/admin/pricing")({ component: Pricing });

function RuleRow({ rule }: { rule: PricingRule }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(String(rule.value));
  const m = useMutation({ mutationFn: (patch: { value?: number; active?: boolean }) => adminApi.updatePricingRule(rule.id, patch), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "pricing"] }) });
  return (
    <Card className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex-1"><p className="font-semibold">{rule.name}</p>{rule.description && <p className="text-sm text-muted-foreground">{rule.description}</p>}</div>
      <div className="flex items-center gap-2">
        <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-32" aria-label={`${rule.name} value`} />
        <span className="w-16 text-sm text-muted-foreground">{rule.unit}</span>
        <Button size="sm" disabled={Number(value) === rule.value} loading={m.isPending} onClick={() => m.mutate({ value: Number(value) })}>Save</Button>
        <Button size="sm" variant={rule.active ? "subtle" : "outline"} onClick={() => m.mutate({ active: !rule.active })}>{rule.active ? "Active" : "Inactive"}</Button>
      </div>
      {m.error && <p className="text-sm text-destructive">{m.error.message}</p>}
    </Card>
  );
}

function Pricing() {
  const q = useQuery(adminPricingQuery());
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pricing rules</h1>
      <p className="text-sm text-muted-foreground">All prices shown to clients are computed by the pricing service from these rules. Changes are audited server-side.</p>
      {q.isPending ? <LoadingList /> : q.error ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : q.data.length === 0 ? <EmptyState title="No pricing rules defined" /> : q.data.map((r) => <RuleRow key={r.id} rule={r} />)}
    </div>
  );
}
