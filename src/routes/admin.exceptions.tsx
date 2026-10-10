import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  adminApi,
  adminExceptionsQuery,
  adminFailedNotificationsQuery,
} from "@/packages/api/services";
import { formatDate } from "@/packages/i18n";
import { Button, Card, EmptyState, ErrorState, Field, Input, LoadingList } from "@/packages/ui";

export const Route = createFileRoute("/admin/exceptions")({ component: Exceptions });

function Exceptions() {
  const qc = useQueryClient();
  const [shipmentId, setShipmentId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("customer_support");
  const exceptions = useQuery(adminExceptionsQuery());
  const failures = useQuery(adminFailedNotificationsQuery());

  const open = useMutation({
    mutationFn: () => adminApi.openException({ shipmentId, category, description }),
    onSuccess: async () => {
      setShipmentId("");
      setDescription("");
      await qc.invalidateQueries({ queryKey: ["admin", "operations", "exceptions"] });
      await qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
  const correct = useMutation({
    mutationFn: ({
      id,
      status,
      reason,
      currentCargoPointId,
    }: {
      id: string;
      status: string;
      reason: string;
      currentCargoPointId?: string;
    }) => adminApi.correctShipment(id, { status, reason, currentCargoPointId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "operations", "exceptions"] });
      await qc.invalidateQueries({ queryKey: ["admin", "shipments"] });
      await qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
  const resolve = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      adminApi.resolveException(id, resolution),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "operations", "exceptions"] });
      await qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    open.mutate();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Operations exceptions</h1>
        <p className="text-sm text-muted-foreground">
          Record support or custody issues here. Shipment corrections require a reason and append a
          permanent event; they never edit the event history.
        </p>
      </header>

      <Card>
        <form className="space-y-3" onSubmit={submit}>
          <h2 className="font-semibold">Open an exception</h2>
          <Field label="Shipment ID">
            <Input
              required
              value={shipmentId}
              onChange={(event) => setShipmentId(event.target.value)}
            />
          </Field>
          <Field label="Category">
            <select
              className="w-full rounded-xl border border-input bg-surface p-3"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="customer_support">Customer support</option>
              <option value="custody">Custody</option>
              <option value="delivery">Delivery</option>
              <option value="pricing">Pricing</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Issue details">
            <textarea
              required
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-xl border border-input bg-surface p-3"
            />
          </Field>
          {open.error && (
            <p role="alert" className="text-sm text-destructive">
              {open.error.message}
            </p>
          )}
          <Button type="submit" loading={open.isPending}>
            Open exception
          </Button>
        </form>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Open cases</h2>
        {exceptions.isPending ? (
          <LoadingList />
        ) : exceptions.error ? (
          <ErrorState error={exceptions.error} onRetry={() => exceptions.refetch()} />
        ) : exceptions.data.items.length === 0 ? (
          <EmptyState title="No open exceptions" />
        ) : (
          exceptions.data.items.map((item) => (
            <ExceptionCard
              key={item.id}
              item={item}
              busy={correct.isPending || resolve.isPending}
              onCorrect={(status, reason, currentCargoPointId) =>
                correct.mutate({ id: item.id, status, reason, currentCargoPointId })
              }
              onResolve={(resolution) => resolve.mutate({ id: item.id, resolution })}
            />
          ))
        )}
        {(correct.error || resolve.error) && (
          <p role="alert" className="text-sm text-destructive">
            {correct.error?.message ?? resolve.error?.message}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Terminal notification failures</h2>
        {failures.isPending ? (
          <LoadingList />
        ) : failures.error ? (
          <ErrorState error={failures.error} onRetry={() => failures.refetch()} />
        ) : failures.data.items.length === 0 ? (
          <EmptyState title="No failed notifications" />
        ) : (
          failures.data.items.map((failure) => (
            <Card key={failure.id} className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-medium">
                  {failure.trackingCode} · {failure.kind.replaceAll("_", " ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {failure.eventStatus} · {failure.attempts} attempts ·{" "}
                  {failure.lastError ?? "Unknown provider error"}
                </p>
              </div>
              <time className="text-sm text-muted-foreground">{formatDate(failure.updatedAt)}</time>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}

function ExceptionCard({
  item,
  busy,
  onCorrect,
  onResolve,
}: {
  item: {
    id: string;
    trackingCode: string;
    category: string;
    description: string;
    createdAt: string;
  };
  busy: boolean;
  onCorrect: (status: string, reason: string, currentCargoPointId?: string) => void;
  onResolve: (resolution: string) => void;
}) {
  const [status, setStatus] = useState("picked_up");
  const [reason, setReason] = useState("");
  const [resolution, setResolution] = useState("");
  const [currentCargoPointId, setCurrentCargoPointId] = useState("");

  return (
    <Card className="space-y-3">
      <div>
        <p className="font-semibold">
          {item.trackingCode} · {item.category.replaceAll("_", " ")}
        </p>
        <p className="text-sm">{item.description}</p>
        <time className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</time>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            onCorrect(
              status,
              reason,
              status === "at_station" ? currentCargoPointId || undefined : undefined,
            );
          }}
        >
          <label className="block space-y-1 text-sm">
            <span>Correct status (may reverse)</span>
            <select
              className="w-full rounded-xl border border-input bg-surface p-2"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {["created", "picked_up", "at_station", "in_transit", "delivered", "cancelled"].map(
                (value) => (
                  <option key={value} value={value}>
                    {value.replaceAll("_", " ")}
                  </option>
                ),
              )}
            </select>
          </label>
          <Input
            required
            maxLength={2000}
            placeholder="Reason for correction"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          {status === "at_station" && (
            <Input
              required
              placeholder="Active cargo point ID"
              value={currentCargoPointId}
              onChange={(event) => setCurrentCargoPointId(event.target.value)}
            />
          )}
          <Button type="submit" size="sm" loading={busy}>
            Correct shipment
          </Button>
        </form>
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            onResolve(resolution);
          }}
        >
          <label className="block space-y-1 text-sm">
            <span>Resolve without changing shipment status</span>
            <Input
              required
              maxLength={2000}
              placeholder="Resolution details"
              value={resolution}
              onChange={(event) => setResolution(event.target.value)}
            />
          </label>
          <Button type="submit" size="sm" variant="outline" loading={busy}>
            Resolve case
          </Button>
        </form>
      </div>
    </Card>
  );
}
