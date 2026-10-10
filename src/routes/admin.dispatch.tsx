import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminCargoPointsQuery, dispatchApi } from "@/packages/api/services";
import { Button, Card, EmptyState, ErrorState, Field, LoadingList } from "@/packages/ui";

export const Route = createFileRoute("/admin/dispatch")({ component: Dispatch });

function Dispatch() {
  const qc = useQueryClient();
  const queue = useQuery({
    queryKey: ["admin", "dispatch", "shipments"],
    queryFn: dispatchApi.queue,
  });
  const drivers = useQuery({
    queryKey: ["admin", "dispatch", "drivers"],
    queryFn: dispatchApi.drivers,
  });
  const points = useQuery(adminCargoPointsQuery());
  const [shipmentId, setShipmentId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [cargoPointId, setCargoPointId] = useState("");
  const [type, setType] = useState<"pickup" | "handoff" | "delivery">("pickup");
  const assign = useMutation({
    mutationFn: () =>
      dispatchApi.assign({
        shipmentId,
        driverId,
        cargoPointId: cargoPointId || undefined,
        type,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "dispatch", "shipments"] });
      setShipmentId("");
    },
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Manual dispatch</h1>
        <p className="text-sm text-muted-foreground">
          Assign each movement to a Cargo driver. Station operators scan custody at their assigned
          cargo point.
        </p>
      </header>
      {(queue.error || drivers.error || points.error || assign.error) && (
        <ErrorState error={queue.error ?? drivers.error ?? points.error ?? assign.error} />
      )}
      {queue.isPending || drivers.isPending || points.isPending ? (
        <LoadingList />
      ) : (
        <>
          <Card>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                assign.mutate();
              }}
            >
              <Field label="Shipment">
                <select required value={shipmentId} onChange={(event) => setShipmentId(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-surface px-3">
                  <option value="">Choose a shipment</option>
                  {queue.data?.map((shipment) => (
                    <option key={shipment.id} value={shipment.id}>
                      {shipment.trackingCode} · {shipment.status}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Driver">
                <select required value={driverId} onChange={(event) => setDriverId(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-surface px-3">
                  <option value="">Choose an active driver</option>
                  {drivers.data?.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name ?? driver.phone ?? driver.id}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Job">
                <select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="h-12 w-full rounded-xl border border-input bg-surface px-3">
                  <option value="pickup">Home pickup</option>
                  <option value="handoff">Hub / station handoff</option>
                  <option value="delivery">Address delivery</option>
                </select>
              </Field>
              <Field label="Cargo point (optional)">
                <select value={cargoPointId} onChange={(event) => setCargoPointId(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-surface px-3">
                  <option value="">Use shipment address</option>
                  {points.data?.filter((point) => point.isActive).map((point) => (
                    <option key={point.id} value={point.id}>{point.code} · {point.name}</option>
                  ))}
                </select>
              </Field>
              <Button className="md:col-span-2" loading={assign.isPending}>Assign manual job</Button>
            </form>
          </Card>
          {!queue.data?.length && (
            <EmptyState title="No shipments ready for dispatch" body="Created or in-transit shipments will appear here." />
          )}
        </>
      )}
    </div>
  );
}
